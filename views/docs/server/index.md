---
title: Server | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    Server
</div>

# Turtl server

The server is what every client connects to in order to update data and sync the
local profile with other clients and devices.

The server is built in Common Lisp using an evented architecture.

{{{div.clear}}}

{{{div.doc-sec}}}
### [Architecture](/docs/server/architecture)
This gives an overview of the way the server is put together and how it works.

- [RESTy](/docs/server/architecture#resty)
- [MVC](/docs/server/architecture#mvc)
- [Futures](/docs/server/architecture#futures)
- [Auth](/docs/server/architecture#auth)
- [Full list &raquo;](/docs/server/architecture)
{{{/div}}}

{{{div.doc-sec}}}
### [API documentation](/docs/server/api/index)
Lists the resources accessible via the API and how to retrieve and update them.

- [Users](/docs/server/api/users)
- [Boards](/docs/server/api/boards)
- [Notes](/docs/server/api/notes)
- [Invites](/docs/server/api/invites)
- [Full list &raquo;](/docs/server/api/index)
{{{/div}}}

<div class="clearMe"></div>

{{{div.doc-sec}}}
### [Running Turtl](/docs/server/api/running)
Covers how to run your own Turtl server! This is useful if you do not with to
use the primary Turtl service or you want an environment to test on.

- [Common Lisp](/docs/server/api/running#common-lisp)
- [Quicklisp](/docs/server/api/running#quicklisp)
- [Git libraries](/docs/server/api/running#git-libraries)
- [Configuration](/docs/server/api/running#configuration)
- [Starting](/docs/server/api/running#starting)
{{{/div}}}

{{{/div}}}

