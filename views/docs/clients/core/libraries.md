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

Turtl uses many third-party libraries, and this is meant to be a comprehensive
list of which ones and why it's included.

It's important to note that Turtl does __not__ use git submodules. All libraries
are stored in Turtl's source control, eliminating the chance that someone could
sneak in malicious code through one of the listed third-party libraries.

Note also that all included libraries have been carefully reviews for any trace
of data leakage (via JSONP, iframes, browser APIs, etc)...anything that could
compromise user privacy. None found.

## [Cowcrypt](https://github.com/rubbingalcoholic/cowcrypt)
The main crypto library used by Turtl. Provides AES, Twofish, RSA, hashers,
HMAC, PBKDF2.

Built by Jeff Lyon, co-author of Turtl.

## [Mootools](http://mootools.net/)
Turtl uses Mootools Core 1.4.5 and Mootools More 1.4.0.1. Core is used for the
object-orientation, and also to drive Composer.js (our MVC framework).

More is used for things like drag and drop sorting and other UI niceties.

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

## [lunr.js](http://lunrjs.com/)
Used for in-dashboard note searching. Indexes note titles, URLs, bodies and tags
and allows for quick and easy filtering of notes.

## [PageDown](http://code.google.com/p/pagedown/)
Used for converting Markdown in the note editor into HTML when showing notes.

## [mooMasonry](http://mootools.net/forge/p/moomasonry)
Gives Turtl it's beautiful Pinterest-style default layout.


