---
layout: post
tags: Python
---

有时我们需要在父类定义一个方法，这个方法不允许在父类调用，子类若要调用则必须覆写此方法（这样的方法被称作抽象方法），那么可以这样写：

```python
class A:
    def foo(self):
        raise NotImplementedError

class B(A):
    def foo(self):
        # 重新实现foo方法
        pass

A().foo()  # 触发NotImplementedError异常
B().foo()  # 正常
```

然而在其他人写的代码中，可能用的不是`NotImplementedError`，而是`NotImplemented`，那么这两种写法有什么区别吗？

将以上代码中的`NotImplementedError`改为`NotImplemented`之后，使用pylint评估代码，会收到以下警告：

```
E0711: NotImplemented raised - should raise NotImplementedError (notimplemented-raised)
```

可以确定的是，如果要实现我们一开始提出的要求的话，使用`NotImplementedError`是没错的。

那么什么情况下应该使用`NotImplemented`呢？

《流畅的 Python》一书中第313页写道：

> 别把 NotImplemented 和 NotImplementedError 搞混了。前者是特殊的单例值，如果中缀运算符特殊方法不能处理给定的操作数，那么要把它返回（return）给解释器。而 NotImplementedError 是一种异常，抽象类中的占位方法把它抛出（raise），提醒子类必须覆盖。

如何理解这段话呢？可以参考书中第314页的代码：

```python
    def __add__(self, other):
        try:
            pairs = itertools.zip_longest(self, other, fillvalue=0.0)
            return Vector(a + b for a, b in pairs)
        except TypeError:
            return NotImplemented

    def __radd__(self, other):
        return self + other
```

结合书中这段代码下方作者给出的警告：

> 如果中缀运算符方法抛出异常，就终止了运算符分派机制。对 TypeError 来说，通常最好将其捕获，然后返回 NotImplemented。这样，解释器会尝试调用反向运算符方法，如果操作数是不同的类型，对调之后，反向运算符方法可能会正确计算。

那么可以做出总结了：

若你在自己编写的类中重载了中缀运算符特殊方法，如果该特殊方法不能处理给定的操作数，那么它应该返回*（抛出）*`NotImplemented`。这样做的好处是，解释器会在收到`NotImplemented`之后尝试调用反向运算符方法，使得代码更加健壮。
