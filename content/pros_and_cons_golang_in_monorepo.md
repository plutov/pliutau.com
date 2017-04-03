+++
type = "post"
date = "2017-04-03T12:47:55+07:00"
tags = [ "Go", "Golang", "Monorepo", "LogPacker" ]
title = "Pros and Cons: Golang in a Monorepo"
+++
![git-repository-comparison](/git-repository-comparison.png)

Monorepo - is a monolithic code repository which can contain different services (or whatever you want to call them), CLI, libraries, etc. Did you hear that Facebook/Google uses a giant monorepo? And they do it for reasons.

I tried both approaches in Go: with monorepo or with multirepo. And I personally prefer the first one (but of course depending on a project).

### Advantage 1. Simplified organization

A structure of your project is important for organization. The quicker someone can visualize the project as a whole the faster they can contribute. In Golang we are not forced with a folder convention so your team can use their ideals to find a solution. Below is an example from [LogPacker](https://logpacker.com):

```
├──cmd
│  ├──landing
│  │  └──landing.go
│  ├──scheduler
│  │  └──scheduler.go
│  └──userspace
│     └──userspace.go
├──db
│  ├──migrations
├──pkg
│  ├──shared
│  ├──db
│  ├──mailer
│  └──...
├──templates
├──vendor
├──glide.yaml
├──Makefile
├──docker-compose.yaml
└──README.md
```

Layout of the codebase is easily understood, as it is organized in a single tree.

### Advantage 2. Devenv

It's very easy now to get a development environment set up to run builds and tests, you need only clone one repo and use Docker Compose (or whatever you have). Technically it's possible to make it with multiple repositories, but monorepo does a good design work for it.

### Advantage 3. Third party Dependencies

Using a monorepo solves the issue of vendoring third party dependencies. Every service within monorepo uses the same version of a third party library, and whenever the library is upgraded, every project which makes use of it is built and tested automatically. In our example we have common `glide.yaml` for all services.

### Advantage 4. Tooling

Many of the tools in the Go ecosystem work even better when used in a monorepo. For example, `gorename` is incredibly useful. Any changes made will be compiled and tested across all internal services. Also we can have single `Makefile` with targets test, build, run, etc.

### Advantage 5. Productivity increases

The ability to make atomic changes is also a very powerful feature of the monolithic model. A developer can make a major change touching hundreds or thousands of files across the repository in a single consistent operation. For instance, a developer can rename a type or function in a single commit and yet not break any builds or tests.

With a monorepo, you just refactor the API and all of its callers in one commit. That’s not always trivial, but it’s much easier than it would be with lots of small repos.

No switches from one repo to another depending on which part of the codebase you are working on.

### Disadvantage 1. Collaboration across teams

For small organizations it can be an advantage, because all developers work with the same codebase, so collaboration between teams becomes natural. But if monorepo have many commits per day to many different projects, "feature branches" can quickly become out of date. Or developer from one project can easily break some integration part or tests.

### Disadvantage 2. Time

For large codebases, clones, pulls, and pushes take too much time, which is inefficient.

### Disadvantage 3. Ownership

A small team can own and independently develop and deploy the full stack of a microservice if it's hosted is separate repository.

### Conclusion

When it comes to repository hosting discussion, I agree with Google and Facebook: I prefer monolithic repositories. My point isn't that you should definitely switch to a monorepo, it's that using a monorepo isn’t totally unreasonable.

Feel free to disagree or share opinions or thoughts.
