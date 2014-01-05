---
Title: Frequently asked questions
layout: default
---

{{toc}}

# Why use encryption?

"I have nothing to hide." Well, would you use a public bathroom with glass
walls?

Just because you aren't storing harmful or illegal things doesn't mean you want
the world having access to your data. Not only does encryption protect your
privacy, it makes it extremely difficult (usually impossible) for hackers and
malicious government agencies to see your data as anything but complete 
gibberish.

We believe privacy is a civil right deserved by all.

# What makes Turtl special?

Privacy and sharing.

*Privacy* is something most (if not all) cloud services lack. Dropbox, Evernote,
ownCloud, etc...while they may encrypt your data, they only do so *after* it
it hits their servers. This offers opportunities for anyone operating the app
(and any third parties or government agencies they give access to) to have
complete, unfettered access to anything you post.

*Sharing* is easy to do when a service (like the ones mentioned above) holds the
keys to your data, however it becomes a lot harder when the service has no real
knowledge of what's being stored.

Turtl solves both these problems. It allows sharing *with* privacy, giving you
an easy way to collaborate on projects that you don't want the world seeing.

# How does it work?

Turtl is an installed app (either installed as a browser extension, a desktop
app, or *soon* a mobile app).

Whenever you add data, Turtl uses a cryptographic "key" generated from your
username/password to encrypt your data before sending it off to the Turtl
servers. Your data is stored encrypted and stays that way until you download it
again via Turtl and decrypt it. The only time your data is ever readable is when
you're logged in to Turtl.

Only *you* hold the keys to your data. Not even the people running the Turtl
servers have access to your data.

# How does sharing work?

Sharing uses what's known as asymmetric-key encryption. It's what people use to
send secure emails to each other, and what lets you communicate securely with
your online banking website. It works using a "public" and a "private" key. The
public key is used to encrypt data, and the only way to decrypt the data is
using the private key.

So if Bob wants to send Alice a Turtl board containing pictures of his dog
(we'll call it "Dog pics"), he first searches Alice's email to get her public
key (which is available freely through her public profile). Once this is done,
Turtl takes over. It takes the cryptographic key that protects the data in "Dog
pics" and encrypts it using Alice's public key. It then sends Alice an invite
via Turtl that only she can decrypt (using her private key, which is always kept
secret). Once Alice gets the invite, she accepts it, adding herself to the list
of people allowed to access "Dog pics" and is now able to decrypt all the data
in it because Bob sent her the key to the board.  

If at any point Bob no long wants Alice to have access to "Dog pics" he can 
easily remove her from the board, and she'll no longer have access (and Turtl
will remove the board's key from her private data).

# Is there a Firefox extension?

There is, and it works great, however we no longer support Firefox for two
reasons:

1. It doesn't support sandboxing. Extensions can easily grab data from each
other, which doesn't provide the private environment Turtl requires.
1. Its IndexedDB implementation, which Turtl uses extensively, crashes a
lot. We have [an open bug report](https://bugzilla.mozilla.org/show_bug.cgi?id=943650)
but until it is fixed, we can't release an extension that crashes the browser
every five minutes.

If you'd like to test out the Firefox extension regardless of these issues,
[contact us](/contact) and we can send you a build, or you can build your own
using [the extension's source](https://github.com/turtl/firefox).

# Is it open source?

Why, yes! We host all our code (clients *and* server) on [Github](https://github.com/turtl)
for the world to read.

__If it's not open-source, it's not encrypted.__ Plain and simple. You cannot
both keep your code private and at the same time claim you are secure. Security
comes from years of prying eyes reviewing your work and trying to find ways to
break it. Although Turtl has not yet been vetted in this way, one of our main
goals is to gain the trust of the crypto-security community.

# Can I run my own Turtl server?

Absolutely. Head over to the [Running Turtl](/docs/server/running) section in
the documentation to read about how to run your own server.


