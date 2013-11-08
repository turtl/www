---
title: Security and encryption | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    Security and encryption
</div>

# Security and encryption
Turtl uses encryption to protect your data in such a way that only you, and
those you choose, are able to view your data. Keep reading for a high-level
overview of Turt's encryption and how it protects you.

{{toc}}

## Encryption explained
Simply put, encryption is the process of scrambling data. Generally, this is
done using a "key" which is usually a passphrase. The only way to de-scramble
the data is using that passphrase.

Turtl's encryption works by generating a key for you based on your
username and password. This key is used to lock and unlock (or encrypt and
decrypt) your data and keep it private. All of the encryption in Turtl happens
before any data leaves the app, meaning that even if someone is snooping in on
your connection or someone hacks our database, everything you've put into Turtl
is just gibberish to them.

Without the keys that only you hold, your data is useless.

## Keys and sharing
As mentioned, Turtl creates a key for you when you log in based on your username
and password. It wouldn't be very useful if you had to give people this key when
you shared data with them because it would give them access to all your data.
Instead, Turtl generates a *new, random* key for each object. This key is what
is sent to people when sharing, allowing them to unlock the specific item you
send them and nothing else.

Keys are stored one of two ways:

1. __Boards__. Board keys are stored in your "keychain" which is a collection of
keys stored with your profile. These keys are all encrypted using your master
key so *only you* are able to read your keychain.
1. __Notes__. Notes store their key in their own data, encrypted with the key of
the board they belong to. What this means is that once a user has access to a
board (and the board's key) they can also decrypt all the notes in that board.
This allows sharing of entire boards *without* having to share the key of each
note in that board.

## Encryption specifics
If you're looking for a more comprehensive look at how Turtl does encryption,
check out the [Client encryption](/docs/clients/app/encryption) page of the docs
which goes over the ciphers, block modes, and other methods Turtl uses when
handling your data.

## When is Turtl *not* secure?

Here are some possible scenarios where Turtl's security measures will fail you.
We try to provide an exhaustive list so you're aware of the dangers of relying
on Turtl.

- __When we make mistakes__. That's right, we're human. It's entirely possible
that bugs in the Turtl client leave your data exposed, *especially* at our
early stage.
- __When you use a bad password__. Turtl encrypts just about everything before
sending it to the server. It does this using a cryptographic key based off of
your username and password. If you choose a username/password combination that's
short, predictable, easy to guess, etc then your data is *not safe*. Choose a
good password. Turtl has no restrictions on username/password length, we suggest
you take advantage of this.
- __When you invite someone to a board over email.__ Turtl has a feature that
allows you to invite someone to share one of your boards via email. Before
sending, you are able to set a shared secret for the invite, which makes the
invite useless unless the invitee enters the secret when they accept the invite
(this secret must be communicated to the invitee separately). Without setting
this secret, anybody who intercepts the invite email *will gain full access to
the board and its data*. If you want to share something but need it to be 
secure, set the secret and communicate it (via phone, text message, etc) to the
person you're inviting. Please note that the shared-secret method is not as
secure as RSA encryption (RSA is used when inviting an *existing* user to a
board), but it's a lot better than not having the shared secret at all (if you
care about privacy).
- __When someone you shared data with is compromised.__ If you share
notes, boards, or any other data with other Turtl users, you are giving them the
ability to decrypt those pieces of your data. It's possible that the person you
shared with isn't who you think they are, or they have a gun to their head and
have no choice but to expose your data. Be very careful about who you share
sensitive data with.
- __When your browser is compromised__. Turtl is a browser add-on (for now).
This means that all the code that runs it is protected against tampering (unlike
a website) and you know that when you install it, you're getting the actual
Turtl app. However, either through browser exploits or possibly even a malicious
third-party add-on, it's possible that your data could be exposed when you are
logged in.
- __When you have malware installed__. When you're logged in to Turtl, all your
unencrypted data is sitting in your computer's memory. It's possible that a
malicious program could gain access to the browser's memory and read your data.
Note that most operating systems have protections against this, but that doesn't
make it impossible.
- __When your operating system is compromised__. Although this may sound far
fetched, it's possible that your entire operating system itself is maliciously
programmed to send contents of memory from certain programs to certain corporate
headquarters or government agencies. If you really want to elminate this
possibility, use an open-source operating system (such as Linux or BSD), and an
open source browser when using Turtl (ie, Firefox).
- __When your hardware is compromised__. It's not outside the realm of
possibility that your computer's hardware is maliciously sharing the contents of
your memory to a third party. You could probably verify this using some sort of
packet sniffing on a second device connected to the network you're on.
- __When someone is holding a gun to your head__. Sometimes the easiest way to
get your data is to threaten you or your family. Turtl does have one interesting
feature: because the account username is not stored anywhere, it can be used
in multiple accounts. So having the username "andrew" with the password "1234"
would get you into one account, and the combo "andrew/4321" would get you into
another account. If you keep completely secret data in one account and *sort of*
secret data in the other, it's plausible that you could fool the person holding
the gun into thinking you've given them all your data. Just never tell anyone
about your second account.


