---
layout: post
tags: Android
excerpt_separator: <!--more-->
toc: true
---

> 注：原文于 *2021年12月17日* 在 [AKR社区](https://www.akr-developers.com/d/566-fdtget-fdtput-dtb) 首次发布，由于AKR社区网站已挂，于是。。。

闲来无事阅读dtc项目的源码时，意外地发现了开发者附赠的这两个小工具：

`fdtget`可以直接从dtb文件中读取任意节点的属性值。

`fdtput`可以直接修改dtb文件（添加/删除节点，添加/删除/修改属性）。

在之前，如果我们需要读取/修改dtb，就必须要用dtc反编译dtb为dts，修改dts后再用dtc回编译。现在有了`fdtget`和`fdtput`之后，一切都变得非常简单。

<!--more-->

# 1. 编译 fdtget 和 fdtput

首先，先`git clone https://github.com/dgibson/dtc`

然后，cd到这个目录，再无脑`make fdtget`和`make fdtput`就完事了。

试着执行一下`./fdtget`，你会得到如下提示：

```text
./fdtget: error while loading shared libraries: libfdt.so.1: cannot open shared object file: No such file or directory
```

原来是缺少`libfdt.so.1`库文件，它在哪呢？在`./libfdt/libfdt.so.1`，它在你刚才编译时一起生成了，并且是一个符号链接，指向`libfdt/libfdt-${dtc版本号}.so`。

试试`LD_LIBRARY_PATH=./libfdt/ ./fdtget`，这下就没问题了：

```text
Usage: read values from device tree
        fdtget <options> <dt file> [<node> <property>]...
        fdtget -p <options> <dt file> [<node> ]...

Each value is printed on a new line.
<type>  s=string, i=int, u=unsigned, x=hex, r=raw
        Optional modifier prefix:
                hh or b=byte, h=2 byte, l=4 byte (default)

Options: -[t:pld:hV]
  -t, --type <arg>    Type of data
  -p, --properties    List properties for each node
  -l, --list          List subnodes for each node
  -d, --default <arg> Default value to display when the property is missing
  -h, --help          Print this help and exit
  -V, --version       Print version and exit

Error: missing filename
```

编译fdtput的过程和fdtget是类似的，具体不再赘述。

# 2. 静态编译 fdtget 和 fdtput

出于某些目的，你可能需要静态编译它们。

此时你需要阅读Makefile文件，看看是否支持直接静态编译，如果不支持就需要手动修改Makefile文件，在适当的位置加上`-static`等参数。

如果你懒得试，也可以像我一样把必要的文件放在一起一股脑编译：

```shell
# 以编译fdtget为例, 如果要编译fdtget, 把fdtget.c换成fdtput.c就可以了
# 至于为什么是编译这些文件, 你需要阅读Makefile
gcc \
  fdtget.c util.c \
  libfdt/fdt.c libfdt/fdt_ro.c libfdt/fdt_wip.c libfdt/fdt_sw.c \
  libfdt/fdt_rw.c libfdt/fdt_strerror.c libfdt/fdt_empty_tree.c \
  libfdt/fdt_addresses.c libfdt/fdt_overlay.c libfdt/fdt_check.c \
  -I ./libfdt -I . -static \
  -o ./fdtget
```

看看我们编译得到的可执行文件的大小，938Kb，strip之后是857Kb。

# 3. 使用 Android NDK 静态编译 fdtget 和 fdtput

如果你要在Android平台使用`fdtget`和`fdtput`的话，比起使用arm/aarch64编译器，我更推荐你使用Android NDK进行编译。

> The NDK allows Android application developers to include native code in their Android application packages, compiled as JNI shared libraries. (来自Google官方的介绍)

你可以从Google那里下载到最新版本的Android NDK，但是版本太新的话有可能会导致兼容性问题。

所以，在此推荐使用Magisk开发者topjohnwu提供的 [Franke NDK](https://github.com/topjohnwu/FrankeNDK)。

> 使用过程中需要注意的事项，请阅读README.md。

下载好Franke NDK之后，你需要在一开始你克隆的dtc源码目录里编写`jni/Android.mk`和`jni/Application.mk`文件。这两个文件的作用类似Makefile。

如果你懒得学习如何编写这俩文件的话，可以直接抄我的作业：

```makefile
# jni/Android.mk

# 为啥APP_PLATFORM要设置为android-16?
# 一个是为了兼容性, 另一个是Franke NDK提示你这样设置编译得到的可执行文件是最小的
APP_PLATFORM := android-16
APP_PIE      := true
LOCAL_PATH   := $(call my-dir)

# 编译fdtget
include $(CLEAR_VARS)
LOCAL_MODULE            := fdtget
LOCAL_MODULE_FILENAME   := fdtget
LOCAL_SRC_FILES         := ../fdtget.c ../util.c ../libfdt/fdt.c ../libfdt/fdt_ro.c ../libfdt/fdt_wip.c ../libfdt/fdt_sw.c ../libfdt/fdt_rw.c ../libfdt/fdt_strerror.c ../libfdt/fdt_empty_tree.c ../libfdt/fdt_addresses.c ../libfdt/fdt_overlay.c ../libfdt/fdt_check.c
LOCAL_C_INCLUDES        := $(LOCAL_PATH)/../libfdt
LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/../libfdt
LOCAL_CFLAGS            := -Os
LOCAL_LDFLAGS           := -static
include $(BUILD_EXECUTABLE)

# 然后编译fdtput
include $(CLEAR_VARS)
LOCAL_MODULE            := fdtput
LOCAL_MODULE_FILENAME   := fdtput
LOCAL_SRC_FILES         := ../fdtput.c ../util.c ../libfdt/fdt.c ../libfdt/fdt_ro.c ../libfdt/fdt_wip.c ../libfdt/fdt_sw.c ../libfdt/fdt_rw.c ../libfdt/fdt_strerror.c ../libfdt/fdt_empty_tree.c ../libfdt/fdt_addresses.c ../libfdt/fdt_overlay.c ../libfdt/fdt_check.c
LOCAL_C_INCLUDES        := $(LOCAL_PATH)/../libfdt
LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/../libfdt
LOCAL_CFLAGS            := -Os
LOCAL_LDFLAGS           := -static
include $(BUILD_EXECUTABLE)
```

```makefile
# jni/Application.mk

APP_PLATFORM := android-16
APP_PIE	     := true
```

然后，将Franke NDK目录的绝对路径添加到环境变量PATH：

```shell
export PATH=${PATH}:/home/pzqqt/build_toolchain/FrankeNDK
```

运行`ndk-build NDK_DEBUG=0 APP_ABI=armeabi-v7a`就可以开始编译了。

> 为什么APP_ABI参数是`armeabi-v7a`？还是为了兼容性，你还可以在`arm64-v8a` `x86` `x86_64` `all`之间进行选择。

```text
$ ndk-build NDK_DEBUG=0 APP_ABI=armeabi-v7a
[armeabi-v7a] Compile thumb  : fdtput <= fdtput.c
[armeabi-v7a] Compile thumb  : fdtput <= util.c
[armeabi-v7a] Compile thumb  : fdtput <= fdt.c
[armeabi-v7a] Compile thumb  : fdtput <= fdt_ro.c
[armeabi-v7a] Compile thumb  : fdtput <= fdt_wip.c
[armeabi-v7a] Compile thumb  : fdtput <= fdt_sw.c
[armeabi-v7a] Compile thumb  : fdtput <= fdt_rw.c
[armeabi-v7a] Compile thumb  : fdtput <= fdt_strerror.c
[armeabi-v7a] Compile thumb  : fdtput <= fdt_empty_tree.c
[armeabi-v7a] Compile thumb  : fdtput <= fdt_addresses.c
[armeabi-v7a] Compile thumb  : fdtput <= fdt_overlay.c
[armeabi-v7a] Compile thumb  : fdtput <= fdt_check.c
[armeabi-v7a] Executable     : fdtput
[armeabi-v7a] Install        : fdtput => libs/armeabi-v7a/fdtput
```

可以看到编译产物在libs/armeabi-v7a/fdtput，那么这次生成的可执行文件有多大呢？

只有68Kb！要知道这可是静态编译啊！

# 4. 使用 fdtget

`fdtget`的使用方法在帮助信息里已经写很明确了。你可以一边阅读dts一边试用。

简单来说，dtb也类似于Linux文件系统的目录，它也有个“根目录”，举个例子：

```text
/dts-v1/;

/ {
	#address-cells = <0x02>;
	#size-cells = <0x02>;
	model = "Qualcomm Technologies, Inc. SDM 636 PM660 + PM660L E7S";
	compatible = "qcom,sdm636-mtp\0qcom,sdm636\0qcom,mtp";
	qcom,msm-id = <0x159 0x00>;
	interrupt-parent = <0x01>;
	qcom,board-id = <0x10008 0x00>;
	qcom,pmic-id = <0x1001b 0x101011a 0x00 0x00 0x1001b 0x201011a 0x00 0x00>;

	cpus {
		#address-cells = <0x02>;
		#size-cells = <0x00>;

		cpu@0 {
			device_type = "cpu";
			compatible = "arm,kryo";
			reg = <0x00 0x00>;
			/* 下略*/
```

可以看到：

- 根目录是`/`，`cpus`是根目录下的子目录，而`cpu@0`是`cpus`的子目录。在这里不应该称作目录，应该称作节点(node)。
- 其他的`键 = 值;`的行，则为对应节点下的属性(property)和值。值的类型有字符串、十进制、十六进制和字节。

举几个栗子：

```shell
# 查询/节点下有哪些子节点
./fdtget <dtb文件> / -l
# 查询/节点下有哪些属性
./fdtget <dtb文件> / -p
# 查询/cpus/cpu@0节点下compatible属性的值
./fdtget <dtb文件> /cpus/cpu@0 compatible
# 搭配-t参数可以以指定类型返回属性值
```

> 注意：dts文件中的井号(#)没有注释作用，所以使用fdtget和fdtput时遇到井号请注意转义，或者使用单引号包裹。

可以看到`fdtget`也有自己的局限性：不支持更加高级的查询（搜索、遍历）。

# 5. 使用 fdtput

`fdtput`就很牛逼了，添加/删除节点，添加/删除/修改属性，样样皆可。

不多说，直接上例子：

```shell
# 新增/foo节点
./fdtput <dtb文件> -c /foo
# 新增/foo/bar节点, 如果/foo节点不存在则自动创建
./fdtput <dtb文件> -cp /foo/bar
# 删除/bar节点(同时删除其所有子节点和属性)
./fdtput <dtb文件> -r /bar
# 在/foo节点创建或修改key1属性, 值为"value1", 字符串类型
./fdtput <dtb文件> /foo key1 value1 -ts
# 在/foo节点创建或修改key2属性, 值为2, 无符号十进制类型
./fdtput <dtb文件> /foo key2 2 -tu
# 在/foo节点创建或修改key3属性, 值为0xff, 十六进制类型
./fdtput <dtb文件> /foo key3 0xff -tx
# 在/foo节点创建或修改key4属性, 不设置值
./fdtput <dtb文件> /foo key4
# 在/foo节点创建或修改key5属性, 值为<0x8 0x9 0xa>, 十六进制数组类型
./fdtput <dtb文件> /foo key5 0x8 0x9 0xa -tx
# 在/foo节点创建或修改key6属性, 值为[7e 7e 7e], 字节串类型
./fdtput <dtb文件> /foo key6 7e 7e 7e -tbx
# 删除/foo节点下的key4属性
./fdtput <dtb文件> /foo key4 -d
```

列举几种特殊情况：

- dts里，若有多个值包括在尖括号里边，则为数组。
- 数组中的每个十六进制值的大小为4 byte，即取值范围为`0x0` ~ `0xffffffff`。
- dts里，若有多个值包括在方括号里边，则为字节串，每个值的大小是1 byte，那么，`[7e 7e 02 02 02 02 02 02]`等价于`<0x7e7e0202 0x02020202>`，但`[7e 7e 7e]`不等价于`<0x7e7e7e>`（因为前者是3 byte，后者是4 byte）。
- 属性值也可以是由逗号分割的多个字符串，例如`interrupt-names = "hap-sc-irq", "hap-play-irq";`，反编译dtb的话则得到`interrupt-names = "hap-sc-irq\0hap-play-irq";`，所以反过来修改属性时不要傻乎乎地带`\0`，多个字符串作为多个参数传给`fdtput`就可以了。
