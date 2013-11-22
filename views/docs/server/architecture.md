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

It's not full REST as there's no [HATEOAS](http://en.wikipedia.org/wiki/HATEOAS).
While we'd love to appease die-hard RESTafarians, we don't think it's worth the
effort when the clients know all the endpoints anyway.

## MVC
The server's controllers are loaded directly by the `turtl.asd` file, and
provide all the routes for the API. The controllers are responsible for grabbing
data from the requests, sending it into models for processing, and sending a
response back to the client.

The models, also loaded by the `turtl.asd` file, provide all the data
processing. They communicate with the database and external services (email,
analytics, etc).

## Futures
The server makes *extensive* use of [cl-async's futures](http://orthecreedence.github.io/cl-async/future)
to make its async nature suck a bit less than just using raw continuation
passing style.

The futures implementation also allows for easy/abstracted error handling, which
cuts back on unhandled errors while running the Turtl server.

Most of futures are macro-based, and the server builds more macros on top of
them, eliminating a lot of boilerplate code and making the server code a lot
more readable in general.

## Auth
The API performs authentication in Wookie's `:pre-route` hook. This allows the
server to check the given user authentication *before* running the route
associated with the request. This allows the API to reject a request and send
back a "Nope!" response before wasting time loading/running the route.

Authentication information is passed on each request. There's no session at all.
It all happens in the `controllers/app.lisp` file.

### Public actions
Note that there are some resources that do not require auth which are listed in
`config/config.lisp` under the `*public-actions*` variable.

## Sync
The API tracks all user profile data changes in a central table in the database
(called "sync"). This table stores the action (add, edit, delete), the item ID
the action occured on, the item type (note, board, persona, ...) and the ID of
the user performing the action.

This allows the client to specifically track what items have changed since the
last sync (which is specified as a sync ID, as opposed to a timestamp).

Note that the sync table doesn't actually store diffs. If it did, it would store
encrypted diffs, allowing very granular data changes. This may happen in the
future, but for now the whole object is synced when being pulled from the sync
table.

Note that there is a central function: `link-sync-items`. This function lives in
the `models/sync.lisp` file. It takes a collection of sync records and pulls out
the corresponding objects from their respective tables, formatting the items in
the standard format as it goes along.

## RethinkDB
The server uses RethinkDB as its primary database. RethinkDB was chosen for its
ease of replication and scalability and its excellent query language. Its
distributed nature is an ops wet dream.

The server uses the Common Lisp [cl-rethinkdb driver](https://github.com/orthecreedence/cl-rethinkdb),
an async driver (built by Andrew Lyon, a Turtl co-author).

## Analytics
Turtl is set up to be fully anonymous (with the exception of personas and
sharing). However, the API tracks anonymous analytics and certain metadata
(the NSA kind of ruined that word, we know) about certain actions. Analytics are
currently saved to the Mixpanel service. Here are some examples of the calls
made to Mixpanel:

```javascript
// note add
{event: "note-add", properties: {shared: true}}

// board edit
{event: "board-edit"}

// user join
{event: "user-join"}
```

No other data is sent. Not the user's IP, not the user's auth or ID, not any
identifying information whatsoever. Just the action that occured and specific
metadata associated with it.

