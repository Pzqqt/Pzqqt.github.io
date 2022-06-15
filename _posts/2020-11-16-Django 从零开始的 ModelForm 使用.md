---
layout: post
tags: Python Web
excerpt_separator: <!--more-->
---

## 为什么要使用ModelForm？
当我刚开始知道Django有模型表单ModelForm这个玩意时其实我是拒绝的，有以下几点原因：

1. 把简单的事情复杂化：前端提供表单，后端`request.POST`接收表单数据，然后写入数据库，这么简单的事为啥我还要特地编写和配置一个ModelForm呢？<!--more-->
2. 配置ModelForm很麻烦：如果我想配置配置表单标签的各种样式或属性，那直接在前端模板修改就好了，但是在ModelForm里配置的话感觉很不灵活，不够自♂由。

但在之后的开发过程中，我发现这样子的话会遇到很多问题：

1. 表单项有很多的话，那么前端会有很多重复的代码。
2. 需要考虑每个表单字段使用什么样的表单标签，对于单选、复选、下拉列表标签的配置更是复杂。
3. 后端对每项表单数据进行合法性判断非常麻烦。
4. 在前端模板直接配置表单标签的各种属性，显得不够直观，可读性差，且难以维护。

使用ModelForm的话就能够轻易解决以上几个问题。

- 对于问题1：我们可以直接将ModelForm对象渲染到模板上，或者对ModelForm对象的fields进行遍历再渲染，甚至分别对各个field进行渲染，可以减少代码量。
- 对于问题2：ModelForm会将模型字段和表单字段对应起来，完全不必考虑“每个表单字段使用什么样的表单标签”的问题，对于单选、复选、下拉列表标签，ModelForm也会直接渲染好，非常省心。
- 对于问题3：在后端，ModelForm调用`is_valid()`方法即可完成数据合法性检查，有不合法的表单数据也可以通过`errors`属性获得友好的提示。
- 对于问题4：在继承的ModelForm类中，可以非常直观地对各项表单字段进行个别配置，易于维护，并且深入了解后就会发现，ModelForm其实可以非常自♂由地调整表单字段的属性。

## 定义模型表单
举个栗子，在当前应用中新建一个forms.py文件，然后开始编写模型表单类：
```python
# forms.py
from django import forms
from .models import Order

class OrderForm(forms.ModelForm):

    class Meta:
        model = Order
        fields = [
            "src_customer", "src_customer_name", "src_customer_phone",
            "dst_customer", "dst_customer_name", "dst_customer_phone",
            ...,
            "customer_remark",
        ]
        widgets = {
            "customer_remark": forms.Textarea(),
        }
```

在这里我们创建了一个订单（Order）的模型表单类，这个类继承自`django.forms.ModelForm`。

在OrderForm中我们又定义了一个Meta类，顾名思义，在这个类中编写的是OrderForm类的元数据。其中：
    
- `model`属性为你要关联的模型。
- `fields`属性为表单所包含的字段，有些字段我们不希望由用户填写（比如订单的创建时间），在这里我们就可以把它排除掉。
- `widgets`属性值为一个字典，我们可以在这里自定义某些表单字段类型，比如客户备注（"customer_remark"）字段，在模型中我定义为CharField，在渲染时就会显示为`<input>`标签，但我希望将它渲染成`<textarea>`，那么在这里设置就好了。

