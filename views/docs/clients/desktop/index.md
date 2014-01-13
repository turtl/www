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
Node-webkit takes an HTML5 web application, which is what Turtl core is, and
allows it to run on different desktop environments (Windows, Linux, Mac).

Node-webkit also allows you to package and distribute your app for each platform
it runs on without needing to actually have it installed on the user's computer.
This allows us to provide one simple download that runs right out of the box.

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
app in its entirety. This creates `release/turtl.[exe|dmg]` file.

Note that the `package` script must be run in the main extension directory, not
in the `scripts/` directory.

### Config
If you're building the app to point to your own Turtl server, be sure to
update `config.live.js` file to point to the corrent API url *before* building.

