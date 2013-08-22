---
title: Security
layout: default
---

{{toc}}

# When is turtl *not* secure?

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

# Turtl security overview

Note that while Turtl employs standard encryption practices (AES, RSA), we do
not believe this provides "security" (yet). Turtl is very, very new and needs to
be vetted by the community before being called secure.

Turtl was built on the principal that everything that can be encrypted should
be. All encryption is centralized through one class, providing both a central
audit point and an easy place to run data upgrades if needed.

The following will provide a somewhat techical overview of how we use encryption
in the system.

## Subkeys and sharing

Turtl uses symmetric (AES) encryption for all data (besides data explicitely
advertised as public, such as personas). This means that if you want to share a
piece of data with someone, such as a board or a note, they have to have the key
to decrypt it.

Instead of giving people your master key willy-nilly, we employ the concept of
subkeys: a key for each piece of data. So a user will have their own "master"
key (derived from their username/password), a board will have its own key that
decrypts the board's data, and a note will have its own key for decrypting the
note. 

This way, if I want to share a piece of data with you, I send that data's key,
not my master key.

Notes store their own key in their data, encrypted using the board's key.
What this means is that having a board's key can unlock all notes within that
board, making board sharing easy.

## Authentication data

Your account details (both username and password) are hidden, always. When you
join Turtl, your username and password are hashed, encrypted with the key
resulting from your username/password, and then stored on the server for account
verification purposes. This is essentially a blob of random data that even if
decrypted would not have your auth info (it's just a hash).

It should go without saying: __never share your username or password.__ Ever.
Not to us, and especially not people pretending to be us ;-).

Since Turtl is a crypto-system, should you lose your username or password, your
data will forever be locked away. Forever. You will never, ever, get it back.

_Remember your username and password_. Our official advice is to use an
encrypted password manager to store your credentials.

## Personas

Personas are what enable sharing. Since your username and password are hidden,
people need a way to identify you on Turtl (or sharing would be a seldom-used
feature).

Personas give a face to your account. They attach an email address to your
account, allowing people to find you. Each persona also has a public/private RSA
key pair associated with it. This allows other users to send you private data
(such as a board key when they share a board with you) without anybody but you
being able to read it. Your persona's name, email, and public key are all stored
plaintext in the database. All other persona data (like the private key) is
encrypted using your master account key (like all your other data).

Also note that the link between a persona and an account is obscured. This means
that it's not possible for someone to tie your personas to your account just by
looking at the database. *However* someone who has access to server running the
Turtl backend (the thing that the add-on communicates with) would be able to
infer connections between your account and your persona. Do not bet your life on
a third party not being able to tie your different personas together.

Also, for now, an account can only have one persona. This may or may not change
in the future.

