---
layout: post
tags: Android
excerpt_separator: <!--more-->
toc: true
---

## 什么是Damon reclaim？

简单介绍一下Damon reclaim的作用：依托DAMON提供的数据访问模式监测能力，根据当前的内存压力，主动地回收“冷内存”（即长时间未被访问的内存页）。

Damon reclaim提供了较为丰富的可调整参数，位于 `/sys/module/damon_reclaim/parameters` ，其中很多参数不需要再进行调整，只需重点关注以下这些：<!--more-->
- `wmarks_high` ：高内存空闲率阈值，千分比，当MemFree空闲率大于该值时，意味着空闲内存足够充裕，此时Damon reclaim停止工作。
- `wmarks_mid` ：中内存空闲率阈值，千分比，当MemFree空闲率小于该值且大于 `wmarks_low` 时，Damon reclaim会开始工作（监控并回收）。
- `wmarks_low` ：低内存空闲率阈值，千分比，当MemFree空闲率小于该值时，意味着空闲内存严重不足，此时Damon reclaim停止工作，避免与系统默认的回收逻辑冲突。
- `wmarks_interval` ：内存空闲率检查间隔，单位毫秒，Damon reclaim会每隔 `wmarks_interval` 毫秒检查一次内存空闲率，配合上面仨参数来决定Damon reclaim是否应该工作。
- `min_age` ：识别冷内存区域的时间阈值，单位微秒，当内存页面超过这个时间未被访问过的话，就将该内存页面标记为冷，然后等着Damon回收它。
- `quota_reset_interval_ms` ：配额重置间隔，单位毫秒，稍后和 `quota_ms` 以及 `quota_sz` 放在一起介绍。
- `quota_ms` ：配额内尝试回收的时间限制，单位毫秒。
- `quota_sz` ：配额内尝试回收的内存大小限制，单位字节。
- `enabled` ：Damon reclaim的开关，写入1或Y启用，写入0或N禁用。
- `commit_inputs` ：提交输入，当Damon reclaim处于启用状态时，修改各项参数并不会立即生效，只有给 `commit_inputs` 写入1或Y才会生效。

如何了解Damon reclaim的工作效果？可以读取 `bytes_reclaim_tried_regions` 和 `bytes_reclaimed_regions`，前者返回Damon reclaim尝试回收的内存大小，后者返回Damon reclaim成功回收的内存大小。

Melt Kernel和Bouquet Kernel则是添加了更详细的内核日志，你可以通过内核日志实时了解Damon reclaim的工作状态：

```
marble:/ # dmesg -w | grep damon
[51990.973940] damon: activate a scheme (2), mem free rate: 14%
[52101.461051] damon: 253 MB of memory reclaimed
[52105.524078] damon: 245 MB of memory reclaimed
[52111.048677] damon: 212 MB of memory reclaimed
[52155.011594] damon: 227 MB of memory reclaimed
[52175.376761] damon: 172 MB of memory reclaimed
[52175.376772] damon: deactivate a scheme (2) for high wmark, mem free rate: 25%
...
```

## Android设备Damon reclaim参数调优

### wmarks

现在举个例子，假设 `wmarks_high` 为 `250`，`wmarks_mid` 为 `200`，`wmarks_low` 为 `50`，Damon reclaim的工作逻辑是这样的：
1. `MemFree > 25%` 或 `MemFree < 5%` 时，Damon reclaim不工作。
2. MemFree减少（从25%以上掉到25%以下），且 `25% > MemFree > 20%` 时，Damon reclaim依旧不工作。
3. `20% > MemFree > 5%` 时，Damon reclaim开始工作，此时有两种可能的情况：
   - Damon reclaim没来得及回收足够多的内存，直到 `MemFree < 5%` ，Damon reclaim停止工作。
   - Damon reclaim持续回收内存，直到 `MemFree> 25%` 后，Damon reclaim停止工作。

然后，务必搞明白一点， `wmarks_high` `wmarks_mid` `wmarks_low` 的判定标准是空闲内存MemFree，而不是可用内存MemAvailable，两者有很大的差别。你在最近任务界面和“正在运行的服务”界面看到的可用内存，都是MemAvailable。

```
marble:/ # cat /proc/meminfo
MemTotal:       11438484 kB
MemFree:         3472884 kB
MemAvailable:    6680824 kB
Buffers:            6772 kB
Cached:          2747716 kB
SwapCached:       129024 kB
...
```

实际使用Android设备（特别是重度使用）时，MemFree往往是很少的，你可以试着在手机上打开很多个app，你会看到MemFree变得越来越少，甚至可能会不足MemTotal的1%，但MemAvailable依旧很充裕，设备也完全不卡顿。弄清MemFree和MemAvailable的区别，才能更准确更针对性地对Damon reclaim参数进行调优。

那么， `wmarks_high` `wmarks_mid` `wmarks_low` 这仨参数该怎么调整比较好呢？这个要具体情况具体分析，根据你的设备的内存总量和日常使用时的内存占用情况自行调整，并没有“一招鲜吃遍天”的参数，但我仍然可以提供一些建议：

