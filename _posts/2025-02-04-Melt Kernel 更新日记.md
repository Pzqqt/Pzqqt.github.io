---
layout: post
tags: Android
excerpt_separator: <!--more-->
toc: true
---

*记录某菜鸡内核开发者开发某辣鸡内核的心路历程...*

<!--more-->

## Paradox Kernel v1.0 （2023.07.04）

作为Melt Kernel的首个版本，v1.0并没有什么特别之处，仅仅是在不破坏KMI的前提下按照我的想法和使用习惯稍微改了一点，比如：默认启用DAMON Reclaim、更新zstd库到v1.5.5、Boeffla唤醒锁阻止、ssg I/O scheduler，顺便合并了clo上游msm-5.10的代码（虽然并没有什么卵用）。

该版本的内核使用Google clang 12.0.5编译，本来打算用新版本的Google clang编译的，但试了之后开不了机，pstore也是炸的没法调试，只能作罢。

并且，由于我提前做了一些有关GKI 2.0的功课，了解了保持KMI稳定的重要性，因此后续所有版本的Melt Kernel都是以“不破坏KMI”为前提进行维护的。这里非常推荐读一读LibXZR大佬的这篇博客文章：[聊一聊内核模块和 GKI 相关的问题](https://blog.xzr.moe/archives/236/)。

顺便一提，Banner图也是我用Adobe Animate 2022随便画的，文字字体用的是Segoe Print。

## Paradox Kernel v1.1（2023.07.12）

从v1.1版本开始，我打算对供应商内核模块（以下全部简称内核模块）下手了。

在GKI 2.0，像是WiFi驱动、触屏驱动、以及厂商和供应商对内核添加的各种驱动和专属部件，都被编译成了内核模块。因此，如果想和v4.14一样把所有属于内核的东西全部换了，就必须同时把位于vendor_boot和vendor_dlkm分区的所有内核模块也全部换了，不然光是和GKI玩多没意思啊。

但是，vendor_boot和vendor_dlkm分区有很多小米不开源的内核模块（像是migt、millet这些），剔除它们也不太行，此时[我产生了让闭源内核模块和自编译的开源内核模块进行混搭的想法](https://t.me/pzqqt_c/4866)。

有了这个想法之后就先暂时搁置着，因为如何修改vendor_dlkm分区又是另一个难题。

因此，我打算先试着将一些内核模块编译进内核镜像（比如：扬声器功放芯片aw882xx的驱动）。

对于WiFi驱动qcacld-3.0，我本来也打算编译进内核镜像的，但无奈qcacld-3.0依赖cnss2，要想把qcacld-3.0编译进内核镜像就必须得同时把cnss2也编译进内核镜像，但cnss2又依赖其他很多模块，如此递归，结果就是，除非把所有内核模块都编译进内核镜像，不然没辙。但正如前面提到的，由于小米有很多没开源的内核模块，因此将所有内核模块都编译进内核镜像也不现实。

那么，编译出来qcacld-3.0内核模块，然后把位于vendor_dlkm分区的qcacld-3.0内核模块（`qca_cld3_qca6490.ko`）替换掉不也行吗？不行，MIUI14的vendor_dlkm分区是erofs，如何在安装过程中解包并重建erofs镜像文件呢？

因此只能退而求其次：做一个Magisk模块，开机过程中把已加载的qcacld-3.0内核模块先卸载掉，然后把我新编译的qcacld-3.0内核模块再加载上。

```shell
#!/system/bin/sh

MODDIR=${0%/*}

# If Android doesn't load the qca6490 driver, exit early
lsmod | grep -Eq '^qca6490' || exit

wifi_status=$(settings get global wifi_on)

# Turn off WiFi before unloading the module
[ "$wifi_status" -eq "1" ] && {
  cmd wifi set-wifi-enabled disabled
  sleep 1
}

# Load new WiFi driver
rmmod qca6490 && insmod ${MODDIR}/modules/paradox_qca6490.ko

# Turn on wifi again
[ "$wifi_status" -eq "1" ] && {
  sleep 1
  cmd wifi set-wifi-enabled enabled
}
```

顺便一提，在测试的过程中，一不留神禁用了太多qcacld-3.0的调试特性，结果把WiFi 6给搞炸了，由于当时我家里没有支持WiFi 6的路由器因此没法测试，之后在YuKongA大佬和skkk大佬的帮助下把WiFi 6修好了，再次感谢他们！相关的两个提交：[1](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/9e9d386a792b7bcae86c52fe0de0b8c87f917261) [2](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/c28df60a44194acc87f32d8cf67a96df923c8889)。

在浏览marble加载的所有内核模块时，我发现有一些内核模块是marble完全不需要的（比如：qca6750、其他的触屏驱动、Coresight那一坨、等等），如果能让内核不去加载这些内核模块，那么可以变相地精简内核，同时稍微提升一些设备启动速度。

按照[LibXZR大佬的提示](https://blog.xzr.moe/archives/236/#section-9)，可以在cmdline中配置`module_blacklist`参数来定义让内核强制不加载的内核模块，但由于我想要拒绝加载的内核模块太多了，放到`CONFIG_CMDLINE`让cmdline变得很长实在是不合适，因此只能魔改`kernel/module.c`，额外定义一个与`module_blacklist`不冲突的黑名单，相关提交：[3](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/7ee54d3260244a6dac8eb83ac06de91991c54ded)。

现在，黑名单里的内核模块确实是不加载了，但带来了另一个问题：TWRP进不去了。在秋秋大佬的指点下，让黑名单中的内核模块在尝试加载时强制报告为成功加载，问题得到解决，相关提交：[4](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/ed3e79cb12e21ec6e4e5f18dc1a58cd242a8d2d4)。

剩下的就是一些小修小补小优化了，比如：将`CONFIG_HZ`从默认的250提高到300以提高内核的响应速度（现在来看其实是负优化），通过Cpusets assist优化了cpuset参数、添加了NTFS的支持、顺便[修了一个5.10.173更新导致的唤醒延迟问题](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/7efd54d39b0fd44a549660f38571244bba485540)。

另外，从这个版本开始，我同时分发了支持KernelSU的内核（虽然我一直都是Magisk的忠实用户）。

## Melt Kernel v2.0（2023.07.27）

决定改名的一个契机，是因为我看到有用户把Paradox和Pandora搞混了。事实上Paradox是我沿用之前给phoenix维护的内核的名字，那时新内核名字还没起好，因此索性还叫Paradox得了。

为什么新的名字是Melt呢？有两个原因，一是marble在小米内部的代号为`m16t`，是不是和“melt”看起来很像？另一个原因是，Melt是我非常喜欢的一个专辑中一首曲目的名字，老葱粉肯定很快就能想到，没错就是Supercell。

新的名字自然得配新的Banner图，Banner图取自pixiv，作品id为`82352299`，这是一张我非常喜欢的miku同人图，大楼林立的城市背景，miku摘下耳机靠在电线杆旁，蓝天白云下飘逸的长发，令人无限遐想。为了让文字更加突出，我对这张图做了透明渐变处理，而文字的字体还是沿用之前的Segoe Print。另外我必须承认的是，我未经画师授权擅自使用了这张图，但我没有用于盈利目的，因此请原谅我。

扯远了，说回正题。

在v1.1版本，我把qcacld-3.0换成了自己编译的版本，但如果想换更多的内核模块，那果然最好还是把vendor_dlkm分区整个换了。嗯？你问我为啥不换vendor_boot分区？原因很简单：目前没必要。

既然要追求刺激，那就贯彻到底咯。我早就看cnss2和goodix_core这俩内核模块不爽了，一个连上WiFi之后隔几秒就打几行内核日志，另一个点一下屏幕就打几行内核日志，烦死了！

cnss2这个很好处理，问题是触屏驱动goodix_core，此时我才意识到MiCode在`marble-s-oss`分支开源代码里的触屏驱动没一个是marble能用的。

反编译dtbo，找到marble关于触屏部分的定义：

```
	fragment@38 {
		target = <0xffffffff>;

		__overlay__ {
			status = "ok";
			qcom,rt;
			pinctrl-0 = <0x2e 0x2f>;
			pinctrl-1 = <0x30 0x31>;

			m16t-touch@0 {
				status = "ok";
				compatible = "goodix,9916r-spi";
				reg = <0x00>;
				spi-max-frequency = <0xe4e1c0>;
				interrupt-parent = <0xffffffff>;
				interrupts = <0x15 0x2008>;
				pinctrl-names = "pmx_ts_active\0pmx_ts_suspend";
				pinctrl-0 = <0x32>;
				pinctrl-1 = <0x33 0x34>;
				iovdd-supply = <0xffffffff>;
				avdd-supply = <0xffffffff>;
				goodix,iovdd-name = "iovdd";
				goodix,avdd-name = "avdd";
				goodix,irq-gpio = <0xffffffff 0x15 0x2008>;
				goodix,irq-flags = <0x02>;
				goodix,reset-gpio = <0xffffffff 0x14 0x00>;
				goodix,panel-max-x = <0x438>;
				goodix,panel-max-y = <0x960>;
				goodix,panel-max-w = <0xff>;
				goodix,panel-max-p = <0x1000>;
				goodix,firmware-name = "goodix_firmware_TM.bin";
				goodix,config-name = "goodix_cfg_group_TM.bin";
				goodix,touch-expert-array = <0x02 0x03 0x02 0x02 0x04 0x03 0x03 0x02 0x03 0x03 0x04 0x02>;
			};
		};
	};
```

以`goodix,9916r-spi`为线索，在GitHub上搜索，很快就搜到了，原来MiCode在`ruby-s-oss`分支开源代码里有我想要的驱动源码。

但很遗憾就算找到了也不能直接拿来用，因为`ruby-s-oss`分支的内核源码是基于联发科的v4.19内核源码，想要移植到v5.10上用？当然得先修一修，相关提交：[1](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/b1bb60e069668c73bb30f833804c521dde23339c)。

然后，分析该触屏驱动的源码，我发现其中有[识别两种不同批次屏幕面板](https://github.com/Pzqqt/android_kernel_xiaomi_marble/blob/959c41f50b09536878f56078331e319d7e12186a/drivers/input/touchscreen/goodix_9916r/goodix_ts_core.c#L3568)的代码，通过读取两个GPIO的值来判断，根据不同批次的面板加载不同的firmware和cfg文件。

那么，marble是不是也有两种批次的屏幕面板呢？是的，从`/vendor/firmware`中可以找到两组与触屏有关的firmware和cfg文件，其中一组文件名以`_Second`结尾。

ruby通过读取68号和194号GPIO的值来识别不同批次的面板，那么marble是不是也是通过这俩GPIO识别的呢？不对，肯定是不一样的。想要知道答案，那就只能反编译小米预编译的goodix_core内核模块了。祭出神器：IDA！

之后便是枯燥无味且漫长的修复过程，把识别不同批次面板的代码改好之后，还得修panel notifier（不然熄屏手势寄掉），修完继续测试、完善、优化。我依稀记得那天我刚好出门在外参加考试，上午考试完，下午就在宾馆吹着20度的空调修goodix触屏驱动，等修完之后两眼发黑，看下时间，原来已经快晚上9点了。

{% include pure-img-responsive.html url="/images/e48/p1.png" a_class="pure-u-md-2-3" %}

总之，把goodix 9916r驱动内核模块替换为从源码编译的，这件事让我成就感爆棚！

除此之外，就是非常常规的更新了，更新了WiFi驱动，更新了aw882xx驱动、默认禁用avc日志，由于pstore仍然是炸的，因此我在试着修pstore的同时，从LibXZR那pick来了内核panic后自动dump日志的功能。

## Melt Kernel v2.1（2023.08.11）

事实证明，v2.0版本中直接刷写vendor_dlkm分区不是个好主意，很多用户刷了之后都遇到了无法开机的问题。因此，思考再三之后，我认为还是修改用户的vendor_dlkm分区更为合适。

v2.0移除了上个版本中添加的内核panic后自动dump日志的功能，因为实际测试下来发现这玩意绝大多数时候都不奏效。

在这期间，为了研究VAB设备的“工作原理”，我阅读了LibXZR的这篇博客文章：[对Virtual A/B 分区工作方式的进一步探索](https://blog.xzr.moe/archives/30/)。从中我意识到，在VAB设备上，要想安全地修改逻辑分区，最好是确保快照（Snapshots）已合并完毕。

因此，从这个版本开始，Melt Kernel会通过AnyKernel3内置的`snapshotupdater_static`识别设备当前的快照合并状态，在快照合并完毕之前不能安装Melt Kernel。

在安装过程中修改erofs的vendor_dlkm分区也不再是问题，skkk大佬的[erofs-utils](https://github.com/sekaiacg/erofs-utils)有提供Android arm64设备能用的版本。剩下我需要做的只有再写一点点代码、再做一点点测试；至于ext4的vendor_dlkm分区，那就更简单了，挂载读写直接改就行，分区剩余空间不够的话就用`resize2fs`搭配`e2fsck`对vendor_dlkm分区镜像进行扩容。

考虑到当时所有的rom（包括AOSP rom）都在使用小米预编译的内核模块，因此似乎没必要把vendor_dlkm分区的内核模块全部换一遍，只换我想换的几个就行了。对于不需要加载的内核模块，修改`/vendor_dlkm/lib/modules/modules.load`，将其从中移除就行了。

然后，为了避免重复刷入Melt Kernel造成不必要的重复修改vendor_dlkm分区，Melt Kernel会在修改vendor_dlkm分区的同时在`/vendor_dlkm/lib/modules`添加一个`vertmp`文件，该文件内容为Melt Kernel内核镜像文件的版本字符串，再次安装Melt Kernel时，除非没有`/vendor_dlkm/lib/modules/vertmp`文件，或者该文件内容和新版本Melt Kernel的内核版本字符串对不上，否则就不再修改vendor_dlkm分区。

再然后，为了方便用户救砖或反悔，Melt Kernel在检测到`/vendor_dlkm/lib/modules/vertmp`文件不存在时，会在`/sdcard`生成一个包含未经修改的内核镜像和vendor_dlkm分区镜像的还原包，用户想要还原原始内核的话直接在TWRP刷入该还原包即可。

最后，为了避免过不了AVB校验开不了机，还得patch vbmeta分区以绕过校验，用LibXZR大佬的[vbmeta-disable-verification](https://github.com/libxzr/vbmeta-disable-verification)工具解决问题。

可以看出，v2.1版本的工作量很大，经过Discussion group中数十名测试者的测试后才得以发布，在此感谢他们！

## Melt Kernel v2.2（2023.08.29）

相比于v2.1，v2.2就只是个常规更新了，按照惯例从Linux上游更新、从clo更新、更新WiFi驱动、更新KernelSU、根据某位用户的建议添加了TTL/HMARK target支持、等等。

提到KernelSU，我觉得每次更新发两个包（一个带KernelSU的，一个不带KernelSU的）实在是太麻烦了，所以干脆放到同一个包里，让用户在安装过程中通过音量键选择安装（好怀念Aroma Installer的时光啊）。

对于两个内核镜像文件，为了进一步减小安装包的大小，我用`bsdiff4`工具生成常规内核镜像文件和带KernelSU的内核镜像文件之间的差分补丁，在安装过程中再根据需要用`bspatch`打补丁，同时为确保安全，在打补丁前后对内核镜像文件进行哈希校验。生成的差分补丁只有1~2MB左右，直接让安装包减小了将近一个内核镜像的大小。

期间还发生了一个比较有意思的事，因为我不太喜欢音量键选择安装的方式，因此我设计了让用户通过修改安装包文件名来选择安装KernelSU的形式，简单来说，文件名中如果包含有连续且不区分大小写的`ksu`字符串，就安装带有KernelSU的内核镜像，为此我举了几个例子：

- `Melt-Kernel-marble-va.b.c-multi-ksu.zip`
- `Melt-Kernel-marble-vx.y.z-ksu-multi.zip`
- `Ksu-Melt.zip`
- `kSU.zip`
- `fuckSU.zip`

结果用户纷纷表示喜欢最后一个文件名🤣。当然，这个方案最后没有沿用下去，因为大家还是更喜欢通过音量键选择安装。

与此同时，为了方便（我自己）调试，如果安装包的文件名以`-force`结尾，则总是更新vendor_dlkm分区。

## Melt Kernel v2.3（2023.10.27）

终于，我还是要对vendor_boot分区下手了，因为我想更新几个跟网络有关的内核模块（cfg80211和mac80211），顺便更新一下其他的。

与此同时，越来越多的用户给我反馈说安装Melt Kernel失败。根据用户提供的截图和recovery log，原因无一例外都是AnyKernel3报告`Resizing vendor_dlkm_a failed. Aborting...`错误，再深入研究，得知AnyKernel3中用于调整逻辑分区的工具`lptools_static`读取到了错误的super分区大小，理论上应该读取到`9663676416`（即9.0GB），但不知为何`lptools_static`读取到的是`9126805504`（即8.5GB）。

这个问题怎么修暂且不说，另一个问题是，Melt Kernel需要依次修改boot、vendor_dlkm、vendor_boot这几个分区，现在vendor_dlkm刷写失败了，但boot分区刷写成功了，然后用户开机，内核版本号变了，然后用户开开心心地说“虽然提示安装失败了，但还是安装成功了”，只有我自己知道这样安装是不完整的。

说回这个super分区大小读取错误的问题，怎么修？我实在不知道，通常遇到这种情况我会让用户再刷一遍rom试试，有时管用有时不管用，但目前的话我们还是有办法规避它。一个简单的方法是提前检查super分区的大小，如果和`9663676416`对不上，那就提前终止。

在此期间，YuKongA大佬在维护devicetree并编译非官方LineageOS时发现系统设置中的电量使用情况数据显示异常，因此我给他提供了一个修复该问题之后的`qti_battery_charger.ko`内核模块文件，Melt Kernel在安装过程中会检查这个内核模块文件的哈希，如果对上了就不要替换它，相关提交：[1](https://github.com/Pzqqt/AnyKernel3/commit/392684103d25071ae99940dc1fee7965871a481b)。

另外，我还从Sultan大佬那里pick了SBalance IRQ balancer，可以动态地将irq平衡到各个CPU核心上以减轻压力，但是会和高通的`msm_irqbalance`打架，这个好解决，`msm_irqbalance`是在用户空间平衡irq的，那咱在内核层直接把用户空间的接口ban掉就行了。

然后，Melt Kernel做了一个“违背祖宗的决定”，在v2.3引入了一个会破坏KMI的补丁集：[per memcg lru lock](https://lore.kernel.org/all/1604566549-62481-1-git-send-email-alex.shi@linux.alibaba.com/)，然后用`GENKSYMS`糊弄过去确保被修改的struct的CRC保持不变（不然很多内核模块都会加载失败，导致无法开机）。

当时只是觉得问题不大：只不过是修改了一两个struct而已嘛，况且糊弄这种事Google自己也干过，就比如[5.10.162上游更新io_uring那次](https://github.com/aosp-mirror/kernel_common/commit/1cd4863ea87442b14a9f7c93cef61a419f9079f3)。

事实上确实问题不大，即便是破坏了KMI，经过了数十个版本之后Melt Kernel也一直很稳定。再说了，其他的5.10自定义GKI都很喜欢引入mglru、bbr2等等这些特性，那动的可不只是一两个struct了，KMI破坏得自然是更加严重，但它们也一直很稳定。

也是在v2.3这个版本我终于意识到了：pstore是修不好的，但我们还有minidump可以用啊，没有pstore的话minidump是唯一的能在设备异常重启时dump内核日志的玩意了，而且minidump有一个好，pstore只能保存上一次内核崩溃时的日志，而minidump能保存好几个。但比较恶搞的是，之前修pstore的方法不但没把pstore修好，还把minidump搞崩了😂。

AnyKernel3方面，因为KernelSU v0.6.9与Magisk不兼容（KernelSU在后续版本修好了），并且我实在想不到同时使用Magisk和KernelSU的理由，因此如果检测到Magisk则拒绝安装带有KernelSU支持的内核镜像。另外一处改动是，首次安装Melt Kernel时允许用户选择是否生成还原包（之前是不询问直接生成）。

剩下的依旧是常规更新，都是一些小修小补小优化。

什么？你问我为什么隔了两个月才更新？那还是得怪Google，我等他合并`5.10.197`到`android12-5.10-lts`等了足足一个月！

## Melt Kernel v2.4（2023.12.09）

到了v2.4，我才意识到之前简简单单替换vendor_boot和vendor_boot的内核模块的做法还是太危险了，因为你猜不到用户现有的内核模块都是啥。因此，最好是跟v2.0版本一样：全换了。但这次我不打算直接刷分区了，而是跟前几个版本一样在现有的基础上改。

然后，v2.3版本不是引入了一个提前检测super分区大小的方法嘛，实际上没卵用，`blockdev --getsize64 /dev/block/by-name/super`返回的的永远都是正确的`9663676416`，但我又发现，`lptools_static`在读取到了错误的super分区大小的同时，`lpdump`也会读取错，因此，“提前检查super分区大小是否正常”的任务就交给`lpdump`了，相关提交：[1](https://github.com/Pzqqt/AnyKernel3/commit/1f2074c3223c9dd2c98ea63d4defbad59d8ea6a6)。

再仔细研究一下，`lptools_static`在什么情况下会被用到？是在逻辑分区的大小需要调整时才会用到，不管要刷入的镜像文件和分区哪个更大，只要对不上就得调。

对于erofs的vendor_dlkm分区，在安装不同版本的Melt Kernel时，生成的新的vendor_dlkm分区镜像大小总是不一样，因此每次都得调。那么，可不可以不调？当然可以！如果新生成的vendor_dlkm分区镜像比现在的vendor_dlkm分区大小要小，那就在vendor_dlkm分区镜像的末尾填充`\x00`，填充到和vendor_dlkm分区大小一样不就行了？对于ext4的vendor_dlkm分区镜像，除非必须得扩容，不然vendor_dlkm分区镜像大小会和之前保持一致，此时也没必要检查super分区大小是否正常了。

试了一下，该方案确实可行，Melt Kernel的安装成功率大大提高了（笑）。

在此期间，我发现有些官改rom开始通过往vendor_boot分区里添加`perfmgr.ko`以给rom添加FEAS支持，但因为Melt Kernel会把用户vendor_boot分区的所有内核模块都换掉，`perfmgr.ko`也会被搞没的，因此我不得不对其特殊照顾了一下。

顺便一提，在v2.3发布后不久，我收到了一些用户的反馈，称自己没有安装过Magisk但在安装Melt Kernel的过程中还是错误地识别到安装了Magisk，搞得他们没法选择安装KernelSU了。询问之后发现，这些用户为了避免data分区被强制加密而安装了[DFE](https://xdaforums.com/t/a-b-a-only-script-read-only-erofs-android-10-universal-disable-force-encryption-for-ro-and-rw-neo-stable.4454017/)，DFE为了使用Magisk的[overlay.d](https://topjohnwu.github.io/Magisk/guides.html#root-directory-overlay-system)特性而修改了ramdisk。或许刷了DFE的用户自己也不喜欢Magisk，但他们没得选，因此从这个版本开始，即使安装程序检测到用户已经安装了Magisk仍然会询问用户是否要安装KernelSU。

另外一件事也是发生在v2.3发布后不久，小米在MiCode开源了Redmi Note 13 Pro（garnet）的内核源码，这次十分难得地把display和camera这俩非常关键的组件也开源了。garnet的Soc为骁龙7s Gen2，内核一样基于msm-5.10，因此咱们marble（包括其他采用8 Gen1、8+ Gen1的小米设备）也能从中获益。编译出来的display驱动（`msm_drm.ko`）在marble的MIUI14上基本正常工作，这下终于可以从根源上把display的logspam禁用掉了；至于camera，很遗憾编译出来的内核模块在marble上不好使，不过无所谓，根据我以前维护sdm636内核和sm7150内核的经验，camera源码这东西有时候稍微动一下相机就寄了，既然如此那就别碰它，老老实实用小米预编译的内核模块吧。

另外，从这个版本开始，Melt Kernel的内核镜像开始使用更加先进的编译器编译了，之前也是试过，但总是开不了机，后来在另一位开发者大佬（marble的AOSPA rom的维护者）的指导下修好了，相关提交：[2](https://github.com/adithya2306/android_kernel_common/commit/4e3bd444737a964793dbf72af4dc7222a71f1fce)，但带来的另一个问题就是：用户在系统设置中打开USB网络共享之后会内核panic，这个问题在等待了几个月之后被arter97大佬修好了，相关提交：[3](https://github.com/arter97/android_kernel_asus_zenfone9/commit/f271435990abafe2134fc6da84a8d18eed03d0ae)，那么，现在使用版本更新的clang编译内核镜像就不再有任何阻碍了。当然，为了确保新编译的内核模块能够和小米预编译的内核模块兼容，内核模块还是得用Google钦定的Google clang 12.0.5编译，不过问题不大。

剩下的依旧是常规更新：从AmazonLinux更新了DAMON库，学习arter从Linux v6.x向后移植了zsmalloc和zram，绑定几个比较关键的irq到大核上，等等。

## Melt Kernel v2.5（2024.01.10）

v2.5发布前不久，发生了几件非常重要的事：marble的官方版HyperOS发布、LSPosed停更，但最重要的事情是：经历了两年多的漂泊之后，我终于找到了一份长期稳定的工作，可喜可贺！

在这个版本中，我移除了之前添加的SBalance，因为很多用户包括我自己都发现这玩意会导致触屏粘滞，简单来说，有时候手指都离开屏幕了但还是按下的状态，只有再次触摸屏幕才能恢复，在用屏幕键盘打字时很容易发生也很容易察觉。我承认SBalance是个好东西，但带来的问题比带来的好处更多的时候，那最好还是别要了，况且高通的`msm_irqbalance`又不是不能用（笑）。

另外，这个版本也不再将关键的irq绑定到大核上了，因为有两个问题，一是感知不强不说还费电，二是MIUI会在低电量时（大概5%）禁用掉几个大核，大核离线了irq绑不上去，然后就kernel panic了。顺便给大家一个小建议，不要让锂电池电量长期保持在很低的状态，这对锂电池的使用寿命有很大的影响。

官方版HyperOS发布之后，很多用户都试着把Melt Kernel安装到HyperOS上，由于之前的版本我没有在这方面做限制，因此安装上是没有问题的，开机也是能开的，但有个比较严重的bug：输入法弹出后会kernel panic。在marble的官方版HyperOS发布之前，其他在给marble移植HyperOS的romer也发现了这个问题，最后通过反编译系统核心组件变相解决了；官方版HyperOS发布之后，把所有内核模块替换成HyperOS的同样也能解决问题。简单分析之后发现是goodix 9916r触屏驱动的问题，反编译marble官方版HyperOS的`goodix_core.ko`，对照着修改源码，问题解决，相关提交：[1](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/1316f24c3c34e42c3ea4b38ec2d55bc653f79b9f)。

v2.5发布的时候，由于天朝版HyperOS难产了，`HyperOS.eu`也迟迟未能发布，因此我只能继续使用`MIUI.eu`。那时我尝试着把欧盟版、国际版的firmware刷到设备上，搞一个MIUI14 rom + HyperOS firmware的混搭，结果发现设备启动后50秒左右就kernel panic了，稳定触发，不论是启动到系统还是启动到TWRP都一样，此时我意识到原因是内核模块与firmware不匹配。

因此，为了同时支持MIUI14 firmware和HyperOS firmware，Melt Kernel内置了两套内核模块，适用于MIUI14 firmware的那套内核模块基于`V14.0.27.0.TMRCNXM`进行定制，适用于HyperOS firmware的那套内核模块基于`OS1.0.2.0.UMRMIXM`进行定制。安装过程中，安装程序会识别设备当前slot的firmware特征来区分是哪个版本的firmware，然后安装对应版本的内核模块。

两套内核模块意味着更大的安装包体积，因此我不得不对内核模块使用压缩率更高的LZMA2算法进行压缩，最后勉强把安装包大小压缩到60MB左右。

在v2.5中我还添加了一个新的I/O scheduler：cpq，作为一个内核模块，提取自Redmi K50 至尊版（diting）的官方版HyperOS rom，看起来是小米自己设计的I/O scheduler，效果如何不做评价，反编译之后分析了一下，似乎是魔改自deadline。

## Melt Kernel v2.6（2024.03.15）

在v2.6版本，我认为是时候让Melt Kernel变得更独特一点了。

AnyKernel3方面，我添加了三个新的安装时选项：

1. 让用户选择是否总是启用360HZ触控采样率。很早以前就有人发现，写入除“0”以外的其他任意字符串到`goodix_ts_report_rate`节点即可将触控采样率从默认的240HZ提高到最高360HZ，但是熄屏重新亮屏后失效，而且并不是所有用户都会用shell命令，因此我猜肯定会有人喜欢这个功能。相关提交：[1](https://github.com/Pzqqt/AnyKernel3/commit/a5988575fdf9cfe1501c6cabd0079b65a66c3836)。
2. 让用户选择是否修复在AOSP rom上电池使用情况数据异常的问题。相关提交：[2](https://github.com/Pzqqt/AnyKernel3/commit/d0d15e46c6fcea3ebcf0ba12f864ca66f8052ffd)。
3. 让用户选择是否显示更加真实的电量百分比，来自秋秋大佬的idea。相关提交：和2相同。

内核方面，我对触屏驱动进行了再次优化：

1. 在MIUI14/HyperOS的“游戏加速”app中，若将“触控滑动跟手性”设置为3档或3档以上（默认为2档），则在对应app中自动应用高触控采样率（360HZ）。相关提交：[3](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/9dfeac0a078c1968f29ac0671881cd6065398ffb)。
2. 在启用高触控采样率（360HZ）的情况下，重新点亮屏幕后会自动重新应用高触控采样率。相关提交：[4](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/91422f0182f7e223db9d5c0adb2be97f8e650696)。

{% include pure-img-responsive.html url="/images/e48/p2.png" a_class="pure-u-md-2-3" %}

考虑到有很多用户让我添加mglru和bbr2支持，但正如之前提到的，引入mglru或bbr2都会严重破坏KMI，影响内核的稳定性。因此从v2.6版本开始，每次发布正式版时我都会另外发布一个带有mglru和bbr2支持的不稳定（unstable）版安装包，供用户选择。

并且，从这个版本开始，我不再等Google更新`android12-5.10-lts`了，Google没时间修KMI？那我自己修😒。

剩下的依旧是常规更新以及各种杂七杂八的优化和修复，没什么好讲的不再细说了，感兴趣的话就去看Changelog吧。

## Melt Kernel v2.7（2024.05.03）

v2.7发布时，KernelSU更新带来了一种全新的安装方式：LKM（Loadable Kernel Module）。关于LKM，我在Telegram频道已经简单地分析过了，坦白讲，我不喜欢这种安装方式，但它又的的确确解决了很多长久以来难以安装KernelSU的问题。对此，Melt Kernel的处理方式为：如果检测到用户已通过LKM安装了KernelSU，就不能安装带KernelSU支持的Melt Kernel内核镜像（因为重复了嘛）。

另外，diting的`perfmgr.ko`（和FEAS有关的内核模块）在HyperOS中也得到了更新，为了让Melt Kernel也能加载它，我将`sched-walt.ko`也更新为从diting的HyperOS中提取的版本。与此同时，为了便于维护以及更好的兼容性，现在Melt Kernel不再检测并保留vendor_boot分区的`perfmgr.ko`。

也是在这个时候，有很多用户开始反馈Melt Kernel在EvolutionX rom上难以启动，好不容易让用户抓到了log，结果log全都是millet产生的垃圾日志，实在是令人不爽。millet是小米自己魔改的“墓碑”模块（说实话我不喜欢这个称呼），在AOSP rom上若没有配置好确实会产生大量的垃圾日志，既然如此，那干脆就不要在AOSP rom上加载millet相关的内核模块了，相关提交：[1](https://github.com/Pzqqt/AnyKernel3/commit/b88a104436281520915ff8207b7469dea1b292e1)。

并且，从这个版本开始，Melt Kernel正式可以和其他GKI搞混搭了：安装Melt Kernel之后，保留Melt Kernel的内核模块，并安装使用另一个内核。理想情况下，之前版本的Melt Kernel应该也可以搞混搭才对，但并不行，因为我在编译Melt Kernel时忽略了一点：按照Google的要求，供应商内核模块只能使用被KMI保护的符号，因此在标准的GKI 2.0编译流程中，不被KMI保护的符号应该被修剪掉。之前我给Melt Kernel pick了一个看似人畜无害的提交：[arm64: Kconfig: Enable GENERIC_FIND_FIRST_BIT](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/7674e68d2f3c09f8e4561c836ff02ae4b55cff26)，这个提交使得内核镜像额外导出了一个函数符号`find_first_bit`，而这个函数符号又恰恰被`mac80211.ko`所使用，结果就是：用户刷了其他GKI，但其他的GKI或许没有导出`find_first_bit`这个符号，那么`mac80211.ko`加载就会失败，且由于`mac80211.ko`是在第一启动阶段加载的，因此加载失败的后果就是init死掉，kernel panic。当我发现并解决了这个问题之后，后续版本的Melt Kernel我都已经按照Google的规定修剪掉了非KMI符号。

## Melt Kernel v2.8（2024.06.16）

v2.7发布后不久，Melt Kernel的讨论群组发生了一些令我不快的事，情急之下我当机立断直接删除了群组，并报复式地归档了Melt Kernel的GitHub仓库。

说实话，我没想着停更，用户不用我自己还得用呢😅。虽然恶人最终仍然没有得到惩戒，但至少“报复”完之后我心里是爽了。

归档的这段时间，我把Melt Kernel的所有提交全部梳理了一遍，排除了一堆没卵用的提交，然后rebase。并且，为了避免以后再发生类似的事，我决定不再给Melt Kernel创建讨论群组。

v2.8是个没什么值得特别说的常规更新，硬要说的话就是添加了一个有关有线耳机音量加减键的选项，这个选项借鉴自以前我给Redmi Note 5（whyred）维护的Panda Kernel，不过，都已经4202年了，有线耳机都越来越少见了，又有多少人会纠结有线耳机的音量加减键是否好使呢？

## Melt Kernel v2.9（2024.07.20）

依旧是个没什么值得特别说的常规更新。由于缺乏与用户的互动，我似乎已经开始变得不思进取了。

## Melt Kernel v3.0（2024.08.19）

总是有用户跟我说Melt Kernel太费电，因此在这个版本我抛弃掉了一些“优化”，同时将`CONFIG_HZ`从300恢复到默认的250（内核镜像和新编译的内核模块确实是按300HZ来了，但小米预编译的内核模块还是250HZ，因此最好还是保持一致），并且允许用户在安装过程中选择禁用DAMON Reclaim（之前是默认启用）。

## Melt Kernel v3.1（2024.09.12）

越来越多的用户开始跟我反映Melt Kernel在基于OSS kernel的rom上发生的各种问题，因此我不得不创建了一个“临时”群组进行内测。

LineageOS团队改用了全新的goodix触屏驱动，结果自然是触屏寄了。我也懒得搞兼容，干脆把他们改了之后的goodix触屏驱动搬过来，在Melt Kernel里内置两个不同的goodix触屏驱动，根据device-tree来判断应该加载哪个。

不仅仅是goodix触屏驱动，连红外遥控（IR）也寄了。解决方法自然是和触屏驱动一样。

然后，又有用户反馈称`sensor-notifier`进程的CPU使用率太高。分析了用户提供的logcat之后，再结合LineageOS团队的devicetree，认为应该改用开源的display驱动。因此在该版本中，如果安装程序检测到存在`/vendor/bin/sensor-notifier`文件，就强制使用开源的display驱动，而对于HyperOS用户，则允许在官方预编译的闭源display驱动和开源display驱动之间做选择。

顺带一提，开源display驱动在HyperOS上的AOD bug我也在不久前修好了（修的过程稍微有一点点复杂，不是很难，之前不想修单纯是因为觉得没必要，官方预编译的display驱动又不是不能用），相关提交：[1](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/fe2453f3c2bda6ca6a2d03fa166b6f24c056f121)。

至于DAMON Reclaim，我终于发现了这个曾经让我如痴如醉的功能除了费电之外没任何卵用（说得有点过分了，准确点说，它或许不适合Android系统），因此从这个版本开始默认禁用。

另外，这个版本还添加了一个很有意思的小功能：允许设备在熄屏时禁用指纹几秒钟，避免设备在塞进裤兜里时被意外指纹解锁并误触。

AnyKernel3方面也有很多改进，首先，magiskboot终于支持从[Header V4的vendor_boot分区](https://source.android.com/docs/core/architecture/partitions/vendor-boot-partitions#vendor-boot-header-v4)中正常提取所有的vendor_ramdisk了，因此果断跟进。对于vendor_boot分区存在多个vendor_ramdisk的情况，我认为最简单的处理方法是：将多个vendor_ramdisk合并到一个，但vendor_ramdisk_table仍然保留有多个vendor_ramdisk的记录，因此我决定将被合并的vendor_ramdisk用一个空的cpio替代（当然最好的办法是编辑vendor_ramdisk_table将多余的vendor_ramdisk entry移除，但magiskboot不支持，虽然有一个[非官方版本](https://github.com/nilz3000/Magisk/releases/tag/v27.0-vb2)的magiskboot支持编辑vendor_ramdisk_table，但目前来说我实在不想把问题搞得这么复杂），相关提交：[2](https://github.com/Pzqqt/AnyKernel3/commit/013922923218c8a1260f3153c894ca2c5b3bfd94)。

跟进的结果是什么呢？用户从旧版本升级Melt Kernel之后又遇到问题了，要么安装失败提示`Splitting image failed. Aborting...`，要么安装程序直接卡死。原因自然是旧版本的magiskboot不正确地处理vendor_boot分区把它搞坏了，但到底是哪里坏了应该怎么修，现在还不清楚。

另一个结果是，一些用户安装了Melt Kernel之后系统无法启动了，TWRP也无法解密data了，dirty flash rom、或是还原以前备份的内核、或是格式化data分区之后问题解决，我测试了很多次都无法复现，从用户提供的recovery log中也只是发现解密服务没有跑起来，其他便没有更多的信息了。由于掌握的信息太少，因此该问题目前仍然无解。

问题多到令我头疼，没办法，以后慢慢研究慢慢修咯。

## Melt Kernel v3.2（2024.10.18）

终于，我决定开摆了，v3.2版本不再兼容基于OSS kernel的rom，安装过程中一旦检测到OSS kernel的特征，直接终止安装。

我就直说了，我不喜欢LineageOS团队搞的这套东西，好好的预编译内核模块不用非得全部自己编译，好好的GKI 2.0规范就是不遵守，搞得人不人鬼不鬼的，Melt Kernel为了兼容它不知道烧了多少脑细胞，心累！

不得不说，放下包袱，一身轻松！

另外，v3.1版本中设备无法启动TWRP无法解密的问题在Telegram用户@xStormx01的辛勤测试下终于修好了，非常感谢他！原因也很让人抓狂，我一直以为是把vendor_boot分区搞坏了导致的，结果坏掉的不是vendor_boot，而是boot！新版本的magiskboot采用的libc有问题，在打包boot镜像时把异常的`OS_PATCH_LEVEL`日期信息写到boot镜像里了，bootloader识别到boot分区的`OS_PATCH_LEVEL`不正常，于是解密服务就跟着寄了。在Magisk仓库提交issue之后，目前先临时规避这个问题：打包boot镜像时不要碰`OS_PATCH_LEVEL`信息，相关提交：[1](https://github.com/Pzqqt/AnyKernel3/commit/6235fa1a9b53da7a297a2b973240d204d2fd613f)。

而且，在这个版本中我实现了回滚机制。目前Melt Kernel会依次更新并刷写boot、vendor_dlkm、vendor_boot这三个分区，其中任意一步失败并中止，安装都是不完整的。因此，现在安装程序在安装过程中会保留安装之前未经修改的各个分区镜像，如果安装中止，就将未经修改的分区镜像刷回去，避免让用户产生“我安装成功了”的错觉，相关提交：[2](https://github.com/Pzqqt/AnyKernel3/commit/9318fc0f89ef878245d435ece9c622002e117a3e)。

v3.1版本中遇到的另一个问题（即：要么安装失败要么安装程序卡死）还是没得到解决，安装失败了还好说，安装程序卡死实在是令人恼火。因此，我给magiskboot解包镜像的命令加了一个20秒的超时，这样就能暂时避免卡死问题了，相关提交：[3](https://github.com/Pzqqt/AnyKernel3/commit/0a064e5837c0e7677fd3c6cfdf1b523968dade5e)。

在准备v3.2的期间，我还整了一个花活：CPU超频，通过魔改`qcom-cpufreq-hw.ko`，将额外的几个频率写入到CPU频率表，让7+ Gen2摇身一变变成8+ Gen1，相关提交：[4](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/f100b54f2750)。但结果就很扯淡了，受系统的各种乱七八糟调度策略的影响，大核和超大核很难跑到超频后的最高频率，小核倒是不受影响，benchmark的结果也表明，“超频”并没有带来任何的性能提升，因此权当是我开了个玩笑🤡。

## Melt Kernel v3.3（2024.11.09）

目前marble几乎所有的AOSP rom都是基于OSS kernel，如果Melt Kernel一直放弃支持它们，那就相当于失去了一大半的用户。因此我只能厚着脸皮继续支持基于OSS kernel的rom了。

现在我意识到：为什么以前Melt Kernel支持基于OSS kernel的rom支持得这么困难？还不是因为OSS kernel的dtb、dtbo跟小米预编译的模块对不上嘛，解决方法也很简单：我把dtb、dtbo也换成小米预编译的不就行了？

经过了用户测试之后，效果还不错，功能都基本正常，这样直接让我省了不少心，至少我不用再内置两套触屏驱动和红外驱动了。

考虑到很多用户都喜欢用[KonaBess](https://github.com/libxzr/KonaBess)给GPU超频/降压，直接替换dtb的结果就是用户的GPU超频/降压配置会丢失，因此，为方便起见，Melt Kernel会在替换dtb之前，拷贝用户现有的GPU超频/降压配置到新的dtb，相关提交：[1](https://github.com/Pzqqt/AnyKernel3/commit/c5522a3277856e9dad299e530a945747450a2f9d)。

如此一来，我可以非常自豪地说：对于本不支持GKI的rom（特指基于OSS kernel的rom），在安装Melt Kernel之后即可完全兼容GKI！

另外，在这个版本中，我将一些原本位于vendor_boot分区的内核模块迁移到了vendor_dlkm，这样带来的一个好处是能[稍许加快启动速度](https://source.android.com/docs/core/architecture/kernel/boot-time-opt#move-modules)。

但这样一改之后，很久都没有人再反馈的`Resizing vendor_dlkm_a failed. Aborting...`问题又开始有人反馈了，我的头又开始疼了。这次我打算把问题彻底搞明白。

我找到了发生此问题的rom，发现是一个官改版的HyperOS，内置了Melt Kernel v3.2，rom包里包含了一个压缩后的完整super分区镜像，我用WinHex打开了这个镜像，翻了几下之后果然发现了不正常的地方：

{% include pure-img-responsive.html url="/images/e48/p3.png" a_class="pure-u-md-2-3" %}

原来`lptools_static`是从super分区的元数据中读取到了错误的分区大小，至于为什么super分区的元数据中的分区大小信息错了，你猜？

实锤了，这个锅Melt Kernel不背。

至于为什么问题集中在这个版本爆发呢？原因也很简单，之前我不是提到我将一些原本位于vendor_boot分区的内核模块迁移到了vendor_dlkm了嘛，结果就是新生成的erofs的vendor_dlkm分区镜像应该会比上个版本（v3.2）更大一些，而这个rom又刚好内置了上个版本的Melt Kernel，又刚好vendor_dlkm分区用的是erofs，结果就是从v3.2更新到v3.3就必须得调整现有的vendor_dlkm分区大小，然后问题就发生了。

总之，这个令我疑惑了一年多的问题现在终于是解决了。

另外，在深入研读了Google有关Header V4的文档之后，我也终于琢磨透了该如何解决v3.1版本中另一个等待解决的问题了（即：要么安装失败要么安装程序卡死）。

先看看[Header V4 vendor_boot分区的格式定义](https://source.android.com/docs/core/architecture/partitions/vendor-boot-partitions#vendor-boot-header-v4)：

```c
struct vendor_boot_img_hdr_v4
{
#define VENDOR_BOOT_MAGIC_SIZE 8
    uint8_t magic[VENDOR_BOOT_MAGIC_SIZE];
    uint32_t header_version;
    uint32_t page_size;           /* flash page size we assume */

    uint32_t kernel_addr;         /* physical load addr */
    uint32_t ramdisk_addr;        /* physical load addr */

    uint32_t vendor_ramdisk_size; /* size in bytes */

#define VENDOR_BOOT_ARGS_SIZE 2048
    uint8_t cmdline[VENDOR_BOOT_ARGS_SIZE];

    uint32_t tags_addr;           /* physical addr for kernel tags */

#define VENDOR_BOOT_NAME_SIZE 16
    uint8_t name[VENDOR_BOOT_NAME_SIZE]; /* asciiz product name */
    uint32_t header_size;         /* size of vendor boot image header in
                                   * bytes */
    uint32_t dtb_size;            /* size of dtb image */
    uint64_t dtb_addr;            /* physical load address */

    uint32_t vendor_ramdisk_table_size; /* size in bytes for the vendor ramdisk table */
    uint32_t vendor_ramdisk_table_entry_num; /* number of entries in the vendor ramdisk table */
    uint32_t vendor_ramdisk_table_entry_size; /* size in bytes for a vendor ramdisk table entry */
    uint32_t bootconfig_size; /* size in bytes for the bootconfig section */
};

#define VENDOR_RAMDISK_TYPE_NONE 0
#define VENDOR_RAMDISK_TYPE_PLATFORM 1
#define VENDOR_RAMDISK_TYPE_RECOVERY 2
#define VENDOR_RAMDISK_TYPE_DLKM 3

struct vendor_ramdisk_table_entry_v4
{
    uint32_t ramdisk_size; /* size in bytes for the ramdisk image */
    uint32_t ramdisk_offset; /* offset to the ramdisk image in vendor ramdisk section */
    uint32_t ramdisk_type; /* type of the ramdisk */
#define VENDOR_RAMDISK_NAME_SIZE 32
    uint8_t ramdisk_name[VENDOR_RAMDISK_NAME_SIZE]; /* asciiz ramdisk name */

#define VENDOR_RAMDISK_TABLE_ENTRY_BOARD_ID_SIZE 16
    // Hardware identifiers describing the board, soc or platform which this
    // ramdisk is intended to be loaded on.
    uint32_t board_id[VENDOR_RAMDISK_TABLE_ENTRY_BOARD_ID_SIZE];
};
```

简单来说，Header V4格式的vendor_boot分区可以拥有多个vendor_ramdisk，文件头部的`vendor_ramdisk_size`为所有vendor_ramdisk的大小之和，而在`vendor_ramdisk_table_entry_v4`部分又保存了各个vendor_ramdisk的大小等信息。

新版本的magiskboot能够正确处理Header V4格式的vendor_boot分区，在重新打包时，magiskboot会读取解包后的各个vendor_ramdisk的大小，然后正确写入到`vendor_ramdisk_table_entry_v4`和`vendor_ramdisk_size`。

但是旧版本的magiskboot无法正确处理它。现在我们先不考虑有多个vendor_ramdisk的情况，假设vendor_boot分区只有一个vendor_ramdisk，那么此时`vendor_ramdisk_size`和仅有的一条`vendor_ramdisk_table_entry_v4->ramdisk_size`应该是完全相等的，这很好理解。但是旧版本的magiskboot在处理vendor_boot分区时，不会处理`vendor_ramdisk_table_entry_v4`，它只会处理位于分区头部的`vendor_ramdisk_size`，也就是说，在重新打包时，如果vendor_ramdisk的大小发生了变化，那么只有`vendor_ramdisk_size`得到了更新，`vendor_ramdisk_table_entry_v4->ramdisk_size`不会被更新。

如果一直沿用旧版本的magiskboot，倒也没什么问题，但是，新版本的magiskboot是依据`vendor_ramdisk_table_entry_v4`的信息来提取vendor_ramdisk的，如果`vendor_ramdisk_size`和仅有的一条`vendor_ramdisk_table_entry_v4->ramdisk_size`对不上，那么提取出来的vendor_ramdisk就是损坏的。

如果`vendor_ramdisk_size > vendor_ramdisk_table_entry_v4->ramdisk_size`，那么提取出来的vendor_ramdisk不完整，结果是`Splitting image failed. Aborting...`；如果`vendor_ramdisk_size < vendor_ramdisk_table_entry_v4->ramdisk_size`，那么提取出来的vendor_ramdisk文件末尾有额外的数据，结果是magiskboot卡死（也有可能还是`Splitting image failed. Aborting...`）。

> 补充一点，为什么提取出来的vendor_ramdisk损坏会导致magiskboot报错或卡死了？magiskboot又不会自动解包`ramdisk.cpio`。这类需要额外说明一下，vendor_boot分区的ramdisk通常都是经过压缩的，通常使用gzip或者lz4_legacy等格式，而对于GKI设备的vendor_boot分区，Google要求[只能使用lz4_legacy](https://source.android.com/docs/core/architecture/partitions/vendor-boot-partitions#bootloader-support)。因此，magiskboot发生报错或者卡死，是magiskboot尝试解压这些损坏的vendor_ramdisk时导致的。

一切都搞明白之后，修复方法也就很明显了：检测并修复vendor_boot分区，确保`vendor_ramdisk_size`与仅有的一个`vendor_ramdisk_table_entry_v4->ramdisk_size`保持一致，相关提交：[2](https://github.com/Pzqqt/AnyKernel3/commit/7cc7a4271a7a4733b040b56d52406925c41d1dd8)。如果还是解决不了问题，那通常dirty flash rom之后肯定就能解决。

在v3.3版本，很多历史遗留问题都得到了解决，爽！

## Melt Kernel v3.4（2024.12.15）

v3.4是一个相对来说很平静的版本。

内核方面：

1. 现在在编译内核镜像时会在LD阶段和LTO阶段启用3级优化，优点我不知道，缺点是未压缩的内核镜像文件大了1~2MB，生成的差分补丁直接从1~2MB变成了6~7MB。
2. 还原了从v6.x向后移植zsmalloc和zram的提交（因为如果启用ZRAM WriteBack特性的话会编译失败，懒得修），并且启用了RAM WriteBack特性（为什么我到现在才发现）。
3. 修好了DT2W在基于OSS kernel的rom上不好使的问题。

AnyKernel3方面，现在安装器会首先猜测并询问用户当前在使用哪种rom（MIUI/HyperOS、AOSPA、基于OSS kernel的rom），如果rom类型已确定，那么后续的很多选项安装程序会自己做决定，不用再麻烦用户选择。同时，考虑到用户有时可能会手残选错，因此在最后额外添加了一个选项，选No的话则直接终止安装程序，给用户重新选择的机会。

另外，小米在`OS1.0.12.0.UMRCNXM`中改动了`qti_battery_charger_main.ko`，同时给firmware里的adsp2也改了一手。结果是：快充失效了，“显示真实电量”的特性炸了（本来应该显示电量百分比，结果显示成电池电压了），似乎还会导致异常重启。IDA，启动！花了两三个小时，问题解决，相关提交：[1](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/fe1477e444a9d3c4796fc76f9b95a7764af277dd)。

## Melt Kernel v3.5（2025.01.09）

又是一个非常平静的版本。

唯一做了的一点事情，是用一种很脏的方式解决了Google clang 20.0.0/LLVM 19.1.0（以及之后版本的编译器）编译的内核镜像开不了机的问题。

## Melt Kernel v3.6（2025.02.02）

自打v3.4把缺失的ZRAM WriteBack特性补上之后，我才意识到或许小米预编译的`zsmalloc.ko`和`zram.ko`针对自家rom有特殊优化，强制使用开源的zsmalloc模块和zram模块并不可取。因此在这个版本，Melt Kernel不再把zsmalloc和zram编译进内核镜像，而是编译为内核模块，并且允许MIUI/HyperOS用户从小米预编译的zram内核模块和开源的zram内核模块种选择其一（其他rom则强制使用开源的zram内核模块）。

另外，在安装过程中又新增了一个选项，允许用户将GPU型号伪装称8+ Gen1同款的Adreno 730，理论上可以在某些手游种解锁更高的画质或帧率。这个点子来自于我逛某安时偶然看到的某个用户的诉求。伪装的原理也很简单：修改dtb，[以前在whyred的Panda内核上也这么干过](https://github.com/Pzqqt/android_kernel_xiaomi_whyred/commit/7b19aea66e4bcd5bcaac16e3ecfe1346153200df)。

在基于OSS kernel的rom上红外遥控不好使的问题也修好了（结果到头来还是得整两个不同的红外驱动）。

另外，LineageOS团队又开始整活了，这次他们决定对`xiaomi_touch.ko`下手。从代码变更来看，相比之前，新的`xiaomi_touch.ko`的ioctl的参数和行为完全不同，结果不用多想，自然是熄屏手势炸掉。我实在不想再和他们玩猫鼠游戏了，对于这些rom，我选择拒绝支持。

## Melt Kernel v3.7（2025.03.13）

为了修好Melt Kernel与LineageOS重写的xiaomi_touch的兼容性问题，我这次下血本了：花1000块买了台二手marble（12+512，白色）专门做测试机。

机器的成色极其不错，除了菊花有点残之外我看不出任何划痕和磕碰，卖家还白送了我几个花里胡哨的壳，我很满意，我都想把它拿来当主力机使了。

测试机到手之后，我刷了很多AOSP rom，发现Melt Kernel在这些rom上基本都工作正常，发生的bug都在我的预料之内。修复过程也很顺利，花了几个小时就搞定了。

在AOSP rom上测试的过程中，我发现有一些内核模块是AOSP完全不需要或者完全没效果的（包括`binder_prio.ko`），因此，如果安装程序检测到用户的rom不是MIUI/HyperOS，就不加载这些内核模块。

另外，有用户反馈设备在电量低至5%以下时会发生卡顿或卡死的问题。从用户给的内核日志中看不出啥毛病，排除了一些可能有问题的提交，问题依旧，因此只能自己测试了。

首先，我得先把电量消耗到5%以下以复现bug，看起来最简单的步骤对我来说却是最难的：我个人习惯坐在电脑前就把手机连上电脑充电，因此平时手机电量始终维持在很高的水平。这次为了快速消耗电量，我只能忍住不充电，然后打开一个手游放在那里挂机、然后运行几次benchmark、然后挂在那里播放滨崎步的演唱会视频。。。最后花了一下午的时间终于把手机电量从50%多消耗到了5%。

修的过程反倒是最简单的，不到一个小时就找到了问题所在：原来是ACK上游的一个不完整的提交破坏了CPU热插拔相关功能。众所周知（bushi），MIUI/HyperOS会在设备电量低于5%时让几个大核（CPU5和CPU6）离线，而更有意思的是，为了确保流畅，MIUI/HyperOS会在用户打开或切换app时让这些离线的大核短暂上线，此时用户在使用设备时，核心频繁地上线、下线，因此由于CPU热插拔功能被破坏而导致的问题就很容易被察觉。相关提交：[1](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/f443c6b19c416d13322542da267566e619d59457)。

事后我突然想起来，`qcom-battery`下面好像有一个伪装电量百分比的节点，试一下：

```shell
echo 5 > /sys/class/qcom-battery/fake_soc
```

然后，设备电量显示5%，CPU5和CPU6也如我所愿离线了。。。感觉傻乎乎地绞尽脑汁想方设法把电量消耗到5%的自己简直像个🤡。

剩下就没啥好说的了，常规更新。

## Melt Kernel v3.8（2025.04.10）

marble的官方版HyperOS 2终于在用户们的一片骂声中千呼万唤始出来。拆包分析，正如我之前所猜测的，内核模块、dtb、dtbo这些和HyperOS 1基本没啥区别，因此HyperOS 2用户可以直接刷上个v3.7版本，基本0 bug，但按照惯例，Melt Kernel还是将dtb、dtbo、以及用于HyperOS firmware的内核模块同步进行了更新。

在阅读[MKSU](https://github.com/5ec1cff/KernelSU)的源代码时，我发现在内核部分，除了用于验证管理器app的签名信息（证书的长度和哈希）不同以外，其他和KernelSU基本完全一样。因此，理论上只需把MKSU的签名信息添加到内核即可同时支持KernelSU官方版和MKSU，试了一下，确实可行。而对于其他非官方版本的KernelSU，由于各种奇奇怪怪的魔改，我认为还是不去主动兼容比较好。

顺便，我稍微重构了一下KernelSU在内核层验证管理器apk的方法。之前比较常见的添加额外的签名信息的方法，是在`is_manager_apk`函数中再进行一次`check_v2_signature`。

```diff
diff --git a/kernel/apk_sign.c b/kernel/apk_sign.c
--- a/kernel/apk_sign.c
+++ b/kernel/apk_sign.c
@@ -316,5 +316,6 @@ module_param_cb(ksu_debug_manager_uid, &expected_size_ops,
 
 bool is_manager_apk(char *path)
 {
-	return check_v2_signature(path, EXPECTED_SIZE, EXPECTED_HASH);
+	return check_v2_signature(path, EXPECTED_SIZE, EXPECTED_HASH)
+	    || check_v2_signature(path, 384, "7e0c6d7278a3bb8e364e0fcba95afaf3666cf5ff3c245a3b63c8833bd0445cc4");  // MKSU
 }
```

这样意味着，在`is_manager_apk`函数中检查一个apk是否是KernelSU的管理器apk时，是重复多次打开并读取一个apk文件。

简单介绍一下校验的流程：内核打开并读取apk文件，通过apk文件的特殊结构，找到v2签名信息的部分，先检查证书的长度是否对得上，如果对上了再计算证书信息的哈希，如果哈希也对上了那么这个apk就是KernelSU的管理器apk。

经过我重构改进后的校验流程为：和以前一样打开并读取apk文件的v2签名信息，读取到证书长度和证书信息之后，总是计算证书信息的哈希，然后再拿证书的长度和计算得到的哈希与所有有效的签名信息一一进行比较，如果比对上了那么这个apk就是KernelSU的管理器apk。相关提交：[1](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/b005bf59577132365d6d60aad9f6debb31995e80) [2](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/f91e5c4576dc6ddedeb88316fe6f8146ffcbe501)。

这样改进之后，对于一个apk文件只需打开并读取一次即可完成多个有效签名信息的校验，但其实这样改也是有一些缺点的，相信读者应该能感受出来。

官方版HyperOS 2发布之后，有些用户开始跟我反馈刷了Melt Kernel之后超级小爱打不开了，我怎么联想都想不到app打不开会和内核牵扯上，但最后通过用户提供的app崩溃日志，再反编译超级小爱apk同步进行分析，终于找到了原因所在：你还别说，还真是Melt Kernel的锅，原因是超级小爱在尝试从`/sys/devices/virtual/thermal/thermal_message/board_sensor_temp`读取温度时读取到了空字符串，这个节点和`mi_thermal_interface.ko`这个内核模块有关，而在以前，为了满足我的强迫症，我稍微修改其源代码并重新编译了`mi_thermal_interface.ko`，进而导致了这个问题。在将`mi_thermal_interface.ko`替换为小米预编译的之后，问题解决。

另外，从这个版本开始，在支持安装内核的app（比如[KernelFlasher](https://github.com/capntrips/KernelFlasher)）中安装Melt Kernel时，如果检测到系统语言为简体中文，那么提示文本将以简体中文显示（由于目前没有稳定且准确的检测TWRP/OFRP语言的方式，因此在recovery模式安装Melt Kernel时，提示文本仍然只能以英文显示）。

剩下的就是常规更新了，顺便写一些在changelog中没提到的更新优化：

- 简化了触屏驱动，移除了从未使用的手写笔的支持，理论上触屏响应速度会更快。
- 进一步过滤垃圾内核日志，现在在启用[disable_audit_log](https://github.com/Pzqqt/android_kernel_xiaomi_marble/commit/1ce5658804ebc1cb2c61a1a475d59d7ecf9c2a32)之后，不仅内核产生的avc日志会被过滤，用户空间产生的avc日志也会被过滤。

## Melt Kernel v3.9（2025.06.04）

你想让我说什么？

没啥好说的，常规更新。

## Melt Kernel v4.0（2025.06.28）

v4.0最重大的一个变化就是：将几乎所有的内核模块都替换成了从源码编译的，这是我和Asshole共同努力的结果。

整个工作最大的难点是，如果贸然替换小米预编译的内核模块，那么很有可能是开不了机的，因为模块间的依赖关系会发生变化，模块可能缺少其他模块所需的符号，模块记录的符号CRC也有可能会变，等等。为了发现并解决这些问题，只能一次次地上机测试，看内核日志，再对照着修复，整个过程的难度和复杂程度可想而知。

因此，我们先把HyperOS中所有的内核模块全部梳理了一遍，哪些模块是启动到系统时加载，哪些模块是启动到recovery时加载，哪些模块不需要在AOSP rom加载，哪些模块不开源，哪些模块能够从源码编译，哪些模块不应该或不值得从源码编译。

然后，为了简化工作流程，我开发了一个[Python脚本](https://github.com/Pzqqt/AnyKernel3/blob/Marble-Melt/simulate_load_kernel_modules.py)，可以在PC上直接模拟内核加载内核模块的流程，提前发现问题，这样就不需要一次次上机测试了，极大地减少了工作量。

既然现在几乎所有的内核模块都是最新的了，那也就没必要再去兼容老旧的MIUI14了。因此，Melt Kernel v3.9是最后一个支持MIUI14的版本。

在此期间，我们也试着把LineageOS团队搞的开源的相机驱动编译出来看看能不能在HyperOS上用，结果是工作基本正常。所以，对HyperOS用户来说，安装过程中又多了一个可选项。

为了确保开源的相机驱动能最大程度地兼容HyperOS，我们又对照着最新版HyperOS预编译的`camera.ko`以及MiCode的garnet-t-oss开源代码，补充了一些缺失的代码变更。

另外，v4.0可能是我最宠用户的一个版本：用户想要susfs？行，介于它现在已经比较普遍且基本上稳定了，那我就加上；用户想要支持其他非官方版本的KernelSU？行，虽然我仍然不正式支持，但我给你做了个补丁。

这个版本revert了上个版本引入的ZRAM entropy优化，因为benchmark结果显示这个补丁导致了ZRAM的写入速度有所降低。

在做benchmark的过程中，我又顺便测了一下最近在某安被吹上天的lz4kd，结果笑嘻了：ZRAM读取速度相比lz4骤降大约70%，连3级压缩的zstd都打不过，写入速度也毫无优化，辣鸡。

{% include pure-img-responsive.html url="/images/e48/p4.jpg" a_class="pure-u-md-2-3" %}

很多其他的第三方内核又跟风加了lz4的arm64 v8 ASM解压缩优化，我试着加上之后，编译，刷入，开机，很快就看到erofs解压缩系统分区时报错的内核log，因此加我是不可能加了，但我还是进行了一次benchmark，结果是和lz4基本一模一样，那就更没有必要加了。

{% include pure-img-responsive.html url="/images/e48/p5.jpg" a_class="pure-u-md-2-3" %}

实践出真知啊，果然还是不应该随便摘🍒。

最后再吐槽一下v5.10.239，修代码合并冲突和KMI修了一个多小时，修在LineageOS上不开机又修了3个多小时（ADB起不来，minidump也没记录日志，只能靠二分法修，见了鬼了），晚上9点开始干，修完已经是凌晨两点半，我只想说一个字：淦！

## Melt Kernel v4.1（2025.??.??）

*（未完待续...）*

