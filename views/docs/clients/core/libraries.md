---
title: Packaged libraries | Core | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    <a href="/docs/clients/core/index">Core</a> &raquo;
    Packaged libraries
</div>

# Packaged libraries
{{toc}}

Turtl uses some third-party libraries, and this is meant to be a comprehensive
list of which ones we use and why.

It's important to note that Turtl does __not__ use git submodules. All libraries
are stored directly in Turtl's source control, eliminating the chance that
someone could sneak in malicious code through one of the listed third-party
libraries.

Note also that all included libraries have been carefully reviewed for any trace
of data leakage (via JSONP, iframes, browser APIs, etc) before inclusion in the
Turtl project.

## [Cowcrypt](https://github.com/rubbingalcoholic/cowcrypt)
The main crypto library used by Turtl. Provides AES, Twofish, RSA, hashers,
HMAC, PBKDF2.

Built by Jeff Lyon, co-author of Turtl.

## [Mootools](http://mootools.net/)
Turtl uses Mootools Core 1.4.5 and Mootools More 1.4.0.1. Core is used for the
object-orientation, and also to drive Composer.js (our MVC framework).

More is used for things like drag and drop sorting and other UI niceties.

*NOTE*: our Mootools Core implementation has been modified to support features
in the `Request` library such as upload progress monitoring and raw ArrayBuffer
downloading. We plan to release these changes as pulls on the [Mootools Github
repository](https://github.com/mootools/mootools-core) when we have time to
document and test them.

## [Composer.js](http://lyonbros.github.io/composer.js/)
Composer.js is the MVC framework used by the Turtl core. It provides a good
amount of tools and structure that help make the core fast, secure, and
maintainable.

Composer.js is built and maintained by Lyon Bros. Enterprises, the wonderful
people who bring you Turtl!

## [History.js](https://github.com/browserstate/history.js/)
Used for pushState abstractions, however Turtl doesn't use pushState. It did in
earlier versions, and may in the future, but right now there's just one page and
nothing else.

The currently packaged version is somewhat old, but works fine and will most
likely not be updated.

## [DB.js](https://github.com/aaronpowell/db.js)
Used as a layer over IndexedDB (the local DB) to make using it suck less.

*NOTE*: We have a modified version of db.js. Although we've patched the [main
repository](https://github.com/aaronpowell/db.js) a few times, we have some
outstanding changes needing to be documented/tested.

## [lunr.js](http://lunrjs.com/)
Used for in-dashboard note searching. Indexes note titles, URLs, bodies and tags
and allows for quick and easy filtering of notes.

## [PageDown](http://code.google.com/p/pagedown/)
Used for converting Markdown in the note editor into HTML when showing notes.

## [mooMasonry](http://mootools.net/forge/p/moomasonry)
Gives Turtl it's beautiful Pinterest-style default layout.


