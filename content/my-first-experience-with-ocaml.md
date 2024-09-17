+++
title = "My first experience with OCaml"
date = 2024-09-17T15:00:00+02:00
tags = [ "ocaml", "dune", "functional programming" ]
type = "post"
og_image = "/ocaml-logo.png"
description = "Building my first project in OCaml"
+++

Recently I've been motivated to learn more about functional programming and the name OCaml came up quite a few times. I have seen some praise about it from the people I follow on social media and decided to give it a try. I finally finished a small project in OCaml and would like to share my first impressions while the memory is still fresh.

Please keep in mind that I am relatively new to functional programming and mainly develop in Go nowadays, previously PHP, Python and Javascript. Therefore I will try not to make any conclusions but rather share my perception.

### Resources

I started with the [official documentation](https://ocaml.org/docs), which was enough to get an overview of the language and its type model, install the development tools and compile a small "hello world" application. However as I dove deeper I discovered other resources as well, such as [Real World OCaml](https://dev.realworldocaml.org/), [OCamlverse](https://ocamlverse.net/), [OCaml Operators](https://www.craigfe.io/operator-lookup/) where I could find the information I couldn't find on the official page.

It all gave me a feeling that there is a need for better-structured resources (especially for newcomers), which should probably live on the official website. Ideally with some interactive step-by-step language tour.

### Program

My idea was to build a daemon that receives a Yaml configuration with the list of websites and monitors them concurrently, the results are stored in SQLite database afterward.

```yaml
websites:
  - url: https://ocaml.org
    interval: 20
  - url: https://dune.readthedocs.io/en/stable/
    interval: 10
```

You can find the full source code [here](https://github.com/plutov/websites_monitoring).

### Installing OCaml

OCaml comes with two compilers: one translating sources into native binaries and another turning sources into a bytecode format. It offers a great runtime performance and has always been exceptionally reliable and stable.

To start compiling/running our program we need to install the [opam](https://opam.ocaml.org/) package manager, which also installs the OCaml compiler.

I am using macos, so the commands for me were the following:

```bash
brew install opam
opam init
eval $(opam env)
```

This worked without any issues on my machine, and then I was able to install some platform and build tools, such as [dune](https://dune.build/install) and [utop](https://github.com/ocaml-community/utop).

```bash
opam install dune utop
```

**utop** is an interactive REPL which you can run in your terminal. Honestly, I haven't used it much during the development time and just built my program with **dune**.

When it comes to **dune**, I spent some significant time understanding how it works and battling with different dependencies errors. Generally it felt not intuitive to work with multiple `dune` files spread across your codebase.

```bash
dune init proj websites_monitoring
```

The following command created a project directory which looks similar to this:

```bash
websites_monitoring/
├── dune-project
├── bin
│   ├── dune
│   └── main.ml
├── lib
│   └── dune
├── test
│   ├── dune
│   └── test_websites_monitoring.ml
└── websites_monitoring.opam
```

As you can see there are 3 `dune` files, one `dune-project` file and one `websites_monitoring.opam` file, all of them responsible for building and managing dependencies. It felt like extra work when I had to change **lib** dependencies, I had to add them to both `lib/dune` and `dune-project` files as well as run `dune build @install` which updates `websites_monitoring.opam`.

Once I added some pseudo code it was time to build an executable:

```bash
dune build
[ERROR] No switch is currently set. Please use 'opam switch' to set or install a switch
```

This didn't work for me because there was no default switch installed, even though the documentation say that there should be one. [Switches](https://ocaml.org/docs/opam-switch-introduction) are isolated OCaml environments, similar to Python's `virtualenv`. I didn't dive into this much and just chose some switch from the list of available options:

```bash
opam switch create ocaml-base-compiler
```

Now I was able to compile and run my program, the binary is located in `./_build/install/default/bin/monitoring`.

All in all, it seems that **dune** is an interesting tool, but I also think it needs a better documentation and simplified developer experience.

### Language Syntax and Types

OCaml is type-safe and statically type language, which means it detects type errors at compile time. But what's cool is that there is a type inference, so you do not have to write type information everywhere. The compiler automatically figures out most types. This can make the code easier to read and maintain.

For example in my code I have this function to get a config filename from the environment variable:

```ocaml
let get_config_filename: string =
  try
    let path = Sys.getenv "CONFIG" in
    path
  with Not_found ->
    "./websites.yaml"
```

I could omit `: string` part and compiler still understands that it returns a string:

```ocaml
let get_config_filename =
  (* ... *)
```

There are user-defined types in OCaml such as variants, records and aliases. Here is the example of custom website type that corresponds to the yaml configuration of my program:

```ocaml
type website = {
  url: string;
  interval: int;
}

type websites = {
  websites: website list;
}
```

The language has lots of operators, and it took me some time to understand how they work. This [webpage](https://www.craigfe.io/operator-lookup/) helped me a lot.

### Preprocessors and PPXs

Preprocessors are programs meant to be called at compile time, so that they alter the program before the actual compilation.

In my case they've been really helpful to decode a Yaml file into a custom type after I spent few hours to do the same without them. I used [ppx_deriving_yaml](https://github.com/patricoferris/ppx_deriving_yaml) for that:

```ocaml
type website = {
  url: string;
  interval: int;
} [@@deriving yaml]

type websites = {
  websites: website list;
} [@@deriving yaml]

let get_websites_from_file(config_filename: string) : website list =
  let f = Yaml_unix.of_file Fpath.(v config_filename) in

  let yaml_value = match f with
  | Ok value -> value
  | Error `Msg e -> raise (Invalid_argument ("Unable to open/parse yaml file: " ^ e))
  in

  (* preprocessors are doing the magic of making websites_of_yaml *)
  match websites_of_yaml yaml_value with
  | Ok t ->
    t.websites
  | Error `Msg e -> raise (Invalid_argument ("Invalid config format: " ^ e))

```

### Concurrency & Parallelism

Since I have the list of websites I wanted to process each website concurrently with some interval between runs. I couldn't use `Domains` for that, because the amount of websites could be larger than the amount of cores available.

It seems there are [many libraries](https://ocamlverse.net/content/parallelism.html) to implement concurrency or parallelism in OCaml and it's not obvious what to use. I think that it's the case with OCaml in general, the stdlib is quite minimal and there are many small independent libraries. Which is not an issue maybe, but hard to navigate especially for newcomers.

So I went with [domainslib](https://github.com/ocaml-multicore/domainslib) library:

```ocaml
let rec run_async (website: Config.website) () =
  (* crawl website and store the result in the db *)
  let res = Crawler.crawl_website website in
  Database.insert_website res;

  (* wait for the next interval *)
  let _ = Unix.sleep website.interval in
  run_async website ()

let main () =
  let websites = get_config_filename |> Config.get_websites_from_file in
  Printf.printf "Websites found in config: %d\n" (List.length websites);

  let num_domains = Domain.recommended_domain_count () - 1 in
  Printf.printf "Number of domains/cores: %d\n" num_domains;

  (* create a pool and process each website concurrently *)
  let pool = T.setup_pool ~num_domains:(num_domains) () in
  T.run pool (fun _ ->
    List.iter (fun website ->
      let _ = T.async pool (run_async website) in
      ()
    ) websites
  );
  T.teardown_pool pool;

  print_endline "Exiting..."
```

I actually spent a lot of time battling the `segmentation fault` error because the `crawl_website` function used `cohttp-lwt` under the hood. After I switched crawl_website to be synchronous everything worked well.

It was actually hard to find a library that does synchronous HTTP calls, everything uses LWT or Async.

### Tests

There seem to be different ways of defining your tests, but I went with a simple approach of running the tests manually in let():

```ocaml
open Monitoring

let test_get_websites_from_file () =
  let websites = Config.get_websites_from_file "test_websites.yaml" in
  assert (List.length websites = 2);

  let first = List.hd websites in
  assert (first.url = "https://ocaml.org");
  assert (first.interval = 20)

let () =
  Unix.chdir "../../../test/";
  test_get_websites_from_file ();
```

And then I could run:

```bash
dune runtest
```

### Containerization

`ocaml/opam` Docker image works well and I was able to quickly put my application into a container. I don't plan to deploy this app, so didn't worry much about multi-stage builds for now, just wanted to make sure it works.


```Dockerfile
FROM ocaml/opam:alpine AS init-opam

RUN sudo apk add --update gmp-dev sqlite-dev linux-headers openssl-dev curl-dev libcurl curl

FROM init-opam AS ocaml-app-base
WORKDIR /home/opam/websites_monitoring
COPY . .
RUN opam install . --deps-only
RUN opam install dune
RUN opam exec -- dune build

ENTRYPOINT ["/home/opam/websites_monitoring/_build/install/default/bin/monitoring"]
```

### Conclusion

Will I be confident deploying this program to production? Probably not. But it kinda works. I would like to understand the domainslib better and maybe try few other approaches. And probably run some performance tests.

Was my journey learning OCaml and doing first steps easy? Probably not. I wish the documentation was easily accessible for the newcomers and structured better. Ideally in one place.

But definitely it was enjoyable and I am 100% sure I will be continuing playing with OCaml and maybe publish some libraries.

You can find the full source code [here](https://github.com/plutov/websites_monitoring).

### Resources

- [Discuss this post on OCaml Community Forum](https://discuss.ocaml.org/t/my-first-experience-with-ocaml/15297)
- [Discuss this post on Hacker News](https://news.ycombinator.com/item?id=41568762)
- [Discuss this post on X](https://x.com/pliutau/status/1836067286303617237)
