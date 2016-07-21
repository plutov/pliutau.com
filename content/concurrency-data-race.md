+++
date = "2016-07-21T07:52:29+07:00"
title = "Concurrency. Data race"
tags = [ "Go", "Concurrency" ]
+++
What does data race mean in Golang? Data race is a common mistake in concurrent systems. A data race occurs when two goroutines access the same variable concurrently and at least one of the accesses is a write. It’s really hard to recognize it without specific tools or without an eagle eye, because when you run a program it’s always a chance that you won’t see your mistake or it will be very transparent.
<!--more-->

#### Example code with data race

Here we have a sum function which is calling is parallel. I added WaitGroup to wait for execution of all goroutines and print a result. As you can see, for 100 sum(1) calls we have always different result (also depends on environment).

```go
package main

import (
	"fmt"
	"sync"
)

var sum int

var wg sync.WaitGroup

func main() {
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go add(1)
	}

	wg.Wait()
	fmt.Println(sum)
}

func add(x int) {
	sum += x
	wg.Done()
}
```

```
go run gdr.go
99
go run gdr.go
97
go run gdr.go
100
```

A problem is that we have a shared variable, which value can be the same for 2 parallel processes.

#### Detect race conditions

Our code is valid, it works correctly, but we must understand that our code is not concurrency-safe. Fortunately, Go is equipped with analysis tool, the race detector. Just add -race flag to your go run/build/test command.

```
go run -race gdr.go
==================
WARNING: DATA RACE
Read by goroutine 7:
  main.add()
     gdr.go:24 +0x30

Previous write by goroutine 6:
  main.add()
     gdr.go:24 +0x4c

Goroutine 7 (running) created at:
  main.main()
     gdr.go:16 +0x6b

Goroutine 6 (finished) created at:
  main.main()
     gdr.go:16 +0x6b
```

#### Use Mutex to fix it

Mutex type from the sync package acquires exclusive lock. If some other goroutine has acquired the lock, this operation will block until the other goroutine calls Unlock.

```go
package main

import (
	"fmt"
	"sync"
)

var sum int

var wg sync.WaitGroup

var m sync.Mutex

func main() {
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go add(1)
	}

	wg.Wait()
	fmt.Println(sum)
}

func add(x int) {
	m.Lock()
	sum += x
	m.Unlock()
	wg.Done()
}
```

Now result is much more predictable.

```
go run gdr.go
100
go run gdr.go
100
go run gdr.go
100

go run -race gdr.go
100
```

P.S. Concurrent programming is tricky, when you are not careful enough :)
