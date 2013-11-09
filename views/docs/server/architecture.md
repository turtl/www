---
title: Architecture | Server | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/server/index">Server</a> &raquo;
    Architecture
</div>

# Architecture
{{toc}}

The Turtl server has an MVC architecture, driven by the [Wookie](http://wookie.beeets.com)
server written in Common Lisp. Actually it's more of an MC architecture, because
there are no views, just JSON returned.

## RESTy
The server attempts to provide a REST-like interface. There are not "commands"
you run, but resources you access using the `GET`, `PUT`, `POST`, `DELETE` HTTP
verbs.

It's not full REST, there's no [HATEOAS](http://en.wikipedia.org/wiki/HATEOAS).

## MVC
TODO

## Futures
TODO

## Auth
TODO

## Sync
TODO

## RethinkDB
TODO


