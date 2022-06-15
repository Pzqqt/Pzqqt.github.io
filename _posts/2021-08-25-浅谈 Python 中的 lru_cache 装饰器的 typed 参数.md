---
layout: post
tags: Python
excerpt_separator: <!--more-->
---

稍微了解`lru_cache`装饰器的开发者应该都记得：

> 当传给`lru_cache`的`typed`参数为真值时，对不同类型的参数将单独缓存（比如`foo(3)`和`foo(3.0)`将分开缓存）

那么这有什么意义呢？在什么情况下需要将`typed`参数设为真值呢？

<!--more-->

要不我们做个假设：如果python标准库中没有`lru_cache`，需要你自己编写一个，你该怎么写？

这应该不是很难（让我们先不考虑最大缓存数量限制）：

```python
from functools import wraps

def my_lru_cache():

    # _saved字典用以保存缓存的返回值
    # 键为(位置参数, 关键字参数), 值为返回值
    _saved = {}

    def wrapper(func):
        # 使用wraps装饰器, 以保留被装饰函数(func)的元数据(比如函数的名字)
        @wraps(func)
        def _func(*args, **kwargs):
            # 用nonlocal关键字将_saved标记为自由变量
            # 原因:
            # 在_func中访问外部的_saved变量是可行的, 但是由于_saved不在_func的作用域中
            # 所以我们不能修改它, 若要修改_saved变量, 则必须将其标记为自由变量
            nonlocal _saved
            # 别忘了字典_saved的键必须是可哈希的
            # 所以需要把位置参数args(列表)和关键字参数kwargs(字典)转为可哈希的格式
            args_ = tuple(args)
            kwargs_ = frozenset(kwargs.items())
            # args_和kwargs_必须是可哈希的
            # 当位置参数和关键字参数中有不可哈希的参数时, 以下两行代码将抛出TypeError异常
            hash(args_)
            hash(kwargs_)
            # key_将作为_saved字典的键
            key_ = (args_, kwargs_)
            # 当装饰器已经缓存有func函数代入位置参数args和关键字参数kwargs的返回值时
            # 则在此直接返回已缓存的返回值
            if key_ in _saved.keys():
                # 调试: 当从_saved字典中取出已缓存的结果时, 打印一行"HIT!"
                print("HIT!")
                return _saved[key_]
            # 否则, 正常调用func函数, 取得返回值, 并保存(缓存)到_saved字典, 最后再将返回值返回
            result = func(*args, **kwargs)
            _saved[key_] = result
            return result
        return _func

    return wrapper

@my_lru_cache()
def foo(x):
    return x

print(foo(1))
# Output:
# 1

print(foo(1))
# Output:
# HIT!
# 1
```

就这样，你成功地编写了一个lru_cache装饰器！

让我们来看看有没有可改进的地方：

我们发现：使用`(位置参数, 关键字参数)`作为`_saved`的键有点奢侈（浪费内存），既然`key_`是可哈希的，那么用`hash(key_)`能够更高效一些。

以下是第一次改进后的`my_lru_cache`装饰器：

```python
from functools import wraps


def my_lru_cache():

    _saved = {}

    def wrapper(func):
        @wraps(func)
        def _func(*args, **kwargs):
            nonlocal _saved
            args_ = tuple(args)
            kwargs_ = frozenset(kwargs.items())
            # <<<<<<< 旧代码
            hash(args_)
            hash(kwargs_)
            key_ = (args_, kwargs_)
            # =======
            key_ = hash((args_, kwargs_))
            # >>>>>>> 新代码
            if key_ in _saved.keys():
                print("HIT!")
                return _saved[key_]
            result = func(*args, **kwargs)
            _saved[key_] = result
            return result
        return _func

    return wrapper
```

到此，先卖个关子，让我们将视角转向Django：

---

假设我们在应用中定义了两个模型：

```python
# models.py
from django.db import models


class Apple(models.Model):
    pass

class Banana(models.Model):
    pass
```

然后，假设我们创建并保存了一些Apple对象和Banana对象。

Django模型对象是可哈希的吗？当然是，让我们获取看看：

```python
from .models import Apple, Banana


apple = Apple.objects.first()
banana = Banana.objects.first()

print(hash(apple))
# Output: 1

print(hash(banana))
# Output: 1
```

为什么`apple`和`banana`的哈希值都是`1`呢？

让我们去Django的源码中找找`django.db.models.Model`的`__hash__`方法是怎么定义的：

