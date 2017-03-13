+++
date = "2016-11-16T17:07:40+07:00"
title = "Perfect func main()"
tags = [ "Go" ]
type = "post"
+++
It's the only one function all Go commands must have. You may say that everyone's `main()` function is different, depends on a project. But let's think about reusability and testability. `main()` function cannot be tested in a good way, also it cannot be imported and used in another go project. So all you code you put into it isn't reusable/testable.

Instead of having some logic in `main()` function it's better to isolate it in some package and just import it. What your command must have is a correct exit code, and main function is the only one place to have it. Why? Because if you put `os.Exit()` into your packages it can break your package. Developers can import this package and they will be unhappy if theirs tests are interrupted by this call (`os.Exit()` will break test executable).

So let's see how ideal `main()` function looks:
```go
// command docs
package main

import (
    "os"

    "github.com/user/proj/pkg/cli"
)
func main{
    os.Exit(cli.Run())
}
```
