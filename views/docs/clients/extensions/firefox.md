---
title: Firefox | Browser extensions | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    <a href="/docs/clients/extensions/index">Browser extensions</a> &raquo;
    Firefox
</div>

# Firefox
{{toc}}

The Firefox addon uses the [Addon SDK](https://addons.mozilla.org/en-US/developers/docs/sdk/latest/)
to drive it. It loads its background process as a Panel, allowing it to exist
while closed, but also allowing it to be opened into an app-based controller
(such as the bookmarker or invites dialog).

## CFX and running
As a quick note, the extension is able to be run via `cfx run`, however before
doing so, you must create a symlink to the app under data:

### Windows
Must be run in an admin shell (because creating links is soooOOooOOo dangerous).
```
dir path\to\turtl-firefox\data
mklink /d app \path\to\turtl-core
```

### \*nix
```
cd /path/to/turtl-firefox/data
ln -s /path/to/turtl-core app
```

## Building and packaging
There is a bash script (`scripts/package`) which builds and packages the
extension in its entirety. This creates `release/turtl.xpi` file.

Note that the `package` script must be run in the main extension directory, not
in the `scripts/` directory.

### Config
If you're building the extensions to point to your own Turtl server, be sure to
update `config.live.js` *before* building

