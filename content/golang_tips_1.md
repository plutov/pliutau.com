+++
date = "2017-03-23T12:40:02+07:00"
tags = [ "Go" ]
title = "Golang tips. Part 1"
+++
Go is a simple and fun language, and as any other language, Go has a lot of unspoken tips.

Every single day I'm working with Go, participating in discussions and sharing it with my blog readers. And constantly I'm rethinking my approaches, patterns, etc. I started to collect these small tips is a text file, usually they don't deserve separate blog post, so I will post them together from time to time if I have 10 of them.

It may seem obvious if you took the time to learn the official spec, wiki, mailing list discussions, etc. Or maybe it's not, so please ask in comments.

### Golang tips. Part 1

1. Log an error or return it, don't do both.
2. `defer` is slow.
3. Use `iota` in constants if the value doesn't matter.
4. It is not required to close an unused channel. If no goroutine is left referencing the channel, it will be garbage collected. It is only necessary to close a channel if the receiver is looking for a close.
5. Consider structuring your program so that only one goroutine at a time is responsible for a particular piece of data.
6. Always run your tests with race detector.
7. Use `%+v` to print the error with sufficient detail.
8. Declare type's methods on *T.
9. Go maps are not goroutine safe, you must use a sync.Mutex, sync.RWMutex to ensure reads and writes are properly synchronised.
10. Channel axioms: a send to a nil channel blocks forever, a receive from a nil channel blocks forever, a send to a closed channel panics, a receive from a closed channel returns the zero value immediately.
