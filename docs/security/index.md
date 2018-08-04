---
title: Security and encryption | Documentation
layout: documentation
permalink: 'docs/security/'
---

<div class="breadcrumb">
<a href="/docs">Documentation</a> &raquo;
Security and encryption
</div>

# Security and encryption

{% include toc.md %}

Turtl uses encryption to protect your data in such a way that only you, and
those you choose, are able to view your data. Keep reading for a high-level
overview of Turt's encryption and how it protects you.

## Encryption explained

Simply put, encryption is the process of scrambling data. Generally, this is
done using a "key" which is usually a passphrase. The only way to de-scramble
the data is using that passphrase.

Turtl's encryption works by generating a key for you based on your
email and password. This key is used to lock and unlock (or encrypt and
decrypt) your data and keep it private. All of the encryption in Turtl happens
before any data leaves the app, meaning that even if someone is snooping in on
your connection or someone hacks our database, everything you've put into Turtl
is just gibberish to them.

Without the keys that only you hold, your data is useless.

### Keys and sharing

As mentioned, Turtl creates a key for you when you log in based on your email
and password. It wouldn't be very useful if you had to give people this key when
you shared data with them because it would give them access to all your data.
Instead, Turtl generates a *new, random* key for each object. This key is what
is sent to people when sharing, allowing them to unlock the specific item you
send them and nothing else.

Keys are stored one of two ways:

1. __Spaces__. Space keys are stored in your "keychain" which is a collection of
keys stored with your profile. These keys are all encrypted using your master
key so *only you* are able to read your keychain.
1. __Notes/boards__. Notes and boards store their key in their own data, encrypted with the key of
the space they belong to. What this means is that once a user has access to a
space (and the space's key) they can also decrypt all the notes and boards in that space.
This allows sharing of entire spaces *without* having to share the key of each
note in that space.

## Encryption specifics

If you're looking for a more comprehensive look at how Turtl does encryption,
[check out the encryption specifics page](/docs/security/encryption-specifics) of the docs
which goes over the ciphers, block modes, and other methods Turtl uses when
handling your data.

[Encryption specifics &raquo;](/docs/security/encryption-specifics)

## When is Turtl *not* secure?

Here are some possible scenarios where Turtl's security measures will fail you.
We try to provide an exhaustive list so you're aware of the dangers of relying
on Turtl.

- __When we make mistakes__. That's right, we're human. It's entirely possible
that bugs in the Turtl client leave your data exposed, *especially* at our
early stage.
- __When you use a bad password__. Turtl encrypts just about everything before
sending it to the server. It does this using a cryptographic key based off of
your email and password. If you choose a password that's
short, predictable, easy to guess, etc then your data is *not safe*. Choose a
good password. Turtl has no restrictions on password length, we suggest
you take advantage of this.
- __When you invite someone to a space over email.__ Turtl has a feature that
allows you to invite someone to share one of your spaces via email. Before
sending, you are able to set a shared secret for the invite, which makes the
invite useless unless the invitee enters the secret when they accept the invite
(this secret must be communicated to the invitee separately). Without setting
this secret, anybody who intercepts the invite email *can gain full access to
the space and its data*. If you want to share something but need it to be 
secure, set the secret and communicate it (via phone, text message, etc) to the
person you're inviting. Please note that the shared-secret method is not as
secure as asymmetric encryption (used when inviting an *existing* user to a
space), but it's a lot better than not having the shared secret at all (if you
care about privacy).
- __When someone you shared data with is compromised.__ If you share
notes, spaces, or any other data with other Turtl users, you are giving them the
ability to decrypt those pieces of your data. It's possible that the person you
shared with isn't who you think they are, or they have a gun to their head and
have no choice but to expose your data. Be very careful about who you share
sensitive data with.
- __When you have malware installed__. When you're logged in to Turtl, all your
unencrypted data is sitting in your computer's memory. It's possible that a
malicious program could gain access to the app's memory and read your data.
Note that most operating systems have protections against this, but that doesn't
make it impossible.
- __When your operating system is compromised__. Although this may sound far
fetched, it's possible that your entire operating system itself is maliciously
programmed to send contents of memory from certain programs to certain corporate
headquarters or government agencies. If you really want to elminate this
possibility, use an open-source operating system (such as Linux or BSD).
- __When your hardware is compromised__. It's not outside the realm of
possibility that your computer's hardware is maliciously sharing the contents of
your memory to a third party.
- __When someone is holding a gun to your head__. Sometimes the easiest way to
get your data is to threaten you or your family. Turtl has no countermeasures to
protect against this, and it's up to you to make your own decisions.

