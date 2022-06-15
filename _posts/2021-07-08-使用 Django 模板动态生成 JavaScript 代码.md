---
layout: post
tags: Python Web
excerpt_separator: <!--more-->
---

{% raw %}
有些时候我们需要动态生成JavaScript代码，或是在JavaScript代码中使用Django的模板特性。

比如，在JavaScript代码中使用url标签：

<!--more-->

```javascript
$(document).ready(function() {
    $('form').submit(function(e) {
        e.preventDefault();
        $.post(
            "{% url 'foo:api_foo' %}",
            {
                "key": "value",
                "csrfmiddlewaretoken": $("[name='csrfmiddlewaretoken']").val(),
            },
            function(data, status) {
                if (data.status === "success") {
                    window.location.replace("{% url 'foo:bar' %}");
                } else {
                    console.log("提交失败！");
                }
            }
        )
    })
});
```

或者使用if标签：

```javascript
$(document).ready(function() {
    $('#button').onclick(function() {
      {% if not user_has_permission %}
        alert("你没有权限进行此操作。");
        return;
      {% else %}
        do_somethings();
      {% endif %}
    })
});
```

这样写JavaScript代码可能会有点...奇怪，不仅开发者觉得奇怪，IDE 也会觉得奇怪。

还有一个更极端的做法：把代码写到一个js文件中，然后在views.py中编写一个视图函数，用render函数“渲染”这个js文件：

```python
# views.py
def foo_js(request):
    return render(
        request,
        "path/to/js/file.js",
        content_type="text/javascript",
    )
```
```js
// path/to/js/file.js
$(document).ready(function() {
    $('#button').onclick(function() {
      {% if not user_has_permission %}
        alert("你没有权限进行此操作。");
        return;
      {% else %}
        do_somethings();
      {% endif %}
    })
    $('form').submit(function(e) {
        e.preventDefault();
        $.post(
            "{% url 'foo:api_foo' %}",
            {
                "key": "value",
                "csrfmiddlewaretoken": $("[name='csrfmiddlewaretoken']").val(),
            },
            function(data, status) {
                if (data.status === "success") {
                    window.location.replace("{% url 'foo:bar' %}");
                } else {
                    console.log("提交失败！");
                }
            }
        )
    })
});
```

这样做并没有什么问题，但是聪明的IDE会给你报一堆语法错误...有什么办法呢？

## 1. 把代码写在html的script标签里

```html
<script>
$(document).ready(function() {
    // ...
});
</script>
```

这样一来，IDE就不会报语法错误了，但是会产生两个问题：

1. html中嵌入过长的JavaScript代码会难以维护
2. 代码不能复用

这两个问题可以使用Django的自定义模板标签（`inclusion_tag`）来解决。

注册并定义模板标签：

```python
# app/templatetags/app_extras.py
from django import template

register = template.Library()


@register.inclusion_tag('app/_inclusions/foo.html')
def foo(string):
    return {"string": string}
```

编写该模板标签的渲染模板（注意外侧用`<script>`包裹）：

```html
<!-- app/templates/app/_inclusions/foo.html -->
<script>
$(document).ready(function() {
    let string = "{{ string }}";
    // ...
});
</script>
```

使用此模板标签：

```html
<!-- app/templates/app/bar.html -->
{% load app_extras %}

{% foo %}
```

## 2. 运用JavaScript注释“欺骗”IDE

> 注：这仅适用于引入js文件的情况

首先，仍然是给这个js文件编写一个视图函数（别忘了传递参数`content_type="text/javascript"`），并添加路由。

其次，修改用作“模板”的js文件的文件名后缀，改为`*.js.html`，这样IDE就会把它识别为html模板，但是里面写的还是纯JavaScript代码。

然后，在JavaScript代码前的一行，插入`// <script>`，在最后一行，插入`// </script>`，就像这样：

```html
{% load foo_extras %}
// <script>
$(document).ready(function() {
    // ...
});
// </script>
```
{% endraw %}

这样一来，IDE把我们刚才插入的`<script>`和`</script>`识别为了html标签，写在`<script>`里的JavaScript代码即使使用了模板标签也不会报语法错误。

{% include pure-img-responsive.html url="/images/e29_js_idea.png" a_class="pure-u-md-3-4" %}

而浏览器会把`// <script>`和`// </script>`当作注释，不会影响JavaScript代码的功能。

{% include pure-img-responsive.html url="/images/e29_js_chrome.png" a_class="pure-u-md-3-4" %}

妙！（好吧...我承认这更像是歪门邪道中的歪门邪道...）

## 总结

<del>少量、且不会复用的JavaScript代码，还是老老实实嵌入到html里吧...</del>根据实际情况和需求，选择最适合的解决方法吧。

*[IDE]: Integrated development environment, 集成开发环境
