---
layout: post
tags: RaspberryPi
excerpt_separator: <!--more-->
---

RaspberryPi官方总是会为设备提供最新的longterm版内核，很棒。

但是，用的编译器还是用古董级的gcc 8.4.0，而且编译了1579次了都不`make clean`的，属实不能忍。

<!--more-->

```shell
pi@raspberrypi:~ $ cat /proc/version
Linux version 5.15.61-v8+ (dom@buildbot) (aarch64-linux-gnu-gcc-8 (Ubuntu/Linaro 8.4.0-3ubuntu1) 8.4.0, GNU ld (GNU Binutils for Ubuntu) 2.34) #1579 SMP PREEMPT Fri Aug 26 11:16:44 BST 2022
```

于是只能“重操旧业”，自己编译内核。

好在 [官方文档有关Linux内核的部分](https://www.raspberrypi.com/documentation/computers/linux_kernel.html) 已经把如何编译和安装内核介绍得很详细了，按照这个步骤来，不会有太大的问题。

> 本文假设你的RaspberryPi使用的操作系统是官方的Raspberry Pi OS（Raspbian），如果是其他操作系统可能会有所出入，请以实际为准。

> 温馨提示：强烈不建议在RaspberryPi上编译内核，一是RaspberryPi性能孱弱，二是TF卡读写速度感人（有人尝试过在RaspberryPi上编译内核，编译过程耗时3个小时...）。建议找一台性能足够的PC进行交叉编译。

# 准备工作

首先，从 [raspberrypi/linux](https://github.com/raspberrypi/linux) 拉取源码。当前官方使用的是5.15版本的内核，所以我们只需拉取`rpi-5.15.y`分支即可。

```shell
git clone https://github.com/raspberrypi/linux.git -b rpi-5.15.y
```

> 如果你只是编译一次玩玩的话，可以在clone时加上`--depth=1`参数，这会加快拉取速度，并且减少存储空间占用。

然后，确认一下你的RaspberryPi的Soc是什么架构，以及你的RaspberryPi当前使用的操作系统是32位还是64位。对于安装了64位系统的RaspberryPi 4B来说，应该为arm64。

明确之后，就要去找对应架构的gcc交叉编译工具链。你可以直接通过软件包管理器安装对应架构的交叉编译工具链，也可以从网上下载。

我使用的是 [Arm Developer网站提供的Arm GNU工具链](https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads) 。

{% include pure-img-responsive.html url="/images/e36_p1.jpg" a_class="pure-u-md-3-4" %}

当前最新的是`11.3.Rel1`版本，但为了稳定，我还是选择`11.2-2022.02`版本。

根据你的编译机环境，选择对应的版本。下载之后，找个地方解压。

# 编译

打开终端，cd到内核源码目录。

然后，明确应该使用哪个defconfig文件。根据官方文档的提示，对于RaspberryPi 4B来说，应该使用`bcm2711_defconfig`。

> 为了方便与官方内核区分，你可以修改该defconfig文件中的`CONFIG_LOCALVERSION`项来自定义内核版本字符串。

在终端执行：

```shell
# CROSS_COMPILE参数是你的交叉编译工具链
# 如果你使用的是从网上下载的gcc编译器, 记得要么填完整的绝对路径, 要么把它加到PATH环境变量里
export PATH=/home/pzqqt/build_toolchain/gcc-arm-11.2-2022.02-x86_64-aarch64-none-linux-gnu/bin:${PATH}

make ARCH=arm64 CROSS_COMPILE=aarch64-none-linux-gnu- bcm2711_defconfig
```

然后正式开始编译：

```shell
# -j参数表示用几个线程进行编译, 为了效率最大化, 这个数最好等于你的编译机CPU核心数, 或者稍大于这个数
make -j6 ARCH=arm64 CROSS_COMPILE=aarch64-none-linux-gnu-
```

然后静静等待编译完成，在CPU i5-10500H、内存16G的笔记本电脑上，这个过程需要6~8分钟。

完成之后，我们就可以收获现阶段的成果了：

- 内核：`./arch/arm64/boot/Image.gz`
- 设备树（以下简称dtb）：`./arch/arm64/boot/dts/broadcom`目录下的所有dtb文件
- 设备树overlays（以下简称dtbo）：`./arch/arm64/boot/dts/overlays`目录下的所有dtbo文件

把它们复制出来：

```shell
rm -rf /home/pzqqt/kr4b_release
mkdir -p /home/pzqqt/kr4b_release
mkdir -p /home/pzqqt/kr4b_release/overlays

cp ./arch/arm64/boot/Image.gz /home/pzqqt/kr4b_release/
cp ./arch/arm64/boot/dts/broadcom/*.dtb /home/pzqqt/kr4b_release/
cp ./arch/arm64/boot/dts/overlays/*.dtbo /home/pzqqt/kr4b_release/overlays/
```

之后，还需要再安装内核模块。

如果是在RaspberryPi上编译的话，那我们直接把模块安装到RaspberryPi上就可以了。但是，我们现在是在另一台机器上进行交叉编译，没法这样做。

所以，先把内核模块“安装”到编译机上，然后“打包带走”，等稍后复制到RaspberryPi上再进行安装。

```shell
# 用python3生成一个保存内核模块的临时目录
OUT_MODULES=$(python3 -c "import tempfile; print(tempfile.mkdtemp(prefix='kr4b_'))")

# 创建这个临时目录
mkdir -p $OUT_MODULES

# 开始"安装"模块
sudo env PATH="$PATH" make -j6 \
    ARCH=arm64 \
    CROSS_COMPILE=aarch64-none-linux-gnu- \
    INSTALL_MOD_PATH=$OUT_MODULES \
    modules_install

# 模块被"安装"到了${OUT_MODULES}/lib/modules/{内核版本}目录
# 把${OUT_MODULES}/lib/modules/{内核版本}目录打包压缩为tar.gz
sudo tar -czf /home/pzqqt/kr4b_release/modules.tar.gz -C ${OUT_MODULES}/lib/modules .
```

# 安装

在之前的编译阶段，我们把编译产物都放到了编译机上的`/home/pzqqt/kr4b_release`目录：

```shell
pzqqt@LAPTOP:~/kr4b_release$ ls -l
total 28612
-rw-r--r-- 1 pzqqt pzqqt    30119 Sep  2 16:51 bcm2710-rpi-2-b.dtb
-rw-r--r-- 1 pzqqt pzqqt    32482 Sep  2 16:51 bcm2710-rpi-3-b-plus.dtb
-rw-r--r-- 1 pzqqt pzqqt    31871 Sep  2 16:51 bcm2710-rpi-3-b.dtb
-rw-r--r-- 1 pzqqt pzqqt    30106 Sep  2 16:51 bcm2710-rpi-cm3.dtb
-rw-r--r-- 1 pzqqt pzqqt    31179 Sep  2 16:51 bcm2710-rpi-zero-2-w.dtb
-rw-r--r-- 1 pzqqt pzqqt    31179 Sep  2 16:51 bcm2710-rpi-zero-2.dtb
-rw-r--r-- 1 pzqqt pzqqt    51955 Sep  2 16:51 bcm2711-rpi-4-b.dtb
-rw-r--r-- 1 pzqqt pzqqt    52087 Sep  2 16:51 bcm2711-rpi-400.dtb
-rw-r--r-- 1 pzqqt pzqqt    52540 Sep  2 16:51 bcm2711-rpi-cm4.dtb
-rw-r--r-- 1 pzqqt pzqqt    49870 Sep  2 16:51 bcm2711-rpi-cm4s.dtb
-rw-r--r-- 1 pzqqt pzqqt    20912 Sep  2 16:51 bcm2837-rpi-3-a-plus.dtb
-rw-r--r-- 1 pzqqt pzqqt    21777 Sep  2 16:51 bcm2837-rpi-3-b-plus.dtb
-rw-r--r-- 1 pzqqt pzqqt    21313 Sep  2 16:51 bcm2837-rpi-3-b.dtb
-rw-r--r-- 1 pzqqt pzqqt    20640 Sep  2 16:51 bcm2837-rpi-cm3-io3.dtb
-rw-r--r-- 1 pzqqt pzqqt  8484057 Sep  2 16:51 Image.gz
-rw-r--r-- 1 root  root  20288365 Sep  2 16:51 modules.tar.gz
drwxr-xr-x 2 pzqqt pzqqt    12288 Sep  2 16:51 overlays
```

把这个目录发送到你的RaspberryPi上（用U盘中转，或者scp直接发送，方法有很多），准备安装。

首先要搞明白，内核、dtb位于`/boot`目录，dtbo文件位于`/boot/overlays`目录，内核模块位于`/lib/modules`目录。

在不同型号的RaspberryPi上，内核文件的文件名也不一样。对于RaspberryPi 4B来说是`/boot/kernel8.img`。

为了防止意外，务必提前备份它们：

```shell
sudo mkdir -p /boot/BACKUP
sudo rm -rf /boot/BACKUP/*
sudo cp /boot/kernel8.img /boot/BACKUP/
sudo cp /boot/*.dtb /boot/BACKUP/
sudo cp -r /boot/overlays /boot/BACKUP/
```

内核模块不用备份，别把官方内核的内核模块给删了就行。

然后，在RaspberryPi上打开终端，cd到我们拷贝到这里的编译产物所在的目录。

## 安装内核、dtb、dtbo

```shell
echo "- Installing kernel..."
sudo cp -f ./Image.gz /boot/kernel8.img

echo "- Installing dtb & dtbo..."
sudo rm -f /boot/*.dtb
sudo rm -rf /boot/overlays
sudo cp ./*.dtb /boot/
sudo cp -rf ./overlays /boot/
```

## 安装内核模块

```shell
echo "- Installing kernel modules..."
sudo tar -xzf ./modules.tar.gz -C /lib/modules/
```

完成之后，重启RaspberryPi，成功开机后，执行`cat /proc/version`查看内核版本。

如果不幸翻车了，取下TF卡，想办法把我们之前备份的内核、dtb、dtbo还原回去就可以了。

值得一提的是，有时候你在用软件包管理器更新系统软件包时，内核也会一并更新。如果你还想使用自己编译的内核的话，按照上面的步骤重新安装内核、dtb、dtbo就可以了。

如果你曾经安装过多次自己编译的不同版本的内核，那么你可以把`/lib/modules/`目录下旧版本的内核模块目录给删了，别把官方内核的内核模块给删了就行。

# Tips

## 1. 使用clang编译内核

提前准备好clang工具链，添加其路径到`PATH`环境变量，然后，在之前执行的每一个make命令后面追加参数`LLVM=1 LLVM_IAS=1`就可以了。

## 2. 编译时启用3级优化

> 如果你使用clang编译内核，那么可以试试启用3级优化，如果是使用GCC编译内核则不建议。

在之前执行的每一个make命令后面追加参数`KCFLAGS=-O3`。
