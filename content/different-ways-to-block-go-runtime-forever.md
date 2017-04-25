+++
date = "2017-04-24T20:39:13+07:00"
title = "Different ways to block Go runtime forever"
tags = [ "Go", "Golang", "experiment" ]
type = "post"
+++

The current design of Go's runtime assumes that the programmer is responsible for detecting when to terminate a goroutine and when to terminate the program. A program can be terminated in a normal way by calling `os.Exit` or by returning from the `main()` function. There are a lot of ways of blocking runtime forever, I will show all of them for better understanding of blocking in Go.

### 1. Using sync.WaitGroup

Wait blocks until the WaitGroup counter is zero.

```
package main

import "sync"

func main() {
    var wg sync.WaitGroup
    wg.Add(1)
    wg.Wait()
}
```

### 2. Empty select

An empty `select{}` statement blocks indefinitely i.e. forever. It is similar and in practice equivalent to an empty `for{}` statement.

```
package main

func main() {
    select{}
}
```

### 3. Infinite loop

The easiest way which will use 100% of CPU.

```
package main

func main() {
    for {}
}
```

### 4. Using sync.Mutex

If the lock is already in use, the calling goroutine blocks until the mutex is available.

```
package main

import "sync"

func main() {
    var m sync.Mutex
	m.Lock()
    m.Lock()
}
```

### 5. Empty Channel

Empty channels will block until there is something to receive.

```
package main

func main() {
	c := make(chan struct{})
    <-c
}
```

### 6. Nil Channel

Works for channels created without `make`.

```
package main

func main() {
	var c chan struct
    <-c
}
```

### Conclusion

I have found 6 ways to block a Go program. It can be useful when you start multiple goroutines in a `main()` function and don't want to terminate a whole program after that. But some of these examples are just for fun.

If you know another way - please share it in comments, I will add it here.
