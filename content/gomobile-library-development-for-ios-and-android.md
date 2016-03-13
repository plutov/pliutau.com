+++
date = "2016-03-13T15:11:13+07:00"
title = "GoMobile: Library development for IOS/Android"
tags = [ "Mobile", "Go", "LogPacker", "Android", "Java", "iOS" ]
+++
![Gomobile](/gomobile.png)

[Read full article](https://logpacker.com/blog/gomobile-library-development-for-ios-and-android?utm_source=pliutau)

Cross platform development of mobile applications was quite popular back then. This approach was used by most companies in the time of mobile branch establishment. The main reasons for using this approach were simple – lack of professionals in the market, slow development speed and unreasonable cost. Unfortunately, in most cases this approach did not justify itself. But why not to give that approach the second chance? Technology took a big step forward and theoretically we can get a high-quality product. In this article we’ll review in practice how to develop Library for iOS/Android in Golang and have a look at the problems and constraints faced in the development process.
<!--more-->

Our main task is to develop SDK for log and crash collection from mobile applications. Here SDK have to connect and work with Android and iOS platforms. At the same time the library should interact with the main service – LogPacker that aggregates and analyze data.

We decided to use new opportunities of Golang for cross platform library creation. First of all, our main application is written in Go and it was easier for us to use that lang and not to involve Java/Objective-C developers. Second of all, we saved development time and tried old approach with improved features.
