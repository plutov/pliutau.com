+++
date = 2025-02-06T22:00:00+02:00
title = "My first Zig program - zigping"
tags = [ "zig", "tui", "terminal" ]
type = "post"
og_image = "/zigping.png"
description = "A brief note on my first experience with Zig"
+++

For me the best way to learn something new is to actually build something with it. Yes, there is some hype around Zig nowadays (Ghostty, Bun are build in Zig), but don't listen to it, go try it out and see for yourself if it solves your problem or not.

So, after briefly exploring the language features of Zig, I decided to tackle a small project.

I love TUIs and decided to build a program similar to famous [gping](https://github.com/orf/gping). Why? I think it's a good learning ground as it means we have to work with network, threads, terminal, etc. I called it [zigping](https://github.com/plutov/zigping) :)

Small note: I am coming from Go, where the memory is managed and the garbage collector handles allocation and deallocation automatically. But not in Zig!

![zigping](/zigping.png)

## Setting up the dev environment

I code in both Zed and Neovim, and it's very straightforward to setup [Zig LSP called ZLS](https://zigtools.org/zls/install/). Go to definitions/declarations work great right out of the box.

## Build System

Ok, here I spent some time... For example, adding dependencies in Zig is not as simple as `go get` or `yarn add`, you have to fetch them manually first, then configure them in your `build.zig` file.

But on the other hand, this concept is really neat, so you can write your regular Zig code to package your program.

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{
        .preferred_optimize_mode = .ReleaseFast,
    });

    // dependencies
    const vaxis_dep = b.dependency("vaxis", .{
        .target = target,
        .optimize = optimize,
    });

    // executable
    const exe = b.addExecutable(.{
        .name = "zigping",
        .root_source_file = b.path("src/ping.zig"),
        .target = target,
        .optimize = optimize,
    });
    exe.root_module.addImport("vaxis", vaxis_dep.module("vaxis"));

    b.installArtifact(exe);

    const run_cmd = b.addRunArtifact(exe);
    run_cmd.step.dependOn(b.getInstallStep());
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);
}
```

Build times depend on your program, but it felt a bit slow, also in `ReleaseFast` mode.

Zig's compiler was working really great and it's easy to understand the errors, especially helpful when you come from other languages.

## Standard Library

I love not bloated standard libraries, and Zig has the basics covered there: ArrayList, Threads, file system... On the other hand, it feels like there are not much battle-tested external dependencies, but they will come with time for sure.

I want to mention a great library [libvaxis](https://github.com/rockorager/libvaxis) which I used in this project to render the terminal view.

## Multithreading

It's generally hard to write a program that works with threads and build a robust strategy to control them. I used atomics to notify the threads and stop them gracefully for example.

```zig
// caller
var crawler_running = std.atomic.Value(bool).init(true);
// stop the thread and wait for it to finish
crawler_running.store(false, .release);
crawler_thread.join();

// inside the thread
while (running.load(.monotonic)) {
  // crawl domains
}
```

## Error Handling

After years of writing Go, I got used to `if err := func(); err != nil { ...` construct and I'm a admirer or it. And you can do a very similar handling in Zig, plus there is a nice use of `try/catch`.

You can simply use `try` if your function can return an error:

```zig
var req = try client.open(.GET, uri, .{ });
defer req.deinit();
try req.send();
```

Or you can use `catch` to handle an error or even to assign a fallback value!

```zig
const result = self.crawl(self.allocator, hostname) catch blk: {
    const empty_res: CrawlResult = .{
        .success = false,
        .hostname = _hostname,
        .latency_ms = 0,
        .status_code = std.http.Status.internal_server_error,
    };
    break :blk empty_res;
};
```

## Memory Management

If you're coming from Go as I do or from other languages where the memory is managed for you, you will spend some time understanding the memory allocation, how to free the memory, how to avoid memory leaks, etc. But it was a great exercise as I learned a lot while writing my program.

For example, I managed to make my program work, but when I exit I always had this nasty Segmentation Fault which was extremely hard to debug.

I used a single `std.heap.GeneralPurposeAllocator` throughout the codebase, but you need to pay attention to what you're putting to memory and how to clean it up and when.

## Enums, Switch

Just look, beautiful!

```zig
pub const Event = union(enum) {
    winsize: vaxis.Winsize,
    key_press: vaxis.Key,
    crawl_results: []const crawler.CrawlResult,
};

pub fn update(self: *App, event: Event) !void {
    switch (event) {
        .key_press => |key| {
            // would be cleaner with ||...
            if (key.matches('c', .{ .ctrl = true })) {
                self.should_quit = true;
                return;
            }
            if (key.matches('q', .{})) {
                self.should_quit = true;
                return;
            }
        },
        .winsize => |ws| {
            try self.vx.resize(self.allocator, self.tty.anyWriter(), ws);
        },
        .crawl_results => |results| {
            try self.ts.addResults(results);
        },
    }
}
```

## Type system

Zig is good at inferring the types automatically, so you don't have to always write them down. Also it comes with many handy functions in standard library to cast some common types.

## Syntax

Nothing to complain about, but required semicolons?

Ah, and also, no chained conditionals?

```zig
// you can't write that
if (a > 0 && b > 0) {}

// this is ok
if (a > 0) {
    if (b > 0) {

    }
}
```

## Resources

Here are few resources that helped me greately.

- [zig.guide](https://zig.guide/)
- [ziggit.dev](https://ziggit.dev/)

The full source code of [zigping is here](https://github.com/plutov/zigping).

## Conclusion

I didn't write everything I experienced, and maybe forgot something, so will probably come out with another post later.

Zig is hard but worth it. Go try it out and see for yourself if you like it or not, if it solves your problem or not.
