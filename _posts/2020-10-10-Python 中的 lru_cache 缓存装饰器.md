---
layout: post
tags: Python
excerpt_separator: <!--more-->
---

Python官方文档在介绍`lru_cache`时，举的例子就是斐波那契数列。

不用再介绍什么是斐波那契数列了吧，直接上代码：

<!--more-->

```python
def fib(x):
    if x <= 2:
        return x
    return fib(x-1) + fib(x-2)
```

很明显这是一个递归函数，要计算`fib(3)`，就要计算`fib(2) + fib(1)`，同理，要计算`fib(4)`，就要计算`fib(3) + fib(2)`。

那么就会发现，如果你要计算一个比较大的斐波那契数（比如`fib(100)`），那么较小的斐波那契数就要重复计算很多次（比如`fib(3)`、`fib(4)`、`fib(5)`等等），从而消耗很多的时间。

`lru_cache`装饰器的作用，就是让该函数“记住”之前代入某参数后运行**返回的结果**。之前计算过`fib(3)`，那么下次再计算`fib(3)`时就不用再走计算的过程了，直接返回结果。

该装饰器的用法很简单：

```python
from functools import lru_cache

@lru_cache()
def fib(x):
    if x <= 2:
        return x
    return fib(x-1) + fib(x-2)
```

由于`lru_cache`本质上是个装饰器工厂函数，所以需要加括号，让它返回一个装饰器函数。

`lru_cache`可以接受两个可选参数：

- `maxsize`：指定最大的缓存数量，默认值是`128`，为`None`时缓存可以无限制增长。
- `typed`：为`True`时则对于不同类型的参数将单独缓存（比如`f(3)`和`f(3.0)`将分开缓存），默认值为`False`。

`lru_cache`虽然很强大，但也有一些局限性，举个例子：

```python
from functools import lru_cache
from time import sleep

@lru_cache()
def foo(x, y):
    sleep(x)
    print(y)
```

以上这个例子中定义的`foo`函数作用非常简单：阻塞`x`秒，再打印参数`y`。

假设我们第一次执行`foo(5, "5")`，那么该函数会乖乖地休息5秒，然后打印一个5。

但如果我们第二次执行`foo(5, "5")`，那么结果（`None`）将立即返回，既没有阻塞也没有打印。

这也是我刚才所提到的：`lru_cache`**只关注被装饰函数返回的结果，并不关注被装饰函数的执行过程**，当`lru_cache`从缓存中取出执行结果时，被装饰的函数并没有被真正执行。

另外，一旦函数被`lru_cache`装饰之后，就不能使用不可哈希的参数了（比如列表、字典、集合），以上这个例子，尝试调用`foo(5, [1, 2])`会抛出`TypeError`异常，投机取巧使用`foo(5, (1, [2, 3]))`也是不行的。

总而言之，`lru_cache`的这些局限性决定了它不是想用就用的。
