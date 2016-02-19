+++
date = "2016-01-25T13:12:43+07:00"
title = "Supported Go types for gomobile bind"
tags = [ "Go", "gomobile", "Android", "Java"]
+++
![LogPacker](/gotypes.jpg)

#### gomobile bind

With [gomobile](golang.org/x/mobile/cmd/gomobile) we can generate language bindings that make it possible to call Go functions from Java. And it's awesome. Now you can write Android applications in Go (unfortunately without UI features and with pure SDK coverage, but I hope it will grow up from experiment to production-ready tool).
<!--more-->
#### Requirements

* golang 1.5+
* go get golang.org/x/mobile/cmd/gomobile
* gomobile init
* Install [Android SDK](https://developer.android.com/sdk/index.html#Other) to ~/android-sdk-linux
* Install java-jdk

#### Playing with Go code

Let's create some artificial code and try to import it into Java. The following package just returns random user and full Information.

*gomobilebindtest.go*:
```go
package gomobilebindtest

// UserInfo struct
type UserInfo struct {
	Email     string
	Age       int
	Badges    []string
	Rating    float64
	Contacts  map[string]string
	Projects  []UserProject
	CreatedAt uint64
	Params    interface{}
}

// UserProject struct
type UserProject struct {
	Name string
	Link string
}

// GetRandomUser returns random UserInfo
func GetRandomUser() (*UserInfo, error) {
	// Change it to random function :)
	info := &UserInfo{
		Email: "oki@doki.com",
	}

	return info, nil
}
```

It's a valid Go code, but let's try to run a *gomobile bind* with it:
```
ANDROID_HOME="/home/pltvs/android-sdk-linux" gomobile bind .

panic: unsupported seqType: []string(string) / *types.Slice(*types.Basic)
panic: unsupported seqType: map[string]string / *types.Map
panic: unsupported seqType: []gomobilebindtest.UserProject(gomobilebindtest.UserProject) / *types.Slice(*types.Named)
panic: unsupported basic seqType: uint64
panic: unsupported seqType: interface{} / *types.Interface
```

Ugh... it gives me a lot of errors, because not all Go types are supported in bindings. Let's comment these restricted types and run *bind* again:
```go
type UserInfo struct {
	Email string
	Age   int
	//Badges    []string
	Rating float64
	//Contacts  map[string]string
	//Projects  []UserProject
	//CreatedAt uint64
	//Params interface{}
}
```

Success! Here is a list of currently supported types (got it from [golang.org/x/mobile/cmd/gobind](https://godoc.org/golang.org/x/mobile/cmd/gobind)):

* Signed integer and floating point types.
* String and boolean types.
* Byte slice types. Note the current implementation does not support data mutation of slices passed in as function arguments.
* Any function type all of whose parameters and results have supported types. Functions must return either no results, one result, or two results where the type of the second is the built-in 'error' type.
* Any interface type, all of whose exported methods have supported function types.
* Any struct type, all of whose exported methods have supported function types and all of whose exported fields have supported types.

It gives us some limitations to use Go in Android, to use Go packages. But anyway it's a nice start. Later I will make an article with real working Android app with Go packages.
