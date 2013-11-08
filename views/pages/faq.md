---
Title: Frequently asked questions
layout: default
---

{{toc}}

# Why encrypt?

Why not ;-)? If you can keep your data private from hackers, government
surveillance, and other prying eyes, then why not do it? People tend to have
this stigma against encryption: you only need to encrypt if you have something
to hide. However privacy and having something to hide are two very different
things, and we believe privacy is a civil right.

That said, recently the US government has given us *all* something to hide by
their outrageous and invasive spying. By using Turtl, you're not only keeping
your data private (even if it's just cat pictures), but you're letting the US
government know how you feel about its practices.  

Take a stand.

# What makes Turtl special?

Good question. There are apps that keep your data/files in sync (Dropbox,
ownCloud, Evernote, etc). However, they do not provide what most people need
right now: privacy *and* sharing.

Dropbox/ownCloud let you sync data and share with people, but your data is
stored out in the open for anyone to read. They encrypt your data, but they
hold the keys. Anyone who asks nicely enough will get access. You can encrypt
your files before syncing them, but then you cannot share. Evernote is the same:
it lets you save thoughts and bookmarks, but they were recently hacked and
anything you had in Evernote is now being cut up, analyzed, passed around, and
sold to the highest bidder. Whoops.

Turtl gives you the best of both worlds: a private place to keep your data that
you can access anywhere, *and* a way to share/sync your data between friends,
family, colleagues. We realize that nobody is hack-proof, but the difference
between us and them is that if we ever do get hacked, your data is still a
bunch of garble that is unreadable without the keys that only you hold.

So think of Turtl like Evernote with encryption and an interface that's actually
good looking and easy to use.

# How does it work?

Turtl in its current state is a browser add-on (for Chrome and Firefox). It
installs a button in your browser that lets you add notes or bookmarks in a few
clicks to your Turtl account.

Whenever you add data, Turtl uses a cryptographic "key" generated from your
username/password to encrypt your data before sending it off to the Turtl
servers. Your data is stored encrypted and stays that way until you download it
again via the Turtl add-on and decrypt it. The only time your data is ever
readable is when you're logged in to Turtl.

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

# Is it open source?

Why, yes! We host all our code (clients *and* server) on [Github](https://github.com/turtl)
for the world to read.

__If it's not open-source, it's not encrypted.__ Plain and simple. You cannot
both keep your code private and at the same time claim you are secure. Security
comes from years of prying eyes reviewing your work and trying to find ways to
break it. Although Turtl has not yet been vetted in this way, one of our main
goals is to gain the trust of the crypto-security community. Until that day, we
will not brand ourselves as "secure."

# Is there documentation?

We now have [full documentation](/docs) of Turtl, its apps/clients, and the
server.

# Can I run my own Turtl server?

Absolutely. Head over to the [Running Turtl](/docs/server/running) section in
the documentation to read about how to run your own server.

