---
title: Chrome | Browser bookmarking extensions | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    <a href="/docs/clients/extensions/index">Browser bookmarking extensions</a> &raquo;
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

## Building and packaging
There is a bash script (`scripts/crx`) which builds and packages the
extension in its entirety. This creates `release/chrome.crx` file.

Note that the `package` script must be run in the main extension directory, not
in the `scripts/` directory.

