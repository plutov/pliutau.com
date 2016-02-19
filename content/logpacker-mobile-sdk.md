+++
date = "2016-02-19T13:39:16+07:00"
title = "LogPacker mobile SDK"
tags = [ "Mobile", "Go", "LogPacker", "Android", "Java", "iOS" ]
+++
![GoAndroid](/android.png)

This article is an addition to the [post](http://pliutau.com/how-to-launch-logpacker-cluster/) how to launch LogPacker Cluster for free.

##### Goals

We started to collect logs from mobile devices, currently on Android and iOS. Since Go 1.5 [gomobile](https://golang.org/x/mobile/cmd/gomobile) tool can create a bindings for Java/Objective-C/Swift. Yes, it's not possible for Windows Phone. Main LogPacker application is written in Go, so we decided to write Mobile SDK in Go too, because it's cheaper for us.
<!--more-->

##### Common Go-code

You can check our [mobile-sdk](https://github.com/logpacker/mobile-sdk) public repo how we did it. In README you can find all instruction to reproduce my steps.

##### Profit

The main advantage of this way is that we have one common code for 2 platforms, but disadvantage is that gomobile feature in Go is still in expermintal state, so be carefully while playing with it.
