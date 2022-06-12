*安装、配置、创建对象等基础方法就不赘述了，百毒随便一搜一大堆。*

## 元素选取
- `find_element_by_id` 按元素的id属性选取
- `find_element_by_name` 按元素的name属性选取
- `find_element_by_xpath` 按xpath选取
- `find_element_by_link_text` 按链接文本选取，匹配完整字符
- `find_element_by_partial_link_text` 按局部链接文本选取，匹配局部字符
- `find_element_by_tag_name` 按元素标签名选取
- `find_element_by_class_name` 按元素的class属性选取
- `find_element_by_css_selector` 按css选择器选取

这些方法中，最灵活最强大的就是“按xpath选取”了。有时使用其他方法在复杂页面中选取层级较深条件较多的元素时需要写很长一段语句，其实只需要简短的一行xpath表达式就能解决。强烈建议学习xpath语法，并多加实践加深印象。

推荐阅读这篇xpath教程：<a href="https://blog.csdn.net/ka_ka314/article/details/80997222" target="_blank">XPath --- 用法总结整理 By \__静禅__</a>

> 要说xpath唯一的缺点，应该是过长的xpath语句难以理解和维护。所以在编写xpath语句时要尽量减少使用绝对路径，更多地使用相对路径，可以有效减少代码量，使语句更加清晰。

“按元素的id属性选取”也是比较常用的方法，因为这个属性在页面中具有唯一性。

“按元素的name属性选取”适合在有表单页面中使用。

“按元素的class属性选取”和“按元素标签名选取”更适合在对元素对象（WebElement）再选取时使用。

“按css选择器选取”适合了解css选择器的开发者使用，这里推荐[一篇比较直观易懂的教程](https://www.cnblogs.com/huangjiyong/p/12217383.html)。

有时需要将匹配条件的多个元素全部选取，使用的方法和上面的方法一样，在方法名的`element`单词后面加一个`s`让它变为复数即可，即：

- `find_elements_by_id`
- `find_elements_by_name`
- `find_elements_by_xpath`
- `find_elements_by_link_text`
- `find_elements_by_partial_link_text`
- `find_elements_by_tag_name`
- `find_elements_by_class_name`
- `find_elements_by_css_selector`

这些方法将返回一个包含所有匹配条件的元素的列表。

> 注意：不是只有webdriver对象才可以调用以上方法选取，选取之后的元素对象（WebElement）也可以再进行选取。

**注意：自Selenium 4.0.0版本开始，`find_element_by_*`和`find_elements_by_*`的元素选取方法已被弃用。请用`find_element()`和`find_elements()`方法代替！**

## 元素点击
选取单个元素后调用`click()`方法即可：
```python
browser.find_element_by_id("submit").click()
```
页面中所有你认为可以点击的元素都可以点击的。如果你在尝试点击某个元素时抛出了异常并提示元素不可点击时，一般情况下都是因为元素被遮挡了（比如页面内的各种广告或弹窗），或是元素不可见。

## 键盘输入
如果你选中了一个可以输入文本的表单项，那么使用`send_keys()`方法即可向其中输入文本：
```python
browser.find_element_by_tag_name("input").send_keys("some text")
```
如果你想清除已输入的文本，使用`clear()`方法：
```python
browser.find_element_by_tag_name("input").clear()
```
绝大多数情况下输入文本时不需要考虑文本框内已输入的文本，那就简单写个函数来简化这两个步骤：
```python
def input_text(obj, text):
    # 清空并输入文本
    obj.clear()
    obj.send_keys(text)
```
如果要输入回车键，可以这样操作：
```python
from selenium.webdriver.common.keys import Keys

browser.find_element_by_tag_name("input").send_keys(Keys.ENTER)
```
其他一些按键，诸如空格键Tab键F1~F12键甚至是Ctrl组合键，也是可以输入的，不过最常用的还是回车键。如果确实遇到这些情况了再去查相应的资料吧。

## 获取元素属性
选取单个元素后调用`get_attribute()`方法：
```python
# 获取文本框中已输入的内容
browser.find_element_by_tag_name("input").get_attribute("value")

# 获取元素文本
browser.find_element_by_tag_name("label").text

# 获取元素标签名
browser.find_element_by_tag_name("label").tag_name
```

## 鼠标操作
某些情况下你需要把鼠标悬停到某元素上。Selenium能不能完成这一操作呢？答案是肯定的：
```python
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
 
driver = webdriver.Chrome()
driver.get("http://somedomain/url_that_delays_loading")
input_box = driver.find_element_by_tag_name("input")
ActionChains(driver).move_to_element(input_box).perform()
```
语句末尾的`perform()`是必不可少的，它的作用是执行所有 ActionChains 中存储的行为。

除了`move_to_element()`之外，还有一些其他的鼠标操作：

- `context_click(element)` 鼠标右击
- `double_click(element)` 鼠标双击
- `drag_and_drop(source, target)` 鼠标拖动

## 浏览器操作
- `back()` 后退
- `forward()` 前进
- `refresh()` 刷新页面

## 标签页操作
```python
# 新建一个标签页
browser.execute_script("window.open()")

# 获取所有标签页
print(browser.window_handles)

# 切换标签页
browser.switch_to_window(browser.window_handles[1])

# 关闭当前标签页
browser.close()

# 关闭浏览器对象(同时会关闭所有标签页)
browser.quit()
```
> 我在使用selenium 3.141.0版本时，调用`switch_to_window`方法会收到警告，提示改用`driver.switch_to.window`方法。

## Cookies 操作
```python
# 使用get_cookies()方法获取cookies
browser.get_cookies()

# 添加cookies
browser.add_cookie({"name": "foo", "value": "bar"})

# 删除所有cookies
browser.delete_all_cookies()
```

## 显式等待
有时候我们需要等待页面加载完成，或是判断页面中的某个元素是否已加载完成，对于第一种情况，强制等待`time.sleep()`当然是最简单粗暴极端的方法，但是简单地阻塞线程并不能满足第二种情况。此时我们可以使用更加优雅的显式等待方法。
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
 
driver = webdriver.Chrome()
driver.get("http://somedomain/url_that_delays_loading")
element = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "myDynamicElement"))
)
```
传递给`WebDriverWait`的第二个参数是超时时间，若超时则会触发一个`selenium.common.exceptions.TimeoutException`异常。

`presence_of_element_located`表示检查元素是否存在于页面中，程序默认会每0.5秒检查一次。

需要注意的是`presence_of_element_located`不关心元素是否可见，如果你要求要检查的元素是必须是可见的，使用`visibility_of_element_located`。

让我们看看`WebDriverWait`方法接受哪些参数：
```python
class WebDriverWait(object):
    def __init__(self, driver, timeout, poll_frequency=POLL_FREQUENCY, ignored_exceptions=None):
        # balabala...
