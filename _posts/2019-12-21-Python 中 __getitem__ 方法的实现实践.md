---
layout: post
excerpt_separator: <!--more-->
---

偶然在网上发现这么一段Python代码：
```python
import numpy as np

a = np.array(range(15)).reshape(3,5)

print(a)
print(a[0])
print(a[1])
print(a[1, 2])
```

这段代码返回：

<!--more-->

```text
array([[ 0,  1,  2,  3,  4],
       [ 5,  6,  7,  8,  9],
       [10, 11, 12, 13, 14]])
0
1
7
```

由于我对numpy库了解的不多，所以可以猜测到`a[0]`返回的是矩阵里索引为0的元素，同理`a[1]`是返回索引为1的元素，但是令我无法理解的是`a[1, 2]`。

我首先想到的是：这代码是不符合Python语法的吧，假设`np.array`实例是个列表，那么方括号里应该只能填整数或是切片才对，填`1, 2`怎么行呢？

但是这确实没有问题，`a[1, 2]`返回了矩阵a的第2列第3个元素，这个不难理解。难不成numpy用了什么黑科技？

用ipython实践一下：
```python
In [1]: a = [x**2 for x in range(5)]

In [2]: a
Out[2]: [0, 1, 4, 9, 16]

In [3]: a[1, 2]
---------------------------------------------------------------------------
TypeError                                 Traceback (most recent call last)
<ipython-input-3-cff7934c3c80> in <module>
----> 1 a[1, 2]

TypeError: list indices must be integers or slices, not tuple
```
根据解释器的提示，可以得知方括号里的`1, 2`被解释器识别为了元组，即`(1, 2)`。

那么，假设我们重写list的某个魔术方法，是否就可以实现`a[1, 2]`“合法”化了呢？

说干就干，我们可以从`collections`模块的`UserList`类继承（不建议直接继承内建类list），编写一个新的类`MyList`，对`MyList`实例获取索引时除了整数或切片之外还可以传入元组，比如传入`1, 2`则分别返回`MyList`实例中索引为1和索引为2的元素。

首先阅读`UserDict`的代码：
```python
class UserList(_collections_abc.MutableSequence):
    """A more or less complete user-defined wrapper around list objects."""
    def __init__(self, initlist=None):
        self.data = []
        if initlist is not None:
            # XXX should this accept an arbitrary sequence?
            if type(initlist) == type(self.data):
                self.data[:] = initlist
            elif isinstance(initlist, UserList):
                self.data[:] = initlist.data[:]
            else:
                self.data = list(initlist)
...
    def __getitem__(self, i):
        if isinstance(i, slice):
            return self.__class__(self.data[i])
        else:
            return self.data[i]
...
```
我们可以重写`__getitem__`方法，使其可以接受并处理`tuple`对象。

`MyList`代码如下：
```python
class MyList(UserList):
    def __getitem__(self, i):
        if isinstance(i, tuple):
            return (self.data[x] for x in i)  # 返回的不是tuple而是生成器
        return super().__getitem__(i)  # 为了不影响原方法的功能 在此调用超类UserList的方法
```
试验一下：
```python
a = MyList([x**2 for x in range(5)])
print(a)
print(a[1, 2])
print(list(a[1, 2]))
```
返回如下：
```
[0, 1, 4, 9, 16]
<generator object MyList.__getitem__.<locals>.<genexpr> at 0x0000024EB6BF2C48>
[1, 4]
```
成功了！

学无止境啊。
