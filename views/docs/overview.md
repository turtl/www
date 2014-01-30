---
title: Overview | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    Overview
</div>

# Overview
{{toc}}

Turtl is made up of notes and boards. A note can be text, a link or bookmark, an
image, or a file. Notes are what actually holds your data, no matter what it is.

A board is a collection of notes. It can be a collection of bookmarks, a TODO
list, an idea board, a shopping wishlist, or anything else you can think of that
will help you organize your notes.

Any time your data changes, it is encrypted and uploaded to the Turtl server for
storage. This allows you to safely access your data from anywhere.

## Notes
Notes are the containers that hold all your data. Notes can be any type of media
be it an image, text, a bookmark, etc. Notes can also have files attached to
them.

Notes can be tagged when creating (or editing) them. This allows you to easily
filter notes when a board gets a large number of notes.

## Boards
A board is a container that holds notes. It's also the primary means of sharing
between users. Instead of having to individually share notes with your friends,
family, or colleagues, you can share a board and all the notes in it. This makes
collaboration much easier.

Boards allow you to filter the notes in them as well by text search, tag
filtering, and soon others.

## Syncing
As mentioned, all data added to your account in Turtl is synced to the server.
This allows you to safely access your data from anywhere. Turtl mirrors all of
your boards, notes, and other data onto the device you're using and pulls down
changes as they happen from the server.

What this means is that instead of downloading your entire profile every time
you log in, Turtl just pulls down *the things that have changed* and applies
those changes to your local profile.

If you're interested in knowing more about how Turtl syncs data, head over to
the [Local storage/syncing](/docs/clients/core/local_db) section of the
documentation.

## Personas and sharing
By default, all the data in your profile is __private__. This means that you,
and you alone, can read your notes. Because your username when you log in is
used to generate your [master key](/docs/security#keys-and-sharing), it would be
bad to let others see your username.

Instead, Turtl allows you to create a persona. Personas allow you to attach an
email address and a name to your account, which is by default hidden and
private. This allows others to share with you (and vice versa) by sending you
keys to their data over Turtl's messaging system.

Personas use encryption when sending messages and data between each other (read
more about [persona messaging](/docs/security#keys-and-sharing)) so that sharing
data between two people is as secure as possible.

Note that at this time, a user is only allowed one persona. This is a somewhat
arbitrary restriction: the entire app was set up *assuming* that a user could
have multiple personas, but that functionality was never enabled.

__In the future an account will be able to have multiple personas.__

