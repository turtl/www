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
organization, your friends, or your family.

It has one hard external library requirement: [Libevent 2.0.x](http://libevent.org/).
This should be in the default packaging repo for most \*nix systems, or can be
compiled on Windows with [MSYS](http://www.mingw.org/wiki/MSYS)/[Mingw](http://www.mingw.org/).

## Common Lisp
The Turtl server runs on Common Lisp. It was primarily developed on [Clozure CL](http://ccl.clozure.com/),
but [SBCL](http://www.sbcl.org/) may also be used as well (although not as
extensively tested).

Common Lisp was chosen because it's awesome. It compiles to machine code,
supports native threading, allows calling out to C with the flick of your
wrist. Best of all, lets you write code that writes code that writes...

It has made developing the server fast and easy.

## Quicklisp
The server loads many of its components via [Quicklisp](http://www.quicklisp.org/beta/),
which is a package manager for Common Lisp (built on top of its packaging system
ASDF) that makes running lisp software about ten million times easier. It's not
required to run the server, but will make your life a lot easier and this guide
assumes you have it.

### Libraries not in Quicklisp
There are some libraries the server uses that are not yet added to Quicklisp.
Also, while these libraries may find their way into Quicklisp soon enough, it's
much better to __use the latest git versions__:

- [Wookie](https://github.com/orthecreedence/wookie)
- [http-parse](https://github.com/orthecreedence/http-parse)
- [cl-rethinkdb](https://github.com/orthecreedence/cl-rethinkdb)

When you install Quicklisp for your implementation, you'll have a new folder in
your home directory called `quicklisp`. Navigate to `~/quicklisp/local-projects/`
and `git clone` the projects listed above into that folder. This tells Quicklisp
that you want it to use those specific versions over the ones it has in its
index.

## Getting the Turtl source
The latest version of the Turtl server can be found on Github: [github.com/turtl/api](https://github.com/turtl/api).

By default, the Turtl server tries to load the webapp version of Turtl ([core](/docs/clients/core/index))
when it starts. This can be nice if you're running Turtl internally and need to
load it up in a browser, but is a Terrible Idea &trade; if you're running the
server publicly. In general, you *never, ever* want to serve code dynamically
that does crypto. This is why Turtl is only officially provided in packaged app
form.

So not only will you want to grab the `api` project, you'll also want the core
(named `js` on Github) to live next to it:

```bash
mkdir /path/to/turtl
cd /path/to/turtl
git clone https://github.com/turtl/api.git
git clone https://github.com/turtl/js.git
```

## Configuration
Before running the server, you need to configure a handful of things.

The main configuration for the server lives in `config/config.default.lisp`.
You'll need to copy this file to `config/config.lisp` and change any values to
match your environment.

The variables are all self-documenting and the default values will give a good
picture of how you to use them.

## Database (RethinkDB)
As mentioned in the [server architecture docs](/docs/server/architecture), the
Turtl server uses [RethinkDB](http://rethinkdb.com/) as its primary data store.
You'll want to have this installed and running and change the `*db-host*` value
in `config/config.lisp` to point to your RethinkDB instance.

Note that the schema is managed *entirely* by the Turtl server. It manages
schema upgrades/downgrades and applying the initial schema to the database, so
all you have to do is configure the server to point at the correct location,
start the Turtl server, and kick back.

Turtl is set up to use RethinkDB __v1.11.3__. Versions before this will almost
certainly not work, versions after *may* work. So if you're trying to run Turtl,
be sure to compile RethinkDB from the v1.11.3 tag on their Github.

## Starting
Starting the server is as easy as starting your lisp implemenation in the
server's root directory and doing the following:

```lisp
(ql:quickload :turtl)
;; ...loading blah blah...
(turtl:start :port 6969)
;; &lt;INFO&gt; [18:57:14] turtl init.lisp (start) - Applying DB schema...
;; &lt;INFO&gt; [18:57:14] turtl init.lisp (start) - Schema applied: (:TABLES-ADD NIL :INDEXES NIL)
;; &lt;INFO&gt; [18:57:14] wookie listener.lisp (start-server listener) - (start) Starting Wookie  0.0.0.0:6969
```

Bada boom, your own Turtl server. You can now build your client to point to
`http://your-server:6969/api`. Also, if you have the webapp version of Turtl
enabled, you can navigate your *modern* browser to `http://your-server:6969` and
you'll be able to use Turtl from your browser. As mentioned, please don't use
the web version of Turtl on a public-facing server.

If you have any issues/errors/problems running the server, please feel free to
[get in touch](/contact).

