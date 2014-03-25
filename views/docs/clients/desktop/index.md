---
title: Desktop | Clients | documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    Desktop
</div>

# Desktop
{{toc}}

Turtl's desktop app is comprised of the [Turtl core](/docs/clients/core/index)
wrapped in a project called [node-webkit](https://github.com/rogerwang/node-webkit).
Node-webkit takes an HTML5 web application and allows it to run on different
desktop environments (Windows, Linux, Mac).

Node-webkit also allows you to package and distribute your app for each platform
it runs on without needing to actually have it installed on the user's computer.
This allows us to provide one simple download that runs Turtl right out of the
box.

## Architecture
The desktop app runs [Turtl core](/docs/clients/core/index) wrapped in a few
libraries that provide extra functionality. Because it enforces no separation
between the core and the wrapping functionality, the architecture is fairly
simple as all code shares a common namespace.

Turtl desktop provides its own notifications and modal interfaces built on top
of the tools provided by node-webkit.

## HTTP server
Turtl's desktop app opens an HTTP server on port 7471 to listen for various
commands from the browser extensions and accepting invites from the Turtl
website. It current provides a handful of functions:

- Accepting invite data from the Turtl website
- Setting up pairing between the desktop app and the [bookmarking extensions](/docs/clients/extensions/index),
  which is required to pass any data into the desktop app (aside from invites).
- Accepting bookmarking data.

Pairing is the process of sharing a cryptographic ECC (384 bit) public key
between the desktop app and a browser extension in order to let them talk
without fear of eavesdropping. The desktop app generates and displays the key
which is then copied and pasted into the extension (by the user).

## Setup and running
Unless using a packaged version, Turtl desktop requires you to have node-webkit
installed. If you are running for the first time, you need to set up a symlink
to the core app:

### Windows
Must be run in an admin command shell:
```
dir \path\to\turtl\desktop\data
mklink /d app \path\to\turtl\core
```

### \*nix
```
cd /path/to/turtl/desktop/data
ln -s /path/to/turtl/core app
```

### Running
Once the symlink is in place:
```
cd /path/to/turtl/desktop
/path/to/node-webkit/nw .
```

## Building and packaging
There is a bash script (`scripts/package`) which builds and packages the desktop
app in its entirety. This creates the `release/package.nw` file which
node-webkit can run directly.

Note that the `package` script must be run in the main extension directory, not
in the `scripts/` directory.

### Config
If you're building the app to point to your own Turtl server, be sure to
update `config.live.js` file to point to the corrent API url *before* building.

