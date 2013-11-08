---
title: Browser extensions | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    Browser extensions
</div>

# Browser extensions

The browser extensions allow Turtl to run in the browser without the threat of
modification. Not only do they provide extra security while using Turtl in your
browser, but they allow you to easily bookmark photos, videos, and websites with
the click of a button.

{{{div.clear}}}
{{{div.doc-sec}}}

### [Firefox](/docs/clients/extensions/firefox)

- [CFX and running](/docs/clients/extensions/firefox#cfx-and-running)
- [Building and packaging](/docs/clients/extensions/firefox#building-and-packaging)

{{{/div}}}
{{{div.doc-sec}}}

### [Chrome](/docs/clients/extensions/chrome)

- [Running](/docs/clients/extensions/chrome#running)
- [Building and packaging](/docs/clients/extensions/chrome#building-and-packaging)

{{{/div}}}
{{{/div}}}

<a id="#architecture"></a>

## Architecture
All browser extensions follow the same basic architecture: They have a main
process that loads the extensions libraries and does basic setup, a background
process that loads the [app](/docs/clients/app/index) and its data, and they are
able to open tabs into a new instance of the app.

### Syncing
The extensions sync data between their background process and app tabs using the
[local DB](/docs/clients/app/local_db), which allows sharing of all profile data
without having to constantly manually sync changes via messaging.

When an extension is loaded, the only piece that does remote syncing (ie, saving
data to the API and syncing data from the API) is the background process. All
app tabs are only permitted to sync locally.

What this means is that if you add a note in an app tab, it will save to the
local DB, but it's the background process of the extension that actually saves
the new data to the API.

### Controllers and views
The extensions use controllers from the background process to show certain
dialogs such as the bookmarker and the persona manager. This allows the
extension to use code that's already built for showing specific interfaces
instead of building new interfaces for each extension.

Note that the only interfaces that the extensions house themselves are:

1. The user login/join dialog.
1. The dropdown menu that opens when you click the Turtl extension button.

Everything else is loaded from views that exist in the app. This makes Turtl as
a whole much more maintainable and also allows testing of the app as a web app
and not just a browser extension.

### Messaging
The extensions allow messaging through objects called addon-adapters, housed
under `library/addon/adapters` in the main app. These provide a standard
interface for the app to send messages to and listen to messages from the 
extensions.

The object lives under the `window.port` context, and in many places throughout
the app you'll see:

```javascript
// send a message to the extension
if(window.port) window.port.send(...);

// listen for extensions messages
if(window.port) window.port.bind(...);
```

This is the app communicating with the addon.

