---
layout: post
tags: Android
excerpt_separator: <!--more-->
---

{% include pure-img-responsive.html url="/images/e42_p1.jpg" a_class="pure-u-md-2-3" %}

Melt Kernel is a kernel that suitable for Redmi Note 12 Turbo/Poco F5(marble/marblein) devices.

<!--more-->

## Features

- Always updating until I don&#39;t have device
- Always merge Linux and CAF upstream updates
- Recompile some driver modules to reduce debugging and logspam
- Free forever, no advertising revenue, no donations accepted

## Other Features

- Available zram compression algorithms: lzo-rle, lz4, zstd
- Available I/O scheduler: bfq, ssg, mq-deadline, kyber
- Available TCP congestion algorithm: westwood, reno, cubic, htcp, bbr
- Add sound control
- Boeffla wakelock blocker driver v1.1.0
- ~~Enable DAMON-based reclaim by default~~
- ~~Kernel-level cpusets parameter optimization, optimize CPU core calls~~
- ~~Enable CONFIG_HZ_300, faster system response~~
- Backport "per memcg lru lock" from v5.15
- ~~Backport zsmalloc from v6.5~~
- ~~Backport zram from v6.4~~
- Backport NTFS3 from v5.15
- Enable TTL/HMARK target support
- Latest zstd driver
- Latest aw882xx driver
- Latest WiFi driver from CAF
- And some other visible and invisible optimizations...

## Note

- In order to ensure the stability of [KMI](https://source.android.com/docs/core/architecture/kernel/stable-kmi), I will not add too many features, please understand
- It should boot on the vast majority of roms (including MIUI). If Melt Kernel doesn&#39;t boot on your rom, please give me feedback

[Download](https://github.com/Pzqqt/android_kernel_xiaomi_marble/releases)

[Source Code](https://github.com/Pzqqt/android_kernel_xiaomi_marble)

[Banner picture source](https://www.pixiv.net/artworks/82352299)

------

Melt内核是一款适用于Redmi Note 12 Turbo/Poco F5（marble/marblein）的内核。

## 特性

- 一直保持更新，直到我没有设备为止
- 总是合并Linux和CAF上游的更新
- 重新编译一些驱动模块以减少调试和垃圾日志
- 永久免费，用爱发电，不通过广告收入，不接受捐赠

## 其他特性

- 支持的zram压缩算法：lzo-rle，lz4，zstd
- 可选I/O调度器：bfq，ssg，mq-deadline，kyber
- 可选TCP拥塞控制算法：westwood，reno，cubic，htcp，bbr
- 添加音量控制支持
- Boeffla唤醒锁阻止驱动v1.1.0
- ~~默认启用基于DAMON的内存回收功能~~
- ~~内核级cpusets参数优化，优化CPU核心调用~~
- ~~启用CONFIG_HZ_300，让系统响应更加迅速~~
- 从v5.15向后移植“per memcg lru lock”
- ~~从v6.5向后移植zsmalloc~~
- ~~从v6.4向后移植zram~~
- 从v5.15向后移植NTFS3
- 启用TTL/HMARK target支持
- 最新的zstd驱动
- 最新的aw882xx驱动
- 来自CAF最新的WiFi驱动
- 其他一些你看得到的和看不到的优化...

## 注意

- 为了确保 [KMI](https://source.android.com/docs/core/architecture/kernel/stable-kmi) 的稳定性，我不会添加太多的功能和特性，请理解
- 它应该可以在绝大多数的rom上启动（包括MIUI）。如果该内核不支持你的rom，请向我反馈

[下载](https://github.com/Pzqqt/android_kernel_xiaomi_marble/releases)

[源代码](https://github.com/Pzqqt/android_kernel_xiaomi_marble)

[Banner 图片来源](https://www.pixiv.net/artworks/82352299)