1. 不要把 `wmarks_low` 调得太低，这会使得设备在高内存压力时和系统的回收逻辑发生冲突。建议不要低于5%。
2. 不要把 `wmarks_high` `wmarks_mid` 调得太高，这会导致Damon reclaim长时间工作还达不到“业绩”从而导致耗电量增加。根据你的设备的内存总量， `wmarks_high` 建议20~30%， `wmarks_mid` 建议比 `wmarks_high` 少5%。

`wmarks_interval` 参数默认是5秒，较为合适，将 `wmarks_interval` 调小可以使得Damon reclaim监测MemFree更加频繁，让Damon reclaim反应更加迅速，避免出现MemFree急剧减少但Damon reclaim进程还在sleep的情况。你可以试着将 `wmarks_interval` 调为1秒，这并不会导致明显的耗电量增加。

### min_age

`min_age` 参数默认是120秒，但对于Android设备来说这个值明显偏大了。Android应用切换较为频繁，如果设置太短（<10秒），会导致你刚切到后台的应用被立刻回收，产生明显的二次启动延迟；如果太长（如默认的120秒），则会导致内存回收不够及时。对于内存压力较大的低端机，可以尝试30秒；对于8GB+内存的设备，建议60秒。

### quota

`quota_reset_interval_ms` `quota_ms` `quota_sz` 这三个参数的效果用一句话概况就是：Damon reclaim在 `quota_reset_interval_ms` 毫秒内不会花费超过 `quota_ms` 毫秒的时间去回收内存，且在 `quota_reset_interval_ms` 毫秒内回收的内存不会超过 `quota_sz` 字节。

调整 `quota_ms` 和 `quota_sz` 的意义在于限制Damon reclaim的CPU性能消耗和IO性能消耗。

`quota_reset_interval_ms` 参数默认为1秒，通常不需要调整。 `quota_ms` 参数默认为50毫秒、 `quota_sz` 参数默认为128MB，那么，这俩参数怎样调整比较好呢？首先用默认的参数看看：

```
marble:/ # cat /proc/meminfo
[54743.159805] damon: activate a scheme (2), mem free rate: 14%
[54744.053335] damon: 48 MB of memory reclaimed
[54837.188327] damon: 36 MB of memory reclaimed
[54837.744178] damon: 19 MB of memory reclaimed
[54838.802137] damon: 30 MB of memory reclaimed
[54839.861566] damon: 19 MB of memory reclaimed
[54840.905742] damon: 13 MB of memory reclaimed
[54841.942286] damon: 8 MB of memory reclaimed
...
[55025.440300] damon: 2 MB of memory reclaimed
[55026.449545] damon: 680 KB of memory reclaimed
[55027.490795] damon: 496 KB of memory reclaimed
[55028.503021] damon: 1 MB of memory reclaimed
[55029.531087] damon: 528 KB of memory reclaimed
[55030.647704] damon: 476 KB of memory reclaimed
[55031.756676] damon: 4 MB of memory reclaimed
[55032.825731] damon: 516 KB of memory reclaimed
...
```

你会发现Damon reclaim每秒回收的内存通常不会超过20MB，随着时间的推移，每秒回收的越来越少，突出一个“细水长流”、“慢工出细活”。

那么假设我们放开限制，把 `quota_ms` 和 `quota_sz` 都设置为0呢？

```
marble:/ # dmesg -w | grep damon
[51990.973940] damon: activate a scheme (2), mem free rate: 14%
[52101.461051] damon: 253 MB of memory reclaimed
[52105.524078] damon: 245 MB of memory reclaimed
[52111.048677] damon: 212 MB of memory reclaimed
[52155.011594] damon: 227 MB of memory reclaimed
[52175.376761] damon: 172 MB of memory reclaimed
[52175.376772] damon: deactivate a scheme (2) for high wmark, mem free rate: 25%
...
```

你会发现Damon reclaim每次一口气回收了几百MB的内存。“早点干活早点休息”固然是好，但CPU突然高负荷工作、IO吞吐量飙升往往伴随着系统卡顿。

因此，如何调整 `quota_ms` 和 `quota_sz`，目前我也拿捏不准，你可以自己动手调着试试，至少我在测试时发现两种方案无论是耗电量还是系统流畅度都没有可感知的差别。

## Damon reclaim适合Android设备吗？

最后我要放出一个暴论： **Damon reclaim不适合Android设备。**

主动回收内存能带来哪些好处呢？及时把app“占而不用”的内存腾出来，这样当其他app需要内存时，系统总有现成的内存可用，避免直接内存回收导致的卡顿。

但实际使用的话你就会发现，即使Damon reclaim在后台兢兢业业地回收内存，你的日常使用体验也很难有可感知的变化，参数调整不当的话还会导致额外的耗电。

最后，也是比较容易被忽略的一点：如果Damon reclaim确实很实用，那为什么没有见过任何一家手机厂商在用呢？

考虑到Amazon给自家服务器的5.10内核也移植了Damon，或许Damon reclaim还是更加适合内存超配的虚拟化环境吧。
