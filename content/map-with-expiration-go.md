+++
date = "2024-10-02T20:17:12+02:00"
title = "Map with Expiration in Go"
tags = [ "golang" ]
type = "post"
og_image = "/godefault.png"
+++

In some cases your application doesn't need Redis, and internal in-memory map with locks and expiration will suffice.

For example you already know the size of the map and you don't need to store a lot of data. Use cases could be IP rate limiting, or any other short-lived data.

Here is how you can implement this data structure in Go, let's call it a `TTLMap`:

```go
package ttlmap

import (
    "sync"
    "time"
)

// item is a struct that holds the value and the last access time
type item struct {
    value      interface{}
    lastAccess int64
}

// You can have a single map for an application or few maps for different purposes
type TTLMap struct {
    m map[string]*item
    // For safe access to the map
    l sync.Mutex
}

func New(size int, maxTTL int) (m *TTLMap) {
  // map is created with the given length
    m = &TTLMap{m: make(map[string]*item, size)}

    // this goroutine will clean up the map from old items
    go func() {
      // You can adjust this ticker to be more or less frequent
        for now := range time.Tick(time.Second) {
            m.l.Lock()
            for k, v := range m.m {
                if now.Unix()-v.lastAccess > int64(maxTTL) {
                    delete(m.m, k)
                }
            }
            m.l.Unlock()
        }
    }()

    return
}

func (m *TTLMap) Put(k string, v interface{}) {
    m.l.Lock()
    defer m.l.Unlock()

    it, ok := m.m[k]
    if !ok {
        it = &item{
            value: v,
        }
        m.m[k] = it
    }
    it.lastAccess = time.Now().Unix()
}

func (m *TTLMap) Get(k string) (interface{}, bool) {
    m.l.Lock()
    defer m.l.Unlock()
    if it, ok := m.m[k]; ok {
        it.lastAccess = time.Now().Unix()
        return it.value, true
    }

    return nil, false
}

func (m *TTLMap) Delete(k string) {
    m.l.Lock()
    defer m.l.Unlock()
    delete(m.m, k)
}
```

This map is safe for concurrent access, and it will clean up old items every second. You can adjust the frequency of the cleanup by changing the `time.Tick(time.Second)` to a different duration.

Clearly it lacks a lot of features that Redis has, but it's a good starting point for simple use cases. There are only three methods `Put`, `Get`, and `Delete` and no wildcards or other advanced features. So if you need more features, you should consider using Redis or another key-value store.

You can use this map like this:

```go
// 100 items, 10 seconds max TTL
m := ttlmap.New(100, 10)

m.Put("key1", "string value")
v, ok := m.Get("key1") // v == "string value", ok == true

m.Put("key2", 42)

v, ok = m.Get("key3") // v == nil, ok == false
```
