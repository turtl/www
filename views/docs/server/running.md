---
title: Running Turtl | Server | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/server/index">Server</a> &raquo;
    Running
</div>

# Running Turtl
{{toc}}

Running your own server allows creating a private Turtl network for your
company, your friends, or your family.

## Common Lisp
The Turtl server runs on Common Lisp. It was primarily developed on [Clozure CL](http://ccl.clozure.com/),
but [SBCL](http://www.sbcl.org/) may also be used as well (although not as
extensively tested).

Common Lisp was chosen because it's awesome. It compiles to machine code,
supports native threading, allows calling out to C with the flick of your
wrist. Best of all, lets you write code that writes code that writes...

It has made developing the server fast and easy.

## Quicklisp
The server loads many of its components via [Quicklisp](http://www.quicklisp.org/beta/).
It's not required to run the server, but will make your life a lot easier.

### Libraries not in Quicklisp
There are some libraries the server uses that are not yet added to quicklisp.
Also, while these libraries may find their way into Quicklisp son enough, it's
much better to use the latest git versions:

- [Wookie](https://github.com/orthcreedence/wookie)
- [cl-rethinkdb](https://github.com/orthcreedence/cl-rethinkdb)

## Configuration
The main configuration for the server lives in `config/config.lisp.default`.
Before running you need to copy this file to `config/config.lisp` and change any
values to match your environment.

The variables are all self-documenting and the default values will give a good
picture of how you to use them.

Note that while getting to know the server, it can be useful to set the logging
level (the `*log-level*` var) to either `:info` or `:debug`. This makes the app
(and Wookie) spit out a lot more info about what's going on.

## Starting
Starting the server is as easy as starting your lisp implemenation in the
server's directory and doing the following:

```lisp
(ql:quickload :turtl)
;; ...loading blah blah...
(turtl:start :port 6969)
```

Bada boom, your own Turtl server. If you have any issues/errors/problems running
the server, please feel free to [get in touch](/contact).

