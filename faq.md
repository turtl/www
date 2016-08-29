---
layout: documentation
title: "Frequently Asked Questions"
permalink: "faq/"
---

Frequently Asked Questions
==========================
{% include toc.md %}

### When is Turtl for iOS coming?

Good question. For this to get done, the project needs a macbook of some kind,
which the maintainer does not currently have. The VM we use to run Mavericks
just doesn't run XCode. Sure, there are online options for running Mac VMs, but
this project is on a shoestring budget and spinning up more servers isn't an
option at the moment.

That said, on top of just using XCode to run our Cordova build (Turtl on mobile
is a webview), we need to do a number of integrations and testing to make it
actually usable.

Fortunately, it looks like we'll have a Macbook soon and the work that needs to
be done to port Turtl to iOS can start.

All that said, __the answer to the question is__: "I don't know." There is no
deadline or roadmap for iOS. If anyone who is familiar with Cordova apps and has
a Macbook wants to take a crack at it, Turtl would owe you a large debt of
gratitude.

### How do I get the server running?

People have issues with the Turtl server a lot. It's best to hop onto the
[discussion board](https://groups.google.com/forum/#!forum/turtl) and ask there.
Lots of people have asked for and received help on running the server on the
discussion board.

Keep in mind by running your own server you're going off the supported path.
The maintainers of the project can't go out of their way to help you if
you run into problems. The bulk of the work for the project happens on the
clients (desktop, mobile) and fixing platform-specific server issues is not a
priority.

### Why isn't Turtl on FDroid?

Turtl is not on FDroid because it uses the Crosswalk project, which is not
currently compatible with FDroid (see <https://crosswalk-project.org/jira/browse/XWALK-5164>).

There is an [open submission](https://f-droid.org/forums/topic/turtl/) but it
probably won't go anywhere until Crosswalk and FDroid kiss and make up.

### Why isn't the code signed on Mac or in the Mac store?

For a lot of the same reasons in [this question](#when-is-turtl-for-ios-coming).

But really, Apple wants you to pay them money to release software on their
mediocre platform, and they want you prove that you payed them by signing your
app with a certificate they have blessed.

We've payed the $100, and now just need a Mac build machine to do the signing
stuff.

### Why isn't Turtl a native app?

This is a small project, maintained by people with limited time, built mainly
for the common good.

Try building and maintaining three different apps on five different platforms
with extremely limited spare time. You'll quickly realize how difficult it is
(even just one codebase is hard enough). In the age we're in, it's completely
ridiculous that mobile platforms have made it nearly impossible to reuse code
across platforms.

Think of Turtl's choice to use HTML5/webviews instead of going native on all
platforms as a conscientious objection to the idea of forcing platforms down
builder's throats. Really, we just don't have time to deal with all different
codebases.

### Why does the note editor use Markdown?

Turtl makes use of Markdown becaues it's a fairly easy format to learn and to
write. Another big reason is that most rich text editors that are able to run
inside of Turtl are horrible, buggy messes that would make the editing process
a lot more painful.

We're always looking for ways to improve the app, though. If you run across an
HTML5 text editor that doesn't make you want to blow your brains out and think
we'd be interested, [let us know](/contact).

### Can I contribute?

Of course. For contributions of any significance (changing more than a few
lines), we ask that you sign our Contributor License Agreement. Once that's
done, you're free to contribute as much or as little as your heart desires.

[Check out our contributing page for more details](/contributing).