> 关于widgets可以使用哪些字段类型，可以参考[这篇文章](https://www.liujiangblog.com/course/django/156)。

> 不必编写完整的`fields`列表，直接在`exclude`属性中排除掉不需要的字段是更简单的一种方法。

> 除了以上提到的元属性，还有`labels` `help_texts` `error_messages` `localized_fields`等属性可以定制，在此不再细讲。

## 后端处理
在视图函数中应该如何使用呢？还是直接举例
```python
# views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils.safestring import SafeString

from .forms import OrderForm

def add_order(request):
    if request.method == "GET":  # 1
        form = OrderForm()
        return render(
            request,
            'order/add_order.html',
            {"form": form}
        )
    if request.method == "POST":
        form = OrderForm(request.POST)  # 2
        if form.is_valid():  # 3
            form.save()  # 4
            messages.info(
                request,
                "提交成功！",
            )
        else:
            messages.error(
                request,
                SafeString("<br>".join([
                    "提交失败！",
                    form.errors.as_ul(),  # 5
                ])),
            )
        return redirect("order:add_order")
```
1. 在处理GET请求时，我们生成一个OrderForm对象，然后传递给模板由模板进行渲染，关于在模板中如何渲染表单稍后再讲。
2. 在处理POST请求时，使用`OrderForm(request.POST)`即可获得保存了表单提交数据的OrderForm对象。
3. 对该对象调用`is_valid()`方法之后即可判断表单数据是否合法，比如模型的某个字段为EmailField，如果你用的是传统方法，那么在后端你需要编写一个长长的正则表达式来判断用户输入的是不是一个合法的邮箱地址，但现在我们不需要了，一个`is_valid()`方法就可以完成对所有表单项的合法性判断。
4. 对该对象调用`save()`方法之后即可保存并写入到数据库。如果你还需要进一步调整不想立即写入，可以`new_order = form.save(commit=False)`，调整好之后再`new_order.save()`即可，这样做的话需要注意：如果你的模型中包含多对多关系的字段，那么在此之后还需要`form.save_m2m()`才能保存。
5. 调用`is_valid()`方法之后，即可通过`errors`属性获得表单中填写不合法的字段以及提示信息。在这里我使用了`SafeString`，如果不使用的话字符串中的html标签将会在渲染时被转义。

> `errors`属性为一个`django.forms.utils.ErrorDict`对象（本质上就是个字典，可以进行遍历），对该对象调用不同的方法可以返回不同格式的数据，比如`as_json()`返回json格式的数据，`as_ul()`返回html格式的字符串，`as_text()`返回格式化好的纯文本字符串，等等。

{% raw %}
## 前端渲染
ModelForm在前端该如何被渲染？先试试直接渲染ModelForm对象：
```html
          {% block content %}
            <form action="{% url 'order:add_order' %}" class="pure-form pure-form-stacked" method="post">
                <fieldset>
                    {% csrf_token %}
                    {{ form }}
                    <button type="submit" class="pure-button pure-button-primary">提交</button>
                </fieldset>
            </form>
          {% endblock %}
```
效果如下：

{% endraw %}
{% include pure-img-responsive.html url="/images/e26_01.jpg" a_class="pure-u-md-3-4" %}
{% raw %}

好像看起来有点太整齐了。我们可以对每个表单字段进行渲染，在这里我们用[PureCSS](https://purecss.io/)的网格布局对各个表单项进行布局：
```html
          {% block content %}
            <form action="{% url 'order:add_order' %}" class="pure-form pure-form-stacked" method="post">
                <fieldset>
                    {% csrf_token %}
                    <legend>发货人信息</legend>
                    <div class="pure-g">
                        <div class="pure-u-1 pure-u-md-1-3">
                            <label for="{{ form.src_customer.id_for_label }}">{{ form.src_customer.label }}</label>
                            {{ form.src_customer }}
                        </div>
                        <div class="pure-u-1 pure-u-md-1-6">
                            <label for="{{ form.src_customer_name.id_for_label }}">{{ form.src_customer_name.label }}</label>
                            {{ form.src_customer_name }}
                        </div>
                        <div class="pure-u-1 pure-u-md-1-3">
                            <label for="{{ form.src_customer_phone.id_for_label }}">{{ form.src_customer_phone.label }}</label>
                            {{ form.src_customer_phone }}
                        </div>
                    </div>
                    <legend>收货人信息</legend>
                    <div class="pure-g">
                        <div class="pure-u-1 pure-u-md-1-3">
                            <label for="{{ form.dst_customer.id_for_label }}">{{ form.dst_customer.label }}</label>
                            {{ form.dst_customer }}
                        </div>
                        <div class="pure-u-1 pure-u-md-1-6">
                            <label for="{{ form.dst_customer_name.id_for_label }}">{{ form.dst_customer_name.label }}</label>
                            {{ form.dst_customer_name }}
                        </div>
                        <div class="pure-u-1 pure-u-md-1-3">
                            <label for="{{ form.dst_customer_phone.id_for_label }}">{{ form.dst_customer_phone.label }}</label>
                            {{ form.dst_customer_phone }}
                        </div>
                    </div>
                    <legend>其他信息</legend>
                    <div class="pure-g">
                        <div class="pure-u-1 pure-u-md-1-6">
                            <label for="{{ form.fee.id_for_label }}">{{ form.fee.label }}</label>
                            {{ form.fee }}
                        </div>
                        <div class="pure-u-1 pure-u-md-1-3">
                            <label for="{{ form.customer_remark.id_for_label }}">{{ form.customer_remark.label }}</label>
                            {{ form.customer_remark }}
                        </div>
                    </div>
                    <button type="submit" class="pure-button pure-button-primary">提交</button>
                </fieldset>
            </form>
          {% endblock %}
```
现在的效果如下：

{% endraw %}
{% include pure-img-responsive.html url="/images/e26_02.jpg" a_class="pure-u-md-3-4" %}

是不是感觉上面的代码有点太过重复了？有两个办法：

1. 对form对象进行遍历，对每个字段用相同的格式进行渲染（不够灵活）。
2. 使用自定义模板标签templatetags来简化重复的部分（更加灵活）。

> 对于模型字段中没有定义`blank`属性的字段（即不允许该字段值为空字符串），在渲染表单时会自动加上`required`属性，表示该项为必填项。

## 对ModelForm进行进一步配置
还是举个例子：模型Order中的fee字段定义为FloatField，即浮点数，但经过OrderForm在前端渲染后，它渲染得和IntegerField一样，而且，在现代化的浏览器中，如果在该`<input>`标签中输入浮点数后提交表单，会提示用户输入整数并且拒绝提交。

解决方法就是在渲染的`<input>`中加一项步长`step`属性，如果要求输入值精确到1位小数，则设置`step`属性为0.1，两位小数则为0.01，以此类推。
```html
<input type="number" name="fee" step="0.1" required id="id_fee">
```
如何在OrderForm中直接定义好呢？可以在`__init__`方法中进行：
```python
# forms.py

...

class OrderForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["fee"].widget.attrs["step"] = "0.1"

    class Meta:
        ...
```
这样，我们就可以方便直观地对表单项进行定制了。
