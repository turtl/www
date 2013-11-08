---
title: App | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    App
</div>


# Turtl app

The Turtl app makes the world go round. It's the common piece that all clients
either wrap or use to drive their different parts. 

It's the face of Turtl, letting you add/update notes, boards, personas, and any
other data you can think of. When people think of Turtl, this is what comes to
mind. The rest is icing on the cake.

{{{div.clear}}}

{{{div.doc-sec}}}
### [Architecture](/docs/clients/app/architecture)
Explains the internals of the Turtl app and how it all fits together.

- [Login and join](/docs/clients/app/architecture#login-and-join)
- [Data profile](/docs/clients/app/architecture#data-profile)
- [Controllers](/docs/clients/app/architecture#controllers)
- [Local storage](/docs/clients/app/architecture#local-storage)
{{{/div}}}

{{{div.doc-sec}}}
### [Encryption](/docs/clients/app/encryption)
Covers specifics of encryption, data authentication, serialization, etc.

- [Ciphers and modes](/docs/clients/app/encryption#ciphers-and-modes)
- [Authentication](/docs/clients/app/encryption#authentication)
- [Serialization format](/docs/clients/app/encryption#serialization-format)
- [Protected model](/docs/clients/app/encryption#protected-model)
- [Encrypted messaging](/docs/clients/app/encryption#encrypted-messaging)
{{{/div}}}

<div class="clearMe">&nbsp;</div>

{{{div.doc-sec}}}
### [Local storage/syncing](/docs/clients/app/local_db)
Turtl stores all of your data locally, in encrypted form. This allows
incremental syncing with other devices and also provides a central communication
point for various parts of the client.

- [Local DB](/docs/clients/app/local_db#local-db)
- [Syncing](/docs/clients/app/architecture#local-storage)
{{{/div}}}

{{{div.doc-sec}}}
### [Packaged libraries](/docs/clients/app/libraries)
Explains the internals of the Turtl app and how it all fits together.

- [Cowcrypt](/docs/clients/app/libraries#cowcrypt)
- [Mootools](/docs/clients/app/libraries#mootools)
- [Composer.js](/docs/clients/app/libraries#composer-js)
- [Full list &raquo;](/docs/clients/app/libraries)
{{{/div}}}

<div class="clearMe">&nbsp;</div>

{{{/div}}}

