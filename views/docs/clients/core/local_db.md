---
title: Local storage/syncing | Core | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    <a href="/docs/clients/core/index">Core</a> &raquo;
    Local storage/syncing
</div>

# Local storage/syncing
{{toc}}

Turtl mirrors the user's profile in the client's local database. Currently in
all cases, this is IndexedDB, a local database that now ships with all browsers
that matter.

Turtl uses this database not only as a place to store the profile, but as a
syncing point between the core and the extension or app wrapping it. For
instance the extensions use the local DB to know when data has changed, and sync
those changes to their background pages. Read more on [how extensions use the local DB](/docs/clients/extensions/index#architecture).

## Local DB
The local DB (IndexedDB to outsiders, but referred to as the "local DB" in case
the storage mechanism is switched down the road) is used as a place to store
the user's profile.

All data changes flow through the local DB. An in-memory model doesn't get saved
to the API without first saving itself to the local DB, and vice versa, if a
note is changed by another user and the change is synced to the client, the
change goes through the local DB before being picked up by the in-memory model
that corresponds to the note.

The local DB only stores encrypted profile data (the only time anything is
decrypted is in-memory) and persists the profile across client loads. While this
gives us a performance boost while starting the client (no need to download the
entire profile on each login), it also allows us some other significant
advantages:

- Ability to load/decrypt specific pieces of the profile, as opposed to
  decrypting the whole thing and holding it in memory. Note: the core currently
  *does* hold the entire profile in memory, but this is mainly vestigial and
  will probably load in data board-by-board soon.
- Offline mode. While this is not implemented, with some special logic and care,
  it could easily be added. The architecture needed to support it already exists
  but it just hasn't been fully fleshed out yet.

Note that Turtl has a 1:1 mapping of models in memory to models in a
corresponding local DB table. This makes it easy for a model to sync from the DB
or sync changes to it (for instance, when a user edits a note).

Currently, the [Turtl server](/docs/server/index) stores 30 days of sync data,
and if the Turtl core gets more than 30 days out of sync, it may lose data until
the profile is wiped and re-downloaded. There are plans to detect the mitigate
this, but they aren't implemented.

## Syncing
Turtl syncs between the in-memory models, the database, and the API. This keeps
all profile data consistent and persisted.

Syncing is accomplished using the amazing [Hustle](https://github.com/orthecreedence.hustle)
library, a queuing and messaging system that persists to IndexedDB. Turtl makes
an active effort to separate the portions of code that sync API &lt;--> DB and
DB &lt;--> memory, and Hustle is what lets them talk to each other.

### Memory &lt;--&gt; DB
When a note (or other model) is saved, it persists itself into its matching
object in IndexedDB and also signals (via Hustle) that it has changed. This lets
other components know that local data has changed and update accordingly if
needed.

On the flip side, when the syncing process changes data in the DB, it signals
to Hustle that the data has changed, and any listeners will update themselves
with the new changes.

### DB &lt;--&gt; API
When a model saves in memory, it queues a remote sync (as well as signaling a
local change). This tells the remote syncing system to save the data to the API
(whether its creating, updating, or deleting a record). The data is sent to the
API, and if needed, the response is saved back into the database (for instance,
if a new record is added and the API responds with an object ID, that id will
[replace the client-generated ID](#id-matching)).

### API -> DB
Every ten seconds, the remote sync process grabs the `/sync` resource on the API
via a POST, passing the ID of the last sync item. This returns all changes to
the currently logged in user's profile since the given sync ID.

These changes are them applied in order to the local DB, each triggering a local
sync via Hustle.

### ID matching
When an item is added in the core, it get sa temporary id (a CID, or "client"
ID) which lets us identify the object locally. When it's saved to the API, it
gets a real, server-generated ID which is saved back into and all instances of
the CID are replaced with the ID.

There is a small possibility that an item is added to the API and the client is
killed before the generated ID is able to rewrite itself to the local data. In
this case, the next time the client syncs from the API, the CID *and* ID of the
new object are returned in the sync call, and the core updates the object with
its new ID.

This mitigates potential orphans and mismatches in the data.

## File storage
Turtl allows a file to be attached to a note. File syncing is treated somewhat
differently than other data in the local db (and in-memory) so it deserves its
own section.

When you attach a file to a note, it immediately triggers a background task to
encrypt the file (via the WebWorker protocol). Files are always encrypted and
decrypted in a background thread to keep the main interface from getting choppy.
When the encryption completes, the file is split up into two places:

1. The note. Each note has a `file` object attached that, if a file is present,
stores the file's post-encryption hash as well as the file's filename and
type. The file contents are not stored in this object. This allows information
about the file to be referenced without having to do further lookups in the
local database. Note that the note's `file` object *always* uses the same
encryption key as the note.
1. The `files` table. This is where the file's contents are stored (encrypted).
The `id` field of each record in this table is the hash of the file's
post-encryption payload. This allows a note to easily reference the file's
contents by the hash it has stored and avoids any strange id-generating schemes.

The `Files` collection is a lot like other syncing collections, however it only
syncs remotely (there is no in-memory representation of a file record other than
the metadata that the note holds about the file). There are two separate File
collection instances: one is registered with the remote syncing system to listen
to sync records from the API and also perform tasks like uploading/downloading,
and the other is used just for tracking file uploads/downloads and lives in
`turtl.files`. Any upload/download triggered by the remote Files collection goes
through `turtl.files`, allowing the app to track the uploads/downloads in
progress.

