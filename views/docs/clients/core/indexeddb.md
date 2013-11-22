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

<img src="/images/site/icons/firefox_32x32.png" width="32" height="32" alt="Firefox" align="right"/>

Enabling IndexedDB in Firefox
-----------------------------

1. Go to [about:config](about:config) in your URL bar. If Firefox warns you,
boldly ignore the warning and forge ahead.
1. You'll see a `Search` field. Type "dom.indexedDB.enabled"
1. You should see one entry show up in the area under the Search box. If you
look to the right, you'll see a label called __Value__. Make sure that the
"dom.indexedDB.enabled" value is `true`. If it is `false`, double-click the
entry to set it to `true`.

### Private Browsing bug
As of Firefox 25.x (and lower), you cannot use IndexedDB in Private Browsing
mode. They are aware of this issue: <https://bugzilla.mozilla.org/show_bug.cgi?id=781982>.
What this means is that while you can log in/join and bookmark while using
Private Browsing, you cannot open a Turtl tab in a browser window that's
private.

<img src="/images/site/icons/chrome_32x32.png" width="32" height="32" alt="Chrome" align="right"/>

Enabling IndexedDB in Chrome
----------------------------

There's no way to *disable* IndexedDB in Chrome (as far as we know).

If you are having problems loading Turtl, please
[let us know on the discussion board](http://groups.google.com/d/forum/turtl).
