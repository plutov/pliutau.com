+++
title: "Handle HTTP Request Errors in Go"
date: 2017-10-05T08:36:05+07:00
type = "post"
tags = ["go"]
+++
In this short post I want to discuss handling HTTP request errors in Go. I see people write code and they believe to be handling errors when making HTTP requests, but actually they are missing real errors.

Here is an example of simple http server and GET request to itself.

```
package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/500", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(500)
		w.Write([]byte("NOT-OK"))
	})
	go http.ListenAndServe(":8080", nil)

	_, err := http.Get("http://localhost:8080/500")
	if err != nil {
		log.Fatal(err)
	}
}
```

It's a simple code: we are starting a server, then we make a request to this server. It returns 500 response code, we check returned `err` value, but...

```
if err != nil {
	log.Fatal(err)
}
```

If we run this code we will not catch error. As official [documentation](https://golang.org/pkg/net/http/#Client.Get) says:

> An error is returned if the Client's CheckRedirect function fails or if there was an HTTP protocol error. A non-2xx response **doesn't** cause an error.

So what we should always do, check response code together with an error:

```
resp, err := http.Get("http://localhost:8080/500")
if err != nil {
	log.Fatal(err)
}
if resp.StatusCode != 200 {
	b, _ := ioutil.ReadAll(resp.Body)
	log.Fatal(string(b))
}
```

Now, if we run our code it will log response body in case of non-200 response code. It's an easy mistake to make. But now you know, and it's half the battle!
