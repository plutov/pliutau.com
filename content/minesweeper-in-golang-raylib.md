+++
date = 2025-02-28T20:00:00+01:00
title = "Minesweeper with Raylib Go Bindings"
tags = [ "go", "golang", "raylib" ]
type = "post"
og_image = "/mineesweeper.jpeg"
description = "A brief post on building a classic Minesweeper game in Go using raylib-go"
+++

I remember when I was in school and didn't have yet a PC at home (probably year ~2000), I would visit my Mom's office to play some videogames on her work PC :) It was some Pentium and didn't have many games in the beginning, but Minesweeper was always there as it came with Windows installation. Great times btw!

![Minesweeper](/mineesweeper.jpeg)

I never been a game developer and know little about it, except some simple 2D games in the terminal or browser. So tools like Unity don't inspire me, it's too big. But what about [Raylib](https://www.raylib.com/)? It's a small (relatively) C library for videogames programming that I find quite fun to work with.

And it has bindings in many languages if you don't want to work with C directly. For Go there is a [raylib-go](https://github.com/gen2brain/raylib-go) that exposes the Raylib bindings. It also comes with the bindings for [raygui](https://pkg.go.dev/github.com/gen2brain/raylib-go/raygui). That should be more than enough to build the Minesweeper game and have some fun.

On MacOS there is nothing extra that needs to be installed, just latest Go and we can get going.

```
go get -v -u github.com/gen2brain/raylib-go/raylib
go get -v -u github.com/gen2brain/raylib-go/raygui
```

We can use then `raygui` to draw common elements like buttons, sliders, text. And `raylib` for collision detection (though there is not much of that in Minesweeper). We could also usee images for assets to draw mines and UI elements, but I decided to have a first version without that. Funny enough, I almost forgot the rules, but it took just a few minutes to be back in 2000s.

Each game has a state, our state can be easy as:

```go
type state struct {
    menu      bool // is menu open
    gameOver  bool
    gameWon   bool
    startedAt time.Time // simple metrics
    rows      int32
    cols      int32
    mines     int32
    field     [][]point // initial state will be generated
}

type point struct {
    hasMine    bool
    open       bool
    marked     bool
    neighbours int
}
```

When we open the game for the first time, we see the menu to select the difficulty, which has some presets of rows and columns as well as sliders. There we use `raygui` for these UI elements. And we use `raylib` to configure the app window itself.

```go
package main

import (
    gui "github.com/gen2brain/raylib-go/raygui"
    rl "github.com/gen2brain/raylib-go/raylib"
)

func (s *state) drawMenu() {
    // set window size and center it
    rl.SetWindowSize(w, h)
    rl.SetWindowPosition((rl.GetMonitorWidth(0)-int(w))/2, (rl.GetMonitorHeight(0)-int(h))/2)

    // raygui.Button can be used with a callback function quite nicely!
    if clicked := gui.Button(rl.NewRectangle(padding, rowh, buttonWidth, size), "BEGINNER"); clicked {
        s.rows = 9
        s.cols = 9
        s.mines = 10
    }


    // ...
}
```

You play Minesweeper with mouse (not sure how Vim users do that), and you need to detect left and right clicks. The left click we detected using the `raygui.Button` callback, for the right click we can use raylib's main API:

```go
// Mark on right mouse button
if rl.IsMouseButtonPressed(rl.MouseButtonRight) {
    if rl.CheckCollisionPointRec(rl.GetMousePosition(), rect) {
        if !s.field[x][y].open {
            s.field[x][y].marked = !s.field[x][y].marked
        }
    }
}
```

There is more code obviously (not that much, 300 lines in total), and you can find it on my [GitHub](https://github.com/plutov/packagemain/blob/master/minesweeper/main.go).

You can build it using standard Go's build toolchain and play right after it.

```
go run main.go
```

In probably 1 hour of this "recreational" programming I was able to play my Minesweeper and it worked really well. Yes, some visuals been missing, but the gameplay felt exactly as in 2000s. My wife enjoyed it the most, she played for a few hours straight :)

`Raylib` kept its promise and was exactly fun and easy to work with. I will definitely try something else with it, probably from Zig.

### Some resources

- [Source code](https://github.com/plutov/packagemain/blob/master/minesweeper/main.go)
- [raylib-go](https://github.com/gen2brain/raylib-go)

Have you built anything with `raylib` and/or `raylib-go`? 
