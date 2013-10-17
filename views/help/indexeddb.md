---
title: Enabling IndexedDB in your browser
layout: default
---

IndexedDB and Turtl
===================
IndexedDB is an essential component of Turtl that stores large chunks of your
data (encrypted) on your computer. This allows Turtl to easily find the data it
needs without having to make trips to the Turtl servers, and also gives Turtl a
place to store your files.

Without IndexedDB, Turtl will not work. Here are the steps to make sure it's
enabled in your browser.

## Enabling IndexedDB in Firefox

1. Go to [about:config](about:config) in your URL bar. If Firefox warns you,
boldly ignore the warning and forge ahead.
1. You'll see a `Search` field. Type "dom.indexedDB.enabled"
1. You should see one entry show up in the area under the Search box. If you
look to the right, you'll see a label called __Value__. Make sure that the
"dom.indexedDB.enabled" value is `true`. If it is `false`, double-click the
entry to set it to `true`.

## Enabling IndexedDB in Chrome

There's no way to *disable* IndexedDB in Chrome (as far as we know). If you are
having problems loading Turtl, please [let us know using the Turtl issue tracker](https://github.com/turtl/js/issues).
