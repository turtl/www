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

# Why build Turtl?

There are many reasons, but the main one was there's no privacy-oriented tool
out there that let's you easily track and share data securely. We wanted
something that guaranteed information security outside of an easily-ignorable
privacy policy. So we made Turtl and built in some of the best crypto
technology around into its very core.

This is especially useful in a time where the entire world is under complete
electronic surveillance. Turtl provides a safe haven for those wanting to store
and share data without having to worry about who's watching.

# What can Turtl be used for?

The goal of Turtl is to make it incredibly safe and easy to store data or files
and to enable secure sharing between you and those you trust. Whether you're
working on a stealth project with friends, you're a journalist who needs to
gather research without fear of surveillance, or you need to securely share
sensitive documents with your lawyer, Turtl is there for you.

Note that Turtl is early beta and as such should *not* be used to store
life-risking data. Our goal is absolute privacy and security, but Turtl needs to
mature more before it's used for extremely sensitive data.

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

The core concept of Turtl is organized around notes. A note can be anything: a
bookmark to a website, a password, a recipe, etc. A note can also have a file
attached, making is easy to store and share documents, images, videos or other
files. Notes are put into different "boards" to keep them organized. You could
have a board for bookmarks, one for your passwords and banking information, one
for your contacts, etc. Anything from quick pieces of data you want to keep
track of to large documents can be stored in Turtl.

To get started, [download the Turtl app](/download). Once you open it up, you
can either log in to an existing account or sign up for a new account. Once
logged in, you can start adding notes to Turtl.

Whenever you put anything in Turtl, a cryptographic "key" generated from your
login information is used to encrypt your data before syncing it with the
servers. Your data is stored encrypted and is only ever decrypted when you or
someone you shared with is logged in to Turtl.

Only *you* hold the keys to your data. Not even the people running the Turtl
servers have access to see your data.

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

If at any point Bob no longer wants Alice to have access to "Dog pics" he can 
easily remove her from the board, and she'll no longer have access (and Turtl
will remove the board's key from her private data).

# Where are files stored?

Files are stored on Amazon's S3 service. 

While some of you may cringe at this, remember that all Turtl data is encrypted
*before* leaving your computer/device, including files. Also, there's absolutely
no place in the world we can keep data that some third party won't have access
to it.

So while we may be able to rent our own datacenter and have armed guards posted
around it 24/7, and while this may make you *feel* safer, someone besides you
and me will *always* have physical access to the data. The amount of security
Turtl's encryption provides is exponentially more than any security you'd get
from armed guards and 8 digit door codes.

Not only is using S3 just as safe as storing our data internally, it costs a
lot less for both us and for you.

Keep in mind that the [Turtl server](/docs/server/index) is open source, and if
you don't like the way we run our server, you can [run your own](/docs/server/running)
=]. There are even [open source S3 alternatives](http://basho.com/riak-cloud-storage/)
you could run internally so you wouldn't have to change any code.

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


