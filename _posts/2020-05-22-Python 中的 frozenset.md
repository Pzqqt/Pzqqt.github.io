---
layout: post
tags: Python
excerpt_separator: <!--more-->
---

撸码过程中，我遇到这么一个需求：

> 生成一个元组（tuple），元组里面含有字典（dict），再把这个元组塞到一个集合（set）里

<!--more-->

实际做起来，才发现自己还是图样。把字典塞到元组里是没啥问题，但是将元组塞到集合里时却失败了，解释器提示这个元组中的字典对象是不可哈希的。

元组本身不可变，所以可以塞到集合里，但是当元组里含有可变且不可哈希对象时，这个元组就也不可哈希了<del>（确切来说是该元组的`__hash__`方法抛出了TypeError异常）</del>。

如果将该字典转为元组 `tuple(dict_obj.items())`，理论上是可行的，但是元组是有序的，这不清真。

如果将该字典转为集合 `set(dict_obj.items())`，这样看起来很清真，但不可行且多此一举（集合跟字典一样是不可哈希对象）。

那该怎么办呢？好在Python的内置函数里有一个平时很少用到的`frozenset`函数（我也是在查阅了一些资料之后才知道的）。

`frozenset()`返回一个冻结的集合，该集合不能再添加或删除任何元素。

看起来frozenset对象是不可变的，那frozenset对象是不是可哈希对象呢？

```python
In[1]: frozenset().__hash__()
Out[1]: 133146708735736
```

是可哈希的！那么，将该字典转为frozenset `frozenset(dict_obj.items())`，就可以完美地满足一开始提出的需求了。

`frozenset`对象还可以直接和`dict_items`对象进行比较：

```python
In[2]: frozenset(dict_obj.items()) == dict_obj.items()
Out[2]: True
```

方便又省事！