```
- `driver`：即WebDriver实例
- `timeout`：超时时间
- `poll_frequency`：轮询检查间隔时间，默认是0.5秒
- `ignored_exceptions`：要忽略的异常

一些其他的内置条件：

- `title_is` 判断页面title（匹配完整字符）
- `title_contains` 判断页面title（匹配局部字符）
- `presence_of_element_located` 页面中存在此元素
- `visibility_of_element_located` 页面中存在此元素（必须是可见元素）
- `visibility_of` 同上，不过传入的参数是元素对象
- `invisibility_of_element_located` 页面中存在此元素（必须是<span style="color:red;">不</span>可见元素）
- `presence_of_all_elements_located` 所有元素加载完毕
- `text_to_be_present_in_element` 某个元素文本包含某文字
- `text_to_be_present_in_element_value` 某个元素value属性包含某文字
- `frame_to_be_available_and_switch_to_it` 判断frame是否可切入
- `element_to_be_clickable` 元素可点击
- `staleness_of` 判断一个元素是否仍在DOM，可判断页面是否已经刷新
- `element_located_to_be_selected` 元素可选择
- `element_to_be_selected` 元素可选择，传入的参数是元素对象
- `element_located_selection_state_to_be` 元素被选中
- `element_selection_state_to_be` 元素被选中，传入的参数是元素对象
- `alert_is_present` 是否出现Alert

> 1. 如果这些内置条件都不能满足你的需求，你完全可以自己写一个新的！`expected_conditions`的源码相当简单易读。
2. 如果你懒得用显式等待，用`while`循环和`sleep`也未尝不可。<del>大部分情况下你不需要关心代码写得好不好，你只需要关心程序能不能按照你的预期进行工作就行了。</del>

除了`until()`，你还可以使用`until_not()`，发挥想象力吧！

## 隐式等待
有了显式等待，就会有隐式等待。隐式等待是设置了一个最长等待时间。
```python
from selenium import webdriver
 
driver = webdriver.Chrome()
driver.implicitly_wait(10) # 单位：秒
driver.get("http://somedomain/url_that_delays_loading")
myDynamicElement = driver.find_element_by_id("myDynamicElement")
```
隐式等待在整个WebDriver的周期内都起作用，所以只要设置一次即可。但是<span style="color:red;">切记隐式等待不是time.sleep()</span>，所以必要时还是老老实实用`time.sleep()`吧。

设置隐式等待后会出现一些奇怪的问题，举个栗子，你要选取某个元素（或按匹配条件选取某些元素），这个元素可能不存在（或没有任何匹配条件的元素）。大部分情况下你肯定是希望没有找到元素的话就立即抛出异常（或返回一个空列表），但是如果你将隐式等待设置为10秒，那程序就会在这里傻傻的等待10秒。
> 所以我认为非特殊情况下不必使用隐式等待。如果你希望找不到元素就一直等待的话，那为何不用显式等待呢?

------

## 参考文献
1. <a href="https://blog.csdn.net/huilan_same/article/details/52544521">Python selenium —— 一定要会用selenium的等待，三种等待方式解读</a>
2. <a href="https://blog.csdn.net/liuchunming033/article/details/46789085">【selenium学习笔记】webdriver进行页面元素定位</a>