```python
# django/db/models/base.py

...

class Model(metaclass=ModelBase):

    ...

    def __hash__(self):
        if self.pk is None:
            raise TypeError("Model instances without primary key value are unhashable")
        return hash(self.pk)

    ...
```

可以发现，对模型对象取哈希值时，返回的是模型对象主键的哈希值。

由于`Apple.objects.first()`和`Banana.objects.first()`的主键值都是`1`，所以`hash(1) == hash(1)`。

> 至于为什么`hash(1)`刚好是`1`，是因为python对这些较小的数字有优化。

那么，有了`hash(apple) == hash(banana)`，那么是不是`apple == banana`？怎么可能嘛！

```python
from .models import Apple, Banana


apple = Apple.objects.first()
banana = Banana.objects.first()

print(hash(apple) == hash(banana))
# Output: True

# apple当然不可能与banana相等, 见django.db.models.Model的__eq__方法
print(apple == banana)
# Output: False

print(apple is banana)
# Output: False
```

---

现在，让我们回过头再看刚才编写的`my_lru_cache`装饰器，会发现一个严重的问题：

以刚才的`apple`和`banana`举例，由于`hash(apple) == hash(banana)`，那么：

```python
from .models import Apple, Banana


apple = Apple.objects.first()
banana = Banana.objects.first()

def my_lru_cache():
    ... # 略

@my_lru_cache()
def foo(x):
    return x

print(foo(apple))
# Output:
# <Apple: Apple object (1)>

print(foo(banana))
# Output:
# HIT!
# <Apple: Apple object (1)>
```

看来，单纯地让`(位置参数, 关键字参数)`的哈希值作为`_saved`的键是不可取的，那么应该如何修正呢？

标准库中的`lru_cache`装饰器的做法是：若`typed`为真，在对`(位置参数, 关键字参数)`取哈希值时，同时也对这些参数的**类型**取哈希值：

```python
# functools.py

...

class _HashedSeq(list):
    ... # 略

def _make_key(args, kwds, typed,
             kwd_mark = (object(),),
             fasttypes = {int, str},
             tuple=tuple, type=type, len=len):
    key = args
    if kwds:
        key += kwd_mark
        for item in kwds.items():
            key += item
    if typed:
        key += tuple(type(v) for v in args)
        if kwds:
            key += tuple(type(v) for v in kwds.values())
    elif len(key) == 1 and type(key[0]) in fasttypes:
        return key[0]
    return _HashedSeq(key)

...
```

那么，我们也这样做：

```python
from functools import wraps


def my_lru_cache(typed=False):

    _saved = {}

    def wrapper(func):
        @wraps(func)
        def _func(*args, **kwargs):
            nonlocal _saved
            # <<<<<<< 旧代码
            args_ = tuple(args)
            kwargs_ = frozenset(kwargs.items())
            # =======
            if typed:
                args_ = tuple([(arg, type(arg)) for arg in args])
                kwargs_ = frozenset([
                    (k, (v, type(v))) for k, v in kwargs.items()
                ])
            else:
                args_ = tuple(args)
                kwargs_ = frozenset(kwargs.items())
            # >>>>>>> 新代码
            key_ = hash((args_, kwargs_))
            if key_ in _saved.keys():
                print("HIT!")
                return _saved[key_]
            result = func(*args, **kwargs)
            _saved[key_] = result
            return result
        return _func

    return wrapper
```

最后再加上非常非常重要的线程锁，移除调试，这就是最终版的`my_lru_cache`了：

```python
from functools import wraps
import threading


def my_lru_cache(typed=False):

    _saved = {}
    _lock = threading.RLock()

    def wrapper(func):
        @wraps(func)
        def _func(*args, **kwargs):
            nonlocal _saved
            if typed:
                args_ = tuple([(arg, type(arg)) for arg in args])
                kwargs_ = frozenset([
                    (k, (v, type(v))) for k, v in kwargs.items()
                ])
            else:
                args_ = tuple(args)
                kwargs_ = frozenset(kwargs.items())
            key_ = hash((args_, kwargs_))
            with _lock:
                if key_ in _saved.keys():
                    return _saved[key_]
            result = func(*args, **kwargs)
            with _lock:
                _saved[key_] = result
            return result
        return _func

    return wrapper
```

现在，你应该理解为什么`lru_cache`有一个可选的`typed`参数，以及在什么情况下需要将`typed`参数设为真值了吧。
