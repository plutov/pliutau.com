+++
type = "post"
date = "2017-04-19T20:32:35+07:00"
tags = [ "Go", "Golang", "practice-go" ]
title = "Practice Go: Web Scraping"

+++

[Create a Pull Request for this exercise](https://github.com/plutov/practice-go/tree/master/webscraping)

### Web Scraping

Create a function that finds the time from this [http://tycho.usno.navy.mil/cgi-bin/timer.pl](URL) and then prints it by extracting the time by timezone code.

### Examples

```
//Apr. 19, 12:59:44 UTC
GetTime("UTC")
```

### Run tests with benchmarks

```
go test -bench .
```
