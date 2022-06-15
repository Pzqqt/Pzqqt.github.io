---
layout: post
tags: Android
excerpt_separator: <!--more-->
---

{% include pure-img-responsive.html url="/images/Paradox_logo.gif" a_class="pure-u-md-3-4" div_style="margin-top: 1em;" %}

Paradox Kernel is a kernel that suitable for Redmi K30 4G/Poco X2(phoenix/phoenixin) devices.

<!--more-->

## Features

- Always updating until I don&#39;t have device
- Always merge Linux and CAF upstream updates as quickly as possible
- Always compile with the latest Google clang compiler and the latest and most stable gcc compiler
- Port some useful features from later versions of Linux kernel (Damon, mglru, etc.)
- Supports charging by bypassing temperature restrictions to maximize charging speed. Enable &quot;USB fast charging&quot; with any kernel tuning application
- Fixed lots of compile-time warnings, and silenced a lot of kernel logspam
- Free forever, no advertising revenue, no donations accepted

## Other Features

- Kcal, vibration control 
- Using PELT to ensure smoothness and more power saving
- Available zram compression algorithms: lzo-rle, lz4, zstd
- Boeffla wakelock blocker driver v1.1.0
- Available I/O scheduler: cfq, fiops, maple, deadline
- Available TCP congestion algorithm: westwood, reno, cubic, htcp, bbr
- Kernel-level cpusets parameter optimization, optimize CPU core calls
- Enable CONFIG_HZ_300, faster system response
- Latest zstd driver (v1.5.2) (when used as the compression algorithm of zram, decompression+read is 30% faster)
- Latest f2fs driver from Android Common Kernel
- Latest TFA98XX driver from CAF (v6.7.14)
- Latest touchscreen driver from MIUI 13 21.12.27
- And some other visible and invisible optimizations...

## Note

- In theory it supports the vast majority of AOSP roms. If Paradox Kernel doesn&#39;t boot on your rom, please give me feedback
- Paradox Kernel doesn&#39;t provide support for MIUI rom, even if it&#39;s able to boot on MIUI, I won&#39;t fix any bug that only happens on MIUI

[Download](https://github.com/Pzqqt/android_kernel_xiaomi_sm6150-1/releases)

[Source Code](https://github.com/Pzqqt/android_kernel_xiaomi_sm6150-1)

[Telegram Group](https://t.me/paradoxkerneldiscussion)

------

Paradox内核是一款适用于Redmi K30 4G/Poco X2（phoenix/phoenixin）的内核。

## 特性

- 一直保持更新，直到我没有设备为止
- 总是以最快速度合并Linux和CAF上游的更新
- 总是用最新的Google clang编译器和最新最稳定的gcc编译器进行编译
- 适当地从更高版本的Linux内核中移植一些有用的特性（Damon，mglru等等）
- 支持绕过温控限制进行充电，最大化充电速度，用内核调校应用启用“USB 快速充电”即可
- 修复了大量编译时警告，并且禁止了大量的内核垃圾日志
- 永久免费，用爱发电，不通过广告收入，不接受捐赠

## 其他特性

- kcal色彩控制，震动强度控制
- 采用PELT调度算法，保证流畅的同时更加省电
- 支持的zram压缩算法：lzo-rle，lz4，zstd
- Boeffla唤醒锁阻止驱动v1.1.0
- 可选I/O调度器：cfq，fiops，maple，deadline
- 可选TCP拥塞控制算法：westwood，reno，cubic，htcp，bbr
- 内核级cpusets参数优化，优化CPU核心调用
- 启用CONFIG_HZ_300，让系统响应更加迅速
- 最新的zstd驱动（v1.5.2），作为zram的压缩算法时，解压和读取速度比之前快了30%
- 来自Android Common Kernel最新的f2fs驱动
- 来自CAF最新的TFA98XX驱动（v6.7.14）
- 来自MIUI 13 21.12.27最新的触屏驱动
- 其他一些你看得到的和看不到的优化...

## 注意

- 理论上它支持绝大多数的AOSP rom，如果该内核不支持你的rom，请向我反馈
- Paradox内核不提供MIUI rom的支持，即使该内核能够在MIUI上启动，我也不会修复任何只发生在MIUI上的bug

[下载](https://github.com/Pzqqt/android_kernel_xiaomi_sm6150-1/releases)

[源代码](https://github.com/Pzqqt/android_kernel_xiaomi_sm6150-1)

[Telegram 群组](https://t.me/paradoxkerneldiscussion)
