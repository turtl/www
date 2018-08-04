---
title: 'Syncing | Documentation'
layout: documentation
permalink: 'docs/syncing/'
---

<div class="breadcrumb">
<a href="/docs">Documentation</a> &raquo;
<a href="/docs/architecture">App architecture</a> &raquo;
Syncing
</div>

# Syncing
{% include toc.md %}

Let's dive into what makes Turtl's syncing system work.

## Client IDs (or the "cid")

Each object having a globally unique ID that can be client-generated makes
syncing painless. We do this using a few methods, some of which are actually
borrowed from [MongoDB's Object ID schema](http://docs.mongodb.org/manual/reference/object-id/).

Every client that runs the Turtl app creates and saves a client hash if it
doesn't have one. This is the hex representation of 32 bytes of random data.

The client id is formatted like this:

~~~
12 bytes hex timestamp | 64 bytes client hash | 4 bytes hex counter
~~~

For example, the cid

~~~
014edc2d6580b57a77385cbd40673483b27964658af1204fcf3b7b859adfcb90f8b8955215970012
~~~

breaks down as:

~~~
 timestamp    client hash                                                      counter
------------|----------------------------------------------------------------|--------
014edc2d6580 b57a77385cbd40673483b27964658af1204fcf3b7b859adfcb90f8b895521597 0012
 |                                    |                                        |
 |- 1438213039488                     |- unique hash                           |- 18
~~~

The timestamp is a unix millisecond timestamp value (with leading 0s to support
longer times eventually). The client hash we already went over, and the counter
is a value tracked in-memory that increments each time a cid is generated. The
counter has a max value of 65535, meaning that the only way a client can produce
a duplicate cid is by creating 65,535,001 objects in one second. We have some
devoted users, but even for them creating 65M notes in a second would be
difficult.

So, the timestamp, client hash, and counter ensure that each cid created is
unique not just to the client, but globally within the app as well (unless two
clients create the same client hash somehow, but this is implausible).

What this means is that we can create objects endlessly in any client, each with
a unique cid, use those cids as primary keys in our database, and never have a
collision.

This is important because we can create data in the client, and not need server
intervention or creation of IDs. A client can be offline for two weeks and then
sync all of its changes the next time it connects without problems and without
needing a server to validate its object's IDs.

Using this scheme for generating client-side IDs has not only made offline mode
possible, but has greatly simplified the syncing codebase in general. Also,
having a timestamp at the beginning of the cid makes it sortable by order of
creation, a nice perk.

## Queuing and bulk syncing

Let's say you add a note in Turtl. First, the note data is encrypted
(serialized). The result of that encryption is shoved into the local DB
(IndexedDB) *and* the encrypted note data is also saved into an outgoing sync
table (also IndexedDB). The sync system is alerted "hey, there are outgoing
changes in the sync table" and if, after a short period, no more outgoing sync
events are triggered, the sync system takes *all* pending outgoing sync records
and sends them to a bulk sync API endpoint (in order).

The API processes each one, going down the list of items and updating the
changed data. It's important to note that Turtl doesn't support deltas! It only
passes full objects, and replaces those objects when any one piece has changed.

For each successful outgoing sync item that the API processes, it returns a
success entry in the response, with the corresponding *local* outgoing sync ID
(which was passed in). This allows the client to say "this one succeeded, remove
it from the outgoing sync table" on a granular basis, retrying entries that
failed automatically on the next outgoing sync.

Here's an example of a sync sent to the API:

~~~
[
    {id: 3, type: 'note', action: 'add', data: { <encrypted note data> }}
]
~~~

and a response:

~~~
{
    success: [
        {id: 3, sync_ids: ['5c219', '5c218']}
    ]
}
~~~

We can see that sync item "3" was successfully updated in the API, which allows
us to remove that entry from our local outgoing sync table. The API also returns
server-side generate sync IDs for the records it creates in its syncing log. We
use these IDs passed back to *ignore* incoming changes from the API when incoming
syncs come in later so we don't double-apply data changes.

### Why not use deltas?

Wouldn't it be better to pass diffs/deltas around than full objects? If two
people edit the same note in a shared space at the same time, then the
last-write-wins architecture would overwrite data!

Yes, diffs would be wonderful. However, consider this: at some point, an object
would be an original, and a set of diffs. It would have to be collapsed back
into the main object, and because the main object *and* the diffs would be
client-encrypted, the server has no way of doing this.

What this means is that the clients would not only have to sync notes/boards/etc
but also the diffs for all those objects, and collapse the diffs into the main
object then *save the full object back to the server*.

To be clear, this is entirely possible. However, I'd much rather get the
whole-object syncing working perfectly before adding additional complexity of
diff collapsing as well.

## Polling for changes

Whenever data changes in the API, a log entry is created in the API's "sync"
table, describing what was changed and who it affects. This is also the place
where, in the future, we might store diffs/deltas for changes.

When the client asks for changes, at does so using a sequential ID, saying "hey,
get me everything affecting my profile that happened after &lt;last sync id&gt;".

The client uses long-polling to check for incoming changes (either to one's own
profile or to shared resources). This means that the API call used holds the
connection open until either a) a certain amount of time passes or b) new sync
records come in.

For each sync record that comes in, it's linked against the actual data stored
in the corresponding table (so a sync record describing an edited note will pull
out that note, in its current form, from the "notes" table). Each sync record is
then handed back to the client, in order of occurence, so it can be applied to
the local profile.

The result is that changes to a local profile are applied to all connected
clients within a few seconds. This also works for shared spaces, which are
included in the sync record searches when polling for changes.

## File handling

Files are synced separately from everything else. This is mainly because they
can't just be shoved into the incoming/outgoing sync records due to their
potential size.

Instead, the following happens:

### Outgoing syncs (client -> API)

TODO: update for v0.7 (core).

### Incoming syncs (API -> client)

TODO: update for v0.7 (core).

## What's not in offline mode?

All actions work in offline mode, except for a few that require server approval:

- login (requires checking your auth against the API's auth database)
- joining (creating an account)
- changing your password
- sharing a space
- deleting your account

