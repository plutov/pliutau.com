+++
title = "Snake over Telnet in Go"
date = "2017-10-13T16:37:59+07:00"
type = "post"
tags = ["go","telnet"]
+++
Telnet games were very popular some time ago, especially this Star Wars movie: `telnet towel.blinkenlights.nl`.

I wanted to create something in Go, and I wrote this [Snake game over Telnet](https://github.com/plutov/go-snake-telnet).

Go is awesome in this case, no need any dependencies to build this funny stuff.

Try it:

```
telnet pliutau.com 8080
```

![go-snake-telnet](/go-snake-telnet.gif)

### Development

```
go get github.com/plutov/go-snake-telnet
go-snake-telnet --host localhost --port 8080
```

### Contribute

It's open source project, so feel free to contribute - [go-snake-telnet](https://github.com/plutov/go-snake-telnet).
