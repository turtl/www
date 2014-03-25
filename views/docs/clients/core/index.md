---
title: Core | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    Core
</div>


# Turtl core

The Turtl core makes the world go round. It's the common piece that all clients
either wrap or use to drive their different parts. 

It's the face of Turtl, letting you add/update notes, boards, personas, and any
other data you can think of. When people think of Turtl, this is what comes to
mind. The rest is icing on the cake.

{{{div.clear}}}

{{{div.doc-sec}}}
### [Architecture](/docs/clients/core/architecture)
Explains the internals of the Turtl core and how it all fits together.

- [Login and join](/docs/clients/core/architecture#login-and-join)
- [Data profile](/docs/clients/core/architecture#data-profile)
- [Controllers](/docs/clients/core/architecture#controllers)
- [Local storage](/docs/clients/core/architecture#local-storage)
{{{/div}}}

{{{div.doc-sec}}}
### [Encryption](/docs/clients/core/encryption)
Covers specifics of encryption, data authentication, serialization, etc.

- [Ciphers and modes](/docs/clients/core/encryption#ciphers-and-modes)
- [Authentication](/docs/clients/core/encryption#authentication)
- [Serialization format](/docs/clients/core/encryption#serialization-format)
- [Protected model](/docs/clients/core/encryption#protected-model)
- [Encrypted messaging](/docs/clients/core/encryption#encrypted-messaging)
{{{/div}}}

<div class="clearMe">&nbsp;</div>

{{{div.doc-sec}}}
### [Local storage/syncing](/docs/clients/core/local_db)
Turtl stores all of your data locally, in encrypted form. This allows
incremental syncing with other devices and also provides a central communication
point for various parts of the client.

- [Local DB](/docs/clients/core/local_db#local-db)
- [Syncing](/docs/clients/core/local_db#syncing)
- [File storage](/docs/clients/core/local_db#file-storage)
{{{/div}}}

{{{div.doc-sec}}}
### [Packaged libraries](/docs/clients/core/libraries)
Explains the internals of the Turtl core and how it all fits together.

- [SJCL](/docs/clients/core/libraries#sjcl)
- [Mootools](/docs/clients/core/libraries#mootools)
- [Composer.js](/docs/clients/core/libraries#composer-js)
- [Full list &raquo;](/docs/clients/core/libraries)
{{{/div}}}

<div class="clearMe">&nbsp;</div>

{{{/div}}}

## Running as a web app
The core was initially set up as a webapp for easy testing, and can still be run
as one. Once you are able to [get the Turtl server running](/docs/server/running),
just browse to the homepage of the host/port the server is running on and you'll
be using the Turtl core web app.

This provides all the functionality of Turtl without the added security of
packaged code. If you use the core web app, please do not serve it publicly as
doing so poses many security threats. It's for testing only.

