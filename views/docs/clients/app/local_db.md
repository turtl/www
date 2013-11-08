---
title: Local storage/syncing | App | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    <a href="/docs/clients/app/index">App</a> &raquo;
    Local storage/syncing
</div>

# Local storage/syncing
{{toc}}

Turtl mirrors the user's profile in the client's local database. Currently in
all cases, this is IndexedDB, a local database that now ships with all browsers
that matter.

Turtl uses this database not only as a place to store the profile, but as a
syncing point between different pieces of the app. For instance the extensions
use the local DB to know when data has changed, and sync those changes to their
background pages. Read more on [how extensions use the local DB](/docs/clients/extensions/index#architecture).

## Local DB
The local DB (IndexedDB to outsiders, but referred to as the "local DB" in case
the storage mechanism is switched down the road) is used as a place to store
the user's profile and also as a central syncing point.

All data changes flow through the local DB. An in-memory model doesn't get saved
to the API without first saving itself to the local DB, and vice versa, if a
note is changed by another user and the change is synced to the app, the change
goes through the local DB before being picked up by the in-memory model that
corresponds to the note.

The local DB only stores encrypted profile data (the only time anything is
decrypted is in-memory) and persists the profile across app loads. While this
gives us a performance boost while starting the app (no need to download the
entire profile on each login), it also allows us some other significant
advantages:

- A central sync point (see [syncing](#syncing) below).
- Ability to load/decrypt specific pieces of the profile, as opposed to
  decrypting the whole thing and holding it in memory. Note: the app currently
  *does* hold the entire profile in memory, but this is mainly vestigial and
  will probably load in data board-by-board soon.
- Offline mode. While this is not implemented, with some special logic and care,
  it could easily be added. The architecture needed to support it already exists
  but it just hasn't been fully fleshed out yet.

Note that Turtl has a 1:1 mapping of models in memory to models in a
corresponding local DB table. This makes it easy for a model to sync from the DB
or sync changes to it (for instance, when a user edits a note).

Currently, the [Turtl server](/docs/server/index) stores 30 days of sync data,
and if the Turtl app detects that profile data in the local DB is older than
30 days, the local DB will be wiped, and the profile as it exists on the server
will be downloaded and placed in (this is what happens when a new client logs in
for the first time as well). This is one of the main roadbloacks to supporting a
true offline mode: what to do when the client gets too far out of sync?

## Syncing
There are three main processes in the app that handle syncing data. Before we go
into them, let's break out our pieces into understandable chunks: we have our
in-memory models, our local DB, and the API (the server). 

Let's dive into our syncing processes:

### DB -> Memory
Every second, the local sync process checks, for each profile collection set up
to sync, its corresponding local DB table for data that has changed. If changed
data is found, it is applied to the model in-memory that corresponds to that
data. Everything is matched up using the "id" field.

This process allows in-memory models to stay tuned to remote changes, *but also
allows different pieces of the extensions to stay tuned as well*. [More on that
here](/docs/clients/extensions/index#architecture).

### DB -> API
Every second, the remote sync process looks for items in the local DB that have
been changed locally. If any are found, they are synced to the API. This allows
changes in the local DB to be applied to the remote server, keeping the local
profile in sync with the remote.

### API -> DB
Every ten seconds, the remote sync process grabs the `/sync` resource on the API
via a POST, passing the ID of the last sync item. This returns all changes to
the currently logged in user's profile since the given sync ID.

These changes are them applied in order to the local DB. After this, the
[DB -> Memory](#db-memory) process picks the changes up and syncs them to the
in-memory models, keeping our API data, local DB, and in-memory models in sync.

