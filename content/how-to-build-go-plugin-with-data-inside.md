+++
date = "2017-04-04T20:45:14+07:00"
title = "How to build Go plugin with data inside"
tags = [ "Go", "Plugins", "Golang", "go-bindata" ]
type = "post"
+++
Go 1.8 gives us a new tool for creating shared libraries, called plugins! This new plugin buildmode is currently only supported on Linux. But what if we build plugin with data in binary format inside? So we can ship only one `.so` file.

I tried with [go-bindata](https://github.com/jteeuwen/go-bindata) tool.

### Plugin to find a city by http.Request

It's for experimental usage only!

This [project](https://github.com/plutov/go-maxmind-geoip) contains an example with Go plugin which contains free GeoLite2 MaxMind's [database of ip addresses](http://dev.maxmind.com/geoip/geoip2/geolite2/).

It can find City by IP address.

It builds single `go-maxmind-geoip.so` plugin file with already included database with help of `go-bindata`.

### Build plugin

```
go get github.com/oschwald/geoip2-golang
go get github.com/jteeuwen/go-bindata/...
go-bindata -o geoip2-city.go geoip2-city.mmdb
go build -buildmode=plugin -o go-maxmind-geoip.so go-maxmind-geoip.go geoip2-city.go
```

### How to use in Go

Use functions:
```
p, _ := plugin.Open("./go-maxmind-geoip.so")
init, _ := p.Lookup("InitDB")
init.(func() error)()
gc, _ := p.Lookup("GetCity")
city, _ := gc.(func(r *http.Request) (string, error))(r)
```

### Conclusion

It will probably be a while before plugins see much adoption and I currently would not recommend using them in any large project.
