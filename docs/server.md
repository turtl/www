---
layout: documentation
title: 'Running Turtl | Documentation'
permalink: 'docs/server/'
---

<div class="breadcrumb">
<a href="/docs">Documentation</a> &raquo;
Running Turtl
</div>

# Running Turtl
{% include toc.md %}

Turtl's server is written in Common Lisp. It can take a few minutes to set up,
so be sure to read this guide carefully.

## Prerequisites 

Let's go over the software you need to get started.

### Common lisp

Common Lisp is a language, and has many different implementations. Turtl is known
to run fine on either [SBCL](http://www.sbcl.org/) or [CCL](http://ccl.clozure.com/).

I recommend CCL for Windows/OSx and SBCL for linux.

#### Quicklisp

Turtl loads all of its dependencies through the [Quicklisp system](https://www.quicklisp.org/beta/).
So install Quicklisp using your lisp of choice from above.

### RethinkDB

Turtl's data store is [RethinkDB](https://www.rethinkdb.com/), so you'll need to
install that on your server.

Turtl fully manages its own schema and doesn't require any setup beyond getting
RethinkDB created.

### Libuv

The server is evented, and requires that you have [libuv](http://docs.libuv.org/en/v1.x/)
installed on the machine you with to run Turtl.

## Running

Now that you have all the software you need ready to go, download the Turtl API
via git:

~~~
git clone https://github.com/turtl/api.git
~~~

### Config

Go into the `api/` folder, and copy `config/config.default.lisp` to
`config/config.lisp`. Edit `config/config.lisp` using your favorite editor and
update the settings to suit your needs. All the options are fairly well
documented.

### Run it

While still in the `api/` folder, open your chosen lisp and run:

~~~lisp
(load "start")
~~~

If all goes well, Turtl will create the schema it needs and open on port 8181!
You can now point your clients at this port on your server, although it's
recommended to run it behind a proxy like Apache or Nginx.

## Docker containers

Here are a set of community-built docker containers available for running the
Turtl API (no official containers *yet*):

- [ArthurGarnier/turtl-docker](https://github.com/ArthurGarnier/turtl-docker)  
Based on ubuntu + Clozure CL. Includes RethinkDB.
- [celaus/docker-turtl](https://github.com/celaus/docker-turtl)  
Based on archi-mini + SBCL. Requires separate RethinkDB container.


