---
title: Firefox | Browser bookmarking extensions | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    <a href="/docs/clients/extensions/index">Browser bookmarking extensions</a> &raquo;
    Firefox
</div>

# Firefox
{{toc}}

The Firefox addon uses the [Addon SDK](https://addons.mozilla.org/en-US/developers/docs/sdk/latest/)
to drive it.

## Building and packaging
There is a bash script (`scripts/package`) which builds and packages the
extension in its entirety. This creates `release/turtl.xpi` file.

Note that the `package` script must be run in the main extension directory, not
in the `scripts/` directory.

