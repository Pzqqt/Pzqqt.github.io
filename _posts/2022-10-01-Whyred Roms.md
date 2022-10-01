---
layout: post
tags: Android
excerpt_separator: <!--more-->
---

<link href="https://cdn.jsdelivr.net/npm/remixicon@2.2.0/fonts/remixicon.css" rel="stylesheet">
<style>
  p.rom-item, .rom-info p {
    margin-block-start: 0.5em;
    margin-block-end: 0.5em;
  }
  .rom-info {
    display: none;
    font-size: 90%;
    border: 1px solid #bbb;
    padding: 0.5em;
    border-radius: 4px;
    background: #f0f3f3;
    overflow: overlay auto;
  }
  code {
    padding: 0;
  }
  pre.highlight {
    font-size: 100%;
  }
</style>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
  $(document).ready(function() {
    $(".rom-title").click(function() {
      var next_rom_info_obj = $(this).parents("p").next(".rom-info");
      if (next_rom_info_obj.css("display") == "none") {
        $(".rom-info:visible").slideUp();
        next_rom_info_obj.slideDown();
      } else {
        next_rom_info_obj.slideUp();
      };
    });
  });
</script>

本文备份了 [Whyred_Rom_Update_Checker](https://github.com/Pzqqt/Whyred_Rom_Update_Checker) 收集的Rom列表。

仅供考古，不再更新。

<!--more-->

<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">/e/ Rom Official</a>
</p>
<div class="rom-info">
    <p><b>Changelog:</b>
    <a href="https://gitlab.e.foundation/e/os/releases/-/releases" target="_blank">https://gitlab.e.foundation/e/os/releases/-/releases</a></p>
    <p><b>Download:</b>
    <a href="https://images.ecloud.global/dev/whyred/e-1.4-r-20220923220394-dev-whyred.zip" target="_blank">e-1.4-r-20220923220394-dev-whyred.zip</a></p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">AICP Official</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> r-16.1</p>
    <p><b>Changelog:</b>
    <a href="https://dwnld.aicp-rom.com/device/whyred/WEEKLY/aicp_whyred_r-16.1-WEEKLY-20220630.zip.html" target="_blank">https://dwnld.aicp-rom.com/device/whyred/WEEKLY/aicp_whyred_r-16.1-WEEKLY-20220630.zip.html</a></p>
    <p><b>MD5:</b> <code>2d9494fcfe6b3d404524effd01a61cf80d72e866f4d647804bbecf72011c563c</code></p>
    <p><b>Download:</b>
    <a href="https://dwnld.aicp-rom.com/device/whyred/WEEKLY/aicp_whyred_r-16.1-WEEKLY-20220630.zip" target="_blank">aicp_whyred_r-16.1-WEEKLY-20220630.zip</a></p>
    <p><b>Size:</b> 840 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Ancient OS</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>33c38fe6183fbfe2bd7d55242574c9da</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/ancientrom/files/whyred/AncientOS-S-Shield-v6.2-whyred-Steel-20220209-2138-Vanilla.zip/download" target="_blank">AncientOS-S-Shield-v6.2-whyred-Steel-20220209-2138-Vanilla.zip</a></p>
    <p><b>Size:</b> 793.2 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Ancient OS (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>a153e7f4ffdca184ed158f5ca55942de</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/ancientrom/files/whyred/AncientOS-S-Shield-v6.2-whyred-Steel-20220210-2205-GApps.zip/download" target="_blank">AncientOS-S-Shield-v6.2-whyred-Steel-20220210-2205-GApps.zip</a></p>
    <p><b>Size:</b> 1323.6 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">AospExtended 11 (Unofficial By SakilMondal)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>fd8ee02274ca79061dbe8883e717a181</code></p>
    <p><b>Download:</b>
    <p><code>AospExtended-v8.7-whyred-OFFICIAL-20211201-2313.zip</code></p>
    <p><a href="https://www.pling.com/p/1423583/#files-panel">Pling</a> | <a href="https://www.pling.com/p/1423583/startdownload?file_id=1638388071&amp;file_name=AospExtended-v8.7-whyred-OFFICIAL-20211201-2313.zip&amp;file_type=application%2Fjava-archive&amp;file_size=1294665389">Direct</a></p></p>
    <p><b>Size:</b> 1234.69 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">AospExtended 12 (Unofficial By SakilMondal)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>0342fe62244b8cca9567a202602bcc71</code></p>
    <p><b>Download:</b>
    <p><code>AospExtended-v9.1-whyred-OFFICIAL-20220602-0933.zip</code></p>
    <p><a href="https://www.pling.com/p/1613676/#files-panel">Pling</a> | <a href="https://www.pling.com/p/1613676/startdownload?file_id=1654197190&amp;file_name=AospExtended-v9.1-whyred-OFFICIAL-20220602-0933.zip&amp;file_type=application%2Fjava-archive&amp;file_size=824713795">Direct</a></p></p>
    <p><b>Size:</b> 786.51 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">AospExtended 12 (with Gapps) Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>4e731acddee36cd17687214b1e334f45</code></p>
    <p><b>Download:</b>
    <a href="https://api.aospextended.com/download/whyred/s_gapps/51ec33e251453d4b1ba96969b5ef7627a56a7f63aecf153c6e5402593ff35c52183e88f153daae7cb0ed32065d37555fec15d5" target="_blank">AospExtended-v9.0-whyred-OFFICIAL-20220216-1317.zip</a></p>
    <p><b>Size:</b> 1247.84 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">AospExtended 12 Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>1f490336b6614b3799018ce6dcf6f0f0</code></p>
    <p><b>Download:</b>
    <a href="https://api.aospextended.com/download/whyred/s/51ec33e251453d4b1ba96969b5ef7627a56a7f63aecf153c6e5402593ff35c52183e88f153daae7cb0ed32065836575fec15d5" target="_blank">AospExtended-v9.0-whyred-OFFICIAL-20220216-1605.zip</a></p>
    <p><b>Size:</b> 782.63 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Arrow OS 11 Official</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> v11.0</p>
    <p><b>Changelog:</b>
    <div class="highlight"><pre class="highlight"># Device side changes
• Switched to AOSP WFD
• Upstream kernel to 4.4.283
• Drop perfd blobs
• Fixed nightlight
• Cleanup useless blobs
• Misc changes
# Source changelog
https://arrowos.net/changelog.php</pre></div></p>
    <p><b>SHA256:</b> <code>a29a490e18261443e64ce2565ca9b6e0e508586306e3421fd208cfe51b1aab86</code></p>
    <p><b>Download:</b>
    <a href="https://arrowos.net/download/whyred" target="_blank">Arrow-v11.0-whyred-OFFICIAL-20220921-VANILLA.zip</a></p>
    <p><b>Size:</b> 838.23 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Arrow OS 11 Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> v11.0</p>
    <p><b>Changelog:</b>
    <div class="highlight"><pre class="highlight"># Device side changes
• Switched to AOSP WFD
• Upstream kernel to 4.4.283
• Drop perfd blobs
• Fixed nightlight
• Cleanup useless blobs
• Misc changes
# Source changelog
https://arrowos.net/changelog.php</pre></div></p>
    <p><b>SHA256:</b> <code>389e3539deba6db5b72678d9a65dfe69c0c49415e9a35730ff9ded85840c49fe</code></p>
    <p><b>Download:</b>
    <a href="https://arrowos.net/download/whyred" target="_blank">Arrow-v11.0-whyred-OFFICIAL-20220921-GAPPS.zip</a></p>
    <p><b>Size:</b> 1161.31 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Arrow OS 12.1 Official</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> v12.1</p>
    <p><b>Changelog:</b>
    <div class="highlight"><pre class="highlight"># Device side changes
- Bluetooth HOTFIX build
# Source changelog
https://arrowos.net/changelog.php</pre></div></p>
    <p><b>SHA256:</b> <code>a5f193957c923e6fe4326b8a5ea7a8388b8d371a32fff7e70a457b2c0ad72dc6</code></p>
    <p><b>Download:</b>
    <a href="https://arrowos.net/download/whyred" target="_blank">Arrow-v12.1-whyred-OFFICIAL-20220927-VANILLA.zip</a></p>
    <p><b>Size:</b> 781.14 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Arrow OS 12.1 Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> v12.1</p>
    <p><b>Changelog:</b>
    <div class="highlight"><pre class="highlight"># Device side changes
- Bluetooth HOTFIX build
# Source changelog
https://arrowos.net/changelog.php</pre></div></p>
    <p><b>SHA256:</b> <code>d8e6b46676b9301a1b1539c00a577660681012fb5babb2f4703147b8e71c5a2f</code></p>
    <p><b>Download:</b>
    <a href="https://arrowos.net/download/whyred" target="_blank">Arrow-v12.1-whyred-OFFICIAL-20220927-GAPPS.zip</a></p>
    <p><b>Size:</b> 1104.62 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Bliss Rom 11 Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>d99ed42c3ac291eb67c671ec396ab1e5</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/blissroms/files/R/whyred/Bliss-v14.5-whyred-OFFICIAL-vanilla-20210731.zip/download" target="_blank">Bliss-v14.5-whyred-OFFICIAL-vanilla-20210731.zip</a></p>
    <p><b>Size:</b> 804.2 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Carbon Rom (Unofficial By fakeyato)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>3f18700e80e08bd59f2e5504b6fc7b29</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/fakecarbon/files/carbon/CARBON-CR-9.0-R-FAKE-whyred-20210701-1248.zip/download" target="_blank">CARBON-CR-9.0-R-FAKE-whyred-20210701-1248.zip</a></p>
    <p><b>Size:</b> 718.9 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Carbon Rom Official</a>
</p>
<div class="rom-info">
    <p><b>Build type:</b> weekly</p>
    <p><b>MD5:</b> <code>7df91aef098c70a42ba335d563072b55</code></p>
    <p><b>Download:</b>
    <a href="https://mirrorbits.carbonrom.org/whyred/CARBON-CR-9.0-R-WEEKLY-whyred-20220728-1528.zip" target="_blank">CARBON-CR-9.0-R-WEEKLY-whyred-20220728-1528.zip</a></p>
    <p><b>Size:</b> 794.14 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Cherish OS Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>245b41bd0652b63ba32cae0fd21ed480</code></p>
    <p><b>Download:</b>
    <p><code>Cherish-OS-v3.6-20220410-1703-whyred-OFFICIAL-Vanilla.zip</code></p>
    <p><a href="https://www.pling.com/p/1460395/#files-panel">Pling</a> | <a href="https://www.pling.com/p/1460395/startdownload?file_id=1649616435&amp;file_name=Cherish-OS-v3.6-20220410-1703-whyred-OFFICIAL-Vanilla.zip&amp;file_type=application%2Fjava-archive&amp;file_size=908737515">Direct</a></p></p>
    <p><b>Size:</b> 866.64 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Cherish OS Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>282b6944a42948fe93be893708d64e1a</code></p>
    <p><b>Download:</b>
    <p><code>Cherish-OS-v3-20220410180618.6-20220410-1509-whyred-OFFICIAL-GApps.zip</code></p>
    <p><a href="https://www.pling.com/p/1460395/#files-panel">Pling</a> | <a href="https://www.pling.com/p/1460395/startdownload?file_id=1649614464&amp;file_name=Cherish-OS-v3-20220410180618.6-20220410-1509-whyred-OFFICIAL-GApps.zip&amp;file_type=application%2Fjava-archive&amp;file_size=1491303802">Direct</a></p></p>
    <p><b>Size:</b> 1422.22 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Conquer OS Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>5d06b2c8ea2adf5e697dfe78639032d5</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/conqueros/files/Eleven/stable/whyred/conquerOS-4.7-whyred-20210921-1532-OFFICIAL-vanilla.zip/download" target="_blank">conquerOS-4.7-whyred-20210921-1532-OFFICIAL-vanilla.zip</a></p>
    <p><b>Size:</b> 812.4 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Conquer OS Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>4a5e38e04a67e175a40b038f51e49ead</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/conqueros/files/Eleven/stable/whyred/conquerOS-4.7-whyred-20210921-1553-OFFICIAL-gapps.zip/download" target="_blank">conquerOS-4.7-whyred-20210921-1553-OFFICIAL-gapps.zip</a></p>
    <p><b>Size:</b> 1256.9 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Corvus OS Official</a>
</p>
<div class="rom-info">
    <p><b>Download:</b>
    <a href="https://ota.corvusrom.com/whyred/vanilla/Corvus_vS4.0-Leviathan-whyred-Official-1647.zip" target="_blank">Corvus_vS4.0-Leviathan-whyred-Official-1647.zip</a></p>
    <p><b>Size:</b> 850.57MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Corvus OS Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>Download:</b>
    <a href="https://ota.corvusrom.com/whyred/gapps/Corvus_vS4.0-Leviathan-whyred-Gapps-Official-1020.zip" target="_blank">Corvus_vS4.0-Leviathan-whyred-Gapps-Official-1020.zip</a></p>
    <p><b>Size:</b> 1.32GB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">CrDroid Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>4b420247ee8230b2bc73a84a92c4bf7d</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/crdroid/files/whyred/7.x/crDroidAndroid-11.0-20211002-whyred-v7.10.zip/download" target="_blank">crDroidAndroid-11.0-20211002-whyred-v7.10.zip</a></p>
    <p><b>Size:</b> 850.6 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">DerpFest Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>d3890fe0f0f152692dfa80ba1c8dd530</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/derpfest/files/whyred/DerpFest-12-Official-Shinju-whyred-20220822.zip/download" target="_blank">DerpFest-12-Official-Shinju-whyred-20220822.zip</a></p>
    <p><b>Size:</b> 1489.5 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Dot OS Official</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> v5.1.3</p>
    <p><b>MD5:</b> <code>cc053fb1a362412c3f25758257226f1b</code></p>
    <p><b>Download:</b>
    <p><code>dotOS-R-v5.1.3-whyred-OFFICIAL-20210810-2327.zip</code></p>
    <p><a href="https://downloads.droidontime.com/dot11/whyred/vanilla/dotOS-R-v5.1.3-whyred-OFFICIAL-20210810-2327.zip">Official</a> | <a href="https://sourceforge.net/projects/dotos-downloads/files/dot11/whyred/vanilla/dotOS-R-v5.1.3-whyred-OFFICIAL-20210810-2327.zip/download">SourceForge</a></p></p>
    <p><b>Size:</b> 739.52 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Dot OS Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> v5.1.3</p>
    <p><b>MD5:</b> <code>a21ff54d5378c0800420cd1e944c1c33</code></p>
    <p><b>Download:</b>
    <p><code>dotOS-R-v5.1.3-whyred-GAPPS-20210811-0023.zip</code></p>
    <p><a href="https://downloads.droidontime.com/dot11/whyred/gapps/dotOS-R-v5.1.3-whyred-GAPPS-20210811-0023.zip">Official</a> | <a href="https://sourceforge.net/projects/dotos-downloads/files/dot11/whyred/gapps/dotOS-R-v5.1.3-whyred-GAPPS-20210811-0023.zip/download">SourceForge</a></p></p>
    <p><b>Size:</b> 1153.76 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">EvolutionX (Unofficial By @The_Santy)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>817778a3180fc2ed86d0bc61a16b0700</code></p>
    <p><b>Download:</b>
    <p><code>evolution-whyred-ota-sq3a.220705.004-08090814.zip</code></p>
    <p><a href="https://www.pling.com/p/1545610/#files-panel">Pling</a> | <a href="https://www.pling.com/p/1545610/startdownload?file_id=1660031285&amp;file_name=evolution-whyred-ota-sq3a.220705.004-08090814.zip&amp;file_type=application%2Fjava-archive&amp;file_size=1505297200">Direct</a></p></p>
    <p><b>Size:</b> 1435.56 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">EvolutionX Official</a>
</p>
<div class="rom-info">
    <p><b>Changelog:</b>
    <a href="https://raw.githubusercontent.com/Evolution-X-Devices/official_devices/master/changelogs/whyred/evolution_whyred-ota-sq3a.220705.004-09011242.zip.txt" target="_blank">https://raw.githubusercontent.com/Evolution-X-Devices/official_devices/master/changelogs/whyred/evolution_whyred-ota-sq3a.220705.004-09011242.zip.txt</a></p>
    <p><b>MD5:</b> <code>3aa421cb6745ef2dff97d34aa6d369a3</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/evolution-x/files/whyred/evolution_whyred-ota-sq3a.220705.004-09011242.zip/download" target="_blank">evolution_whyred-ota-sq3a.220705.004-09011242.zip</a></p>
    <p><b>Size:</b> 1526.2 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Havoc OS 11 Official</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> 4.8</p>
    <p><b>MD5:</b> <code>7c44a09c96ecf55913d839a8479e24b9</code></p>
    <p><b>Download:</b>
    <a href="https://download.havoc-os.com/whyred/Havoc-OS-v4.8-20210811-whyred-Official.zip" target="_blank">Havoc-OS-v4.8-20210811-whyred-Official.zip</a></p>
    <p><b>Size:</b> 774.9 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Havoc OS 11 Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> 4.8</p>
    <p><b>MD5:</b> <code>393ad10e2b3f5565d80a51c0575c7507</code></p>
    <p><b>Download:</b>
    <a href="https://download.havoc-os.com/whyred/Havoc-OS-v4.8-20210810-whyred-Official-GApps.zip" target="_blank">Havoc-OS-v4.8-20210810-whyred-Official-GApps.zip</a></p>
    <p><b>Size:</b> 1285.4 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Legion OS Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>82cb01bfdf85d7c0a636d694b0fa19f9</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/legionrom/files/whyred/LegionOS-v3.8-whyred-20210409-OFFICIAL-VANILLA.zip/download" target="_blank">LegionOS-v3.8-whyred-20210409-OFFICIAL-VANILLA.zip</a></p>
    <p><b>Size:</b> 893.9 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Lineage OS 18.0 (Unofficial By SakilMondal)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>71a61d0f6eb56033a7f50d0f54d7f4c4</code></p>
    <p><b>Download:</b>
    <p><code>lineage-18.1-FORK-GAPPS-20220624-0901-whyred.zip</code></p>
    <p><a href="https://www.pling.com/p/1422431/#files-panel">Pling</a> | <a href="https://www.pling.com/p/1422431/startdownload?file_id=1656099556&amp;file_name=lineage-18.1-FORK-GAPPS-20220624-0901-whyred.zip&amp;file_type=application%2Fjava-archive&amp;file_size=1202976037">Direct</a></p></p>
    <p><b>Size:</b> 1147.25 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Lineage OS Official</a>
</p>
<div class="rom-info">
    <p><b>Build type:</b> nightly</p>
    <p><b>Build version:</b> 18.1</p>
    <p><b>Changelog:</b>
    <a href="https://download.lineageos.org/whyred/changes/" target="_blank">https://download.lineageos.org/whyred/changes/</a></p>
    <p><b>SHA1:</b> <code>6a23730c7730631758a380c468ccd133cf4d60e2</code></p>
    <p><b>SHA256:</b> <code>edef27c61d97715460fff8f5984e622dda1a6f4066ae3406018eee7bb6c68ee2</code></p>
    <p><b>Download:</b>
    <a href="https://mirrorbits.lineageos.org/full/whyred/20220926/lineage-18.1-20220926-nightly-whyred-signed.zip" target="_blank">lineage-18.1-20220926-nightly-whyred-signed.zip</a></p>
    <p><b>Size:</b> 729.14 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">New rom release by AdrarHussain</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>056ef2f8c1cb590e04867c0896e554ea</code></p>
    <p><b>Download:</b>
    <p><code>Spark-vFlare-whyred-Unofficial-gapps-20210726.zip</code></p>
    <p><a href="https://www.pling.com/p/1459808/#files-panel">Pling</a> | <a href="https://www.pling.com/p/1459808/startdownload?file_id=1627443989&amp;file_name=Spark-vFlare-whyred-Unofficial-gapps-20210726.zip&amp;file_type=application%2Fjava-archive&amp;file_size=1223134741">Direct</a></p></p>
    <p><b>Size:</b> 1166.47 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Nezuko OS Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>7126256417bf9b65726c9f39ab98de5a</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/nezukoos/files/Whyred/Vanilla/NezukoOS-1.4-VANILLA-whyred-20210717-1505-OFFICIAL.zip/download" target="_blank">NezukoOS-1.4-VANILLA-whyred-20210717-1505-OFFICIAL.zip</a></p>
    <p><b>Size:</b> 731.4 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Nezuko OS Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>834e24bb7da3e07db708190755270380</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/nezukoos/files/Whyred/Gapps/NezukoOS-1.4-GAPPS-whyred-20210717-1557-OFFICIAL.zip/download" target="_blank">NezukoOS-1.4-GAPPS-whyred-20210717-1557-OFFICIAL.zip</a></p>
    <p><b>Size:</b> 1142.1 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Nusantara Project Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>672d047afc86b7c213207a55c41d300d</code></p>
    <p><b>Download:</b>
    <p><code>Nusantara-v4.4-12L-whyred-15042022-OFFICIAL-1615.zip</code></p>
    <p><a href="https://www.pling.com/p/1422405/#files-panel">Pling</a> | <a href="https://www.pling.com/p/1422405/startdownload?file_id=1650100208&amp;file_name=Nusantara-v4.4-12L-whyred-15042022-OFFICIAL-1615.zip&amp;file_type=application%2Fjava-archive&amp;file_size=820625217">Direct</a></p></p>
    <p><b>Size:</b> 782.61 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Octavi OS Official</a>
</p>
<div class="rom-info">
    <p><b>Download:</b>
    <p><code>OctaviOS-v3.3-whyred-20220122-1949-VANILLA-OFFICIAL.zip</code></p>
    <p><a href="https://www.pling.com/p/1620047/#files-panel">Pling</a> | <a href="https://downloads.octavi-os.com/whyred/OctaviOS-v3.3-whyred-20220122-1949-VANILLA-OFFICIAL.zip">Direct</a></p></p>
    <p><b>Size:</b> 0.02 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Octavi OS Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>Download:</b>
    <p><code>OctaviOS-v3.3-whyred-20220122-1909-GAPPS-OFFICIAL.zip.zip</code></p>
    <p><a href="https://www.pling.com/p/1620047/#files-panel">Pling</a> | <a href="https://downloads.octavi-os.com/whyred/OctaviOS-v3.3-whyred-20220122-1909-GAPPS-OFFICIAL.zip.zip">Direct</a></p></p>
    <p><b>Size:</b> 0.02 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">POSP Official</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> v4.2.3</p>
    <p><b>Download:</b>
    <a href="https://github.com/PotatoDevices/device_xiaomi_whyred/releases/download/4.2.3/potato_whyred-11-20210910-dumaloo.v4.2.3%2B20.Crispy.zip" target="_blank">potato_whyred-11-20210910-dumaloo.v4.2.3+20.Crispy.zip</a></p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Paranoid Android (Unofficial By orges)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>0340bd1acea121f971358c8055ccfa99</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/aospa-whyred/files/pa-ruby-1-whyred-20210822-release.zip/download" target="_blank">pa-ruby-1-whyred-20210822-release.zip</a></p>
    <p><b>Size:</b> 935.9 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Pixel Extended Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>2541900f8c377cfcedcfc29a950e849f</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/pixelextended/files/whyred/PixelExtended_whyred-12.1-20220415-1252-OFFICIAL.zip/download" target="_blank">PixelExtended_whyred-12.1-20220415-1252-OFFICIAL.zip</a></p>
    <p><b>Size:</b> 1584.0 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">PixelPlusUI Official</a>
</p>
<div class="rom-info">
    <p><b>Download:</b>
    <p><code>PixelPlusUI_4.2_whyred-12.0-20220217-0845-OFFICIAL.zip</code></p>
    <p><a href="https://www.pling.com/p/1513365/#files-panel">Pling</a> | <a href="https://download.ppui.site/eleven/whyred/PixelPlusUI_4.2_whyred-12.0-20220217-0845-OFFICIAL.zip">Direct</a></p></p>
    <p><b>Size:</b> 1392.02 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Pixys OS 12 Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> v5.1.5</p>
    <p><b>MD5:</b> <code>5b33c09ace69a621ff97d80ca3c3e00b</code></p>
    <p><b>Download:</b>
    <a href="https://pixysos.com/whyred/twelve/PixysOS-v5.1.5-GAPPS-whyred-OFFICIAL-20220820-181505.zip" target="_blank">PixysOS-v5.1.5-GAPPS-whyred-OFFICIAL-20220820-181505.zip</a></p>
    <p><b>Size:</b> 1.41 GB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Project Elixir Official</a>
</p>
<div class="rom-info">
    <p><b>Download:</b>
    <p><code>ProjectElixir_1.5_whyred-12.0-20220312-1339-OFFICIAL.zip</code></p>
    <p><a href="https://www.pling.com/p/1673869/#files-panel">Pling</a> | <a href="https://downloads.projectelixiros.com/twelve/whyred/ProjectElixir_1.5_whyred-12.0-20220312-1339-OFFICIAL.zip">Direct</a></p></p>
    <p><b>Size:</b> 1401.21 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Project Radiant Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>91ebeac089c55b65378cff115f07525f</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/projectradiant/files/twelve/whyred/ProjectRadiant-12.0.2-HOTFIX-OFFICIAL-whyred-20220214-gapps.zip/download" target="_blank">ProjectRadiant-12.0.2-HOTFIX-OFFICIAL-whyred-20220214-gapps.zip</a></p>
    <p><b>Size:</b> 1372.9 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Project Sakura ROM Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>c977ff8f72335dba55209e13f34d841e</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/projectsakura/files/whyred/ProjectSakura-5.2-VANILLA-20210926-0507-whyred-OFFICIAL.zip/download" target="_blank">ProjectSakura-5.2-VANILLA-20210926-0507-whyred-OFFICIAL.zip</a></p>
    <p><b>Size:</b> 884.3 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Resurrection Remix OS Q (Unofficial By AdrarHussain)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>95ca24701570c4f88412e4dab930d4f6</code></p>
    <p><b>Download:</b>
    <p><code>RROS-Q-8.6.9-20210516-whyred-Vanilla-Official.zip</code></p>
    <p><a href="https://www.pling.com/p/1459808/#files-panel">Pling</a> | <a href="https://www.pling.com/p/1459808/startdownload?file_id=1621258190&amp;file_name=RROS-Q-8.6.9-20210516-whyred-Vanilla-Official.zip&amp;file_type=application%2Fjava-archive&amp;file_size=973462195">Direct</a></p></p>
    <p><b>Size:</b> 928.37 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Resurrection Remix OS Q (Unofficial By AdrarHussain)(Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>8423ab025c9ab9552a33c5aed9a5ad9b</code></p>
    <p><b>Download:</b>
    <p><code>RROS-Q-8.6.9-20210517-whyred-Gapps-Official.zip</code></p>
    <p><a href="https://www.pling.com/p/1459808/#files-panel">Pling</a> | <a href="https://www.pling.com/p/1459808/startdownload?file_id=1621258171&amp;file_name=RROS-Q-8.6.9-20210517-whyred-Gapps-Official.zip&amp;file_type=application%2Fjava-archive&amp;file_size=1154741413">Direct</a></p></p>
    <p><b>Size:</b> 1101.25 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Resurrection Remix OS Q Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>135a2bfcce7512a1af11b5ec131bd87d</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/resurrectionremix-ten/files/whyred/RROS-Q-8.7.3-20210924-whyred-vanilla-Official.zip/download" target="_blank">RROS-Q-8.7.3-20210924-whyred-vanilla-Official.zip</a></p>
    <p><b>Size:</b> 978.3 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Resurrection Remix OS Q Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>bb89c756c0ea87306d2c4a8ec57492cb</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/resurrectionremix-ten/files/whyred/RROS-Q-8.7.3-20210924-whyred-gapps-Official.zip/download" target="_blank">RROS-Q-8.7.3-20210924-whyred-gapps-Official.zip</a></p>
    <p><b>Size:</b> 1184.9 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Revenge OS Official</a>
</p>
<div class="rom-info">
    <p><b>Build version:</b> 4.1</p>
    <p><b>Changelog:</b>
    <div class="highlight"><pre class="highlight">Rebased device tree to latest lineage
Switch to AOSP WFD
Dex2oat optimization
Switch to LED AIDL qti vibrator
Switch to SnapCamera
Some update on kernel</pre></div></p>
    <p><b>MD5:</b> <code>e39fae94771893d054683b03547e73fe</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/revengeos/files/whyred/RevengeOS-4.1-R-OFFICIAL-whyred-20210921-2100.zip" target="_blank">RevengeOS-4.1-R-OFFICIAL-whyred-20210921-2100.zip</a></p>
    <p><b>Size:</b> 770.8 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Stag OS R Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>c5c42d923670df289208090425e9e6a5</code></p>
    <p><b>Download:</b>
    <p><code>StagOS-whyred-11.0.R1-OFFICIAL-Pristine-20210210-0519.zip</code></p>
    <p><a href="https://sourceforge.net/projects/stagos-11/files/whyred/StagOS-whyred-11.0.R1-OFFICIAL-Pristine-20210210-0519.zip/download">SourceForge</a> | <a href="https://releases.stag-os.workers.dev/whyred/StagOS-whyred-11.0.R1-OFFICIAL-Pristine-20210210-0519.zip">Mirror</a></p></p>
    <p><b>Size:</b> 839.3 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Stag OS R Official (Include Gapps)</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>5daf717dc51371e549d42905027ec5ce</code></p>
    <p><b>Download:</b>
    <p><code>StagOS-whyred-11.0.R1-OFFICIAL-GApps-20210211-0629.zip</code></p>
    <p><a href="https://sourceforge.net/projects/stagos-11/files/whyred/StagOS-whyred-11.0.R1-OFFICIAL-GApps-20210211-0629.zip/download">SourceForge</a> | <a href="https://releases.stag-os.workers.dev/whyred/StagOS-whyred-11.0.R1-OFFICIAL-GApps-20210211-0629.zip">Mirror</a></p></p>
    <p><b>Size:</b> 1085.9 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Styx OS Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>116b3d48c12be33bf1501e3e1ca9f43a</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/styx-os/files/Athena/release/whyred/styxOS-1.3-Athena-whyred-OFFICIAL-20210511-0610.zip/download" target="_blank">styxOS-1.3-Athena-whyred-OFFICIAL-20210511-0610.zip</a></p>
    <p><b>Size:</b> 1262.3 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Superior OS Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>d34ba07546d19666457528cd2af9a6ef</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/superioros/files/whyred/gapps/SuperiorOS-Thirteen-Alpha-whyred-GAPPS-RELEASE-20220924-1729.zip/download" target="_blank">SuperiorOS-Thirteen-Alpha-whyred-GAPPS-RELEASE-20220924-1729.zip</a></p>
    <p><b>Size:</b> 1146.1 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">TenX OS Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>b941a7525e71dac42b9195f6cee9e49b</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/tenx-os/files/Whyred/TenX-OS_whyred-11.0-20210423-1555-Trident-Official.zip/download" target="_blank">TenX-OS_whyred-11.0-20210423-1555-Trident-Official.zip</a></p>
    <p><b>Size:</b> 1444.1 MB</p>
</div>
<p class="rom-item">
    <i class="file-icon ri-android-line"></i>
    <a href="javascript:;" class="rom-title">Xtended Official</a>
</p>
<div class="rom-info">
    <p><b>MD5:</b> <code>7abc8436f8752a0c79b8de98b4d4cea5</code></p>
    <p><b>Download:</b>
    <a href="https://sourceforge.net/projects/xtended/files/whyred/Xtended-XR-v2.0-whyred-OFFICIAL-20201111.zip/download" target="_blank">Xtended-XR-v2.0-whyred-OFFICIAL-20201111.zip</a></p>
    <p><b>Size:</b> 751.8 MB</p>
</div>
