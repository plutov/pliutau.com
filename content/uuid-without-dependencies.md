+++
date = "2016-08-26T14:17:34+07:00"
title = "UUID without dependencies in Go"
tags = [ "golang", "glide" ]
type = "post"
+++

Today I realized that size of my `vendor/` folder in Golang project is around 150M. I am using `glide` there. There are 24 dependencies (it's a program with multiple data storage connectors, notifications, etc.), so I decided to review it and reduce amount of 3rd party libraries.

First of all I have checked `glide-report` and removed 2 unused packages. Go-world has a lot of packages that are awesome and can save your time, but not your program's performance. I found few packages which I am using as helpers. For example [gouuid](https://github.com/nu7hatch/gouuid).


What's happaned when you run `glide get`?

 - `go build` execution time will be increased
 - `go run` execution time will be increased
 - `vendor/` folder size will be increased


So I decided to remove `gouuid` and use `crypto/rand`:
```
package main

import (
	"crypto/rand"
	"fmt"
)

func main() {
	fmt.Println(uuid())
	fmt.Println(uuid())
	fmt.Println(uuid())
}

func uuid() (string, error) {
	b := make([]byte, 16)
	_, err := rand.Read(b)

	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%X-%X-%X-%X-%X", b[0:4], b[4:6], b[6:8], b[8:10], b[10:]), nil
}
```

Let's run it:
```bash
go run test.go
2E395F0E-F422-1BD1-608F-C686D39A7DA1 <nil>
1C692140-0E15-8BCD-0738-1583115216A5 <nil>
652ED449-5085-BB13-0905-C5BD859E18A2 <nil>
```

I am satisfied of this result, though it's a pseudo-uuid. Also benchmark result of this solution wins 3rd party dependency.

Think twice before `go get`!
