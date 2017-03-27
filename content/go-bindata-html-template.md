+++
date = "2017-03-27T14:26:12+07:00"
tags = ["Go","html/template","go-bindata"]
title = "How to use go-bindata with html/template"
type = "post"
+++
#### What is go-bindata and why do we need it?

[go-bindata](https://github.com/jteeuwen/go-bindata) converts any text or binary file into Go source code, which is useful for embedding data into Go programs. So you can build your whole project into 1 binary file for easier delivery.

#### html/template

[html/template](https://golang.org/pkg/html/template/)'s functions `Parse`, `ParseFiles` works only with files on the filesystem, so we need to implement a port to work with both approaches: files or go-bindata.

Pull [sample code](https://github.com/plutov/go-bindata-tpl) to play with:
```
git clone git@github.com:plutov/go-bindata-tpl.git
```

```
go build && ./go-bindata-tpl

<!DOCTYPE html>
<html lang="en">
<body>
Hello
</body>
</html>
```

#### Generate templates with go-bindata

We need to install go-bindata CLI and generate a .go file from our templates:

```
go get -u github.com/jteeuwen/go-bindata/...
go-bindata -o tpl.go tpl
```

I prefer to add last command to `go:generate`:

```
//go:generate go-bindata -o tpl.go tpl
```

#### Use go-bindata templates

I made it by providing a flag `-go-bindata`:

```
./go-bindata-tpl -go-bindata
<!DOCTYPE html>
<html lang="en">
<body>
Hello
</body>
</html>
```

#### Conclusion

 - With `go-bindata` you can simplify your deployment with only one binary file.
 - `go-bindata` can give you a little faster templates reading.
 - Note that if you use `ParseFiles` you have to change it to work with `Assert` function.
