+++
date = "2017-02-22T20:21:15+07:00"
title = "playgo - CLI tool to send .go file to the Go Playground"
tags = [ "Go", "Golang", "Open Source" ]
type = "post"
+++
Usually when we share a runnable Go code we do: copy code, open [Go Playground](https://play.golang.org/), paste code, click Share.

So `playgo` does it for you.

### Installation and Usage

```
go get -u github.com/plutov/playgo/cmd/playgo
playgo helloworld.go
https://play.golang.org/p/v3rrZLwEUC
```

I'm waiting for pull requests or issues if it's interesting for you or you've found some bug.

[Project on GitHub](https://github.com/plutov/playgo)
