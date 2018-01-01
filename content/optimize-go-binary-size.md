+++
date = "2016-03-01T10:18:54+07:00"
title = "Optimize Go binary size"
tags = [ "Go", "ldflags" ]
type = "post"
+++

#### ~21MB

Well, I found yesterday that [LogPacker](https://logpacker.com) Daemon weights about 21MB. This application is written in Go language, it's really doing a lot of things, has built-in connectors to different Data-Storages, has Cluster solution inside, etc.

Some people are complaining about huge size of Go compiled binaries. But it makes sence, Go includes debugging information into binary for GDB.

```
go build logpacker_daemon.go && du -h logpacker_daemon
21M	logpacker_daemon
```

#### ~15MB

We distribute this binary to our customers, and they do not need to debug this tool, so I decided to turn off it.

Omit the DWARF symbol table during the build process:

```
go build -ldflags="-w"
```

The -s ldflag will omit the symbol table and debugging information when building your executable:

```
go build -ldflags="-s"
```

Result:
```
go build -ldflags="-w -s" logpacker_daemon.go && du -h logpacker_daemon
15M	logpacker_daemon
```

#### Conclusion

This optimization doesn't affect program, so feel free to use it in production if you you don’t intend on using the debug symbols.
