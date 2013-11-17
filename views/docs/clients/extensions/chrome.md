---
title: Chrome | Browser extensions | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    <a href="/docs/clients/extensions/index">Browser extensions</a> &raquo;
    Chrome
</div>

# Chrome
{{toc}}

The Chrome extension uses Chrome's standard extension API and uses the main
background page API for its background process.

## Running
You can open the extension locally by going to `Tools > Extensions`, making sure
"Developer mode" is *checked* and then click "Load unpacked extension..." Then
browse to the folder the Turtl Chrome extension is and you're now running Turtl
in Chrome!

Note that before running, you need to create a symlink to the Turtl core in the
`data/` folder:

### Windows
Must be run in an admin shell:
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
extension in its entirety. This creates `release/turtl.zip` file.

Note that the `package` script must be run in the main extension directory, not
in the `scripts/` directory.

### Config
If you're building the extensions to point to your own Turtl server, be sure to
update `config.live.js` *before* building

