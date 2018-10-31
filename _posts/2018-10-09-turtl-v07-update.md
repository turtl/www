---
layout: post
title: 'Turtl v0.7 Update'
post_header: 'turtl.jpg'
---

Hi, everyone. We're excited to announce the release of Turtl v0.7. We've been
slowly testing and tuning it for many months now with the help of some dedicated
contributors, and it's finally ready for launch!

<div class="uk-text-center">
<a href="/download/" class="uk-button uk-button-primary">Download Turtl v0.7</a>
</div>

This is a really big update to Turtl, and deserves some explanation.

We've comletely rebuilt the server from scratch. What was once Common Lisp is
now Javascript (the new server [lives here](https://github.com/turtl/server) for
those interested).

We've also rebuilt/rearchitected a lot of the internals of Turtl as well. A lot
of this has to do with making Turtl easier to use with teams, but has also made
everything much faster and more stable. The app itself now takes seconds to do
things that used to take minutes. On top of this, we're now using a more secure
method to protect your data.

## Account migration

Because so much has changed since the last version, an account migration is
required. Also, new accounts no longer use anonymous usernames and will require
an email. I know this feels like a drastic change, but it's incredibly hard to
help people if all they have handy is a non-public username. If you really want
to remain anonymous, you can use a fake email because _confirmation of email
accounts is only required to enable sharing._ This works very closely to how
personas operated in the past.

Account migration happens in the app itself. It downloads your profile off of
the old server, reformats it for the new server, and publishes it to your
newly-created account. The process should be straightforward, but feel free to
[reach out](/contact) if you have problems. There were some issues with account
migration on android on v0.7.0, but v0.7.1 has been released which fixes these
issues.

Please note that migration does not move shares from the previous version. To
share on the new version of Turtl, the person you want to share with also needs
to be on the new version of Turtl and you must re-share with them.

### Known issues

Migration is a complicated process and while we did a lot of testing before
launching the new version, some people are experiencing problems:

- Some users are experiencing a problem logging in with their old credentials
([#190](https://github.com/turtl/tracker/issues/190))
- ~~Some users are experiencing an issue where migration is not moving any of
their data over ([#192](https://github.com/turtl/tracker/issues/192))~~

If you have a problem with migration, don't worry, your data is safe on the old
servers. The migration process *copies* your old data, it doesn't actually
change it. Please bear with us as we fix these problems.

Also, feel free to install the old version of Turtl until we have everything
sorted out:

- Desktop: <https://github.com/turtl/desktop/releases/v0.6.4>
- Android: <https://github.com/turtl/android/releases/v0.6.4>

## Other changes

Turtl now has the concept of Spaces. These act as containers for your data that
keep things separate from each other. For instance, you might have a "Personal"
space or a "Work" space. Spaces enable sharing between users...we still have
boards, but they don't allow sharing anymore. We might allow sharing for
individual boards in the future (see [this issue](https://github.com/turtl/tracker/issues/185)).
Spaces allow more granular permissions with sharing, which should make using in
team-based settings much easier.

As mentioned, Turtl still uses boards. However, boards cannot be nested under
other boards anymore. I know this might upset some, but the feature was not
used much and complicated the interface and architecture quite a bit.

Notes can now exist in at most one board. This was another feature that
complicated things a lot but we felt didn't add much.

## Technical stuff

Turtl v0.7 now uses a [new component called the Core](https://github.com/turtl/core-rs)
which replaces most of the old app's code. The core is built in Rust and handles
all the syncing, sharing, and cryptography, allowing the [js project](https://github.com/turtl/js)
to act purely as an interface/UI and not house any logic.

When building the Turtl project from scratch, you'll need to follow instructions
for building the core, the js project, and whatever final platform you're
building for (desktop/android).

## Up next: iOS

One of our next big goals is an iOS app. The new core component makes this much
easier and while we don't have a specific timeline, we'll try to be as
transparent as possible about updates.

## Contributing

The Turtl project used to use Trello to track our progress, but we've since
moved to a centralized [github tracker](https://github.com/turtl/tracker) to
organize all of our bugs and feature requests.

Please see our new [contributing page](/contributing) for more info on helping
out with the project!

<credit>(Post photo credit: <a target="_blank" href="https://www.pexels.com/photo/tortoise-on-rock-914794/">Jose Aragones</a>)</credit>

