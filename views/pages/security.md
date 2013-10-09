---
title: Security
layout: default
---

{{toc}}

# Encryption explained
As mentioned in [the about page](/about), the Turtl add-on encrypts all your
data before it leaves the browser. What this means is that you add a note,
image, or bookmark via Turtl and what happens next is that the add-on scrambles
the data you just added. It does this in a way that makes your data completely
unreadable and unrecoverable, unless you have the key to de-scramble it. This
key is generated for you when you add the note, and is only accessible using
your "master key" which based on your username/password.  This process of
scrambling is known as encryption, and using your key to unlock your data is
known as decryption.

Once your data is encrypted it's sent to the Turtl storage system, making it
accessible to you from other computers or devices. When your data is moving
between your browser and Turtl's servers, it's encrypted again via TLS (the
same encryption your bank uses when you log in), which protects it from prying
eyes while en route to being stored. Once your data is stored, it stays
completely encrypted (remember, we don't have the keys to your data, only you
do). The only way to get the data out is to log in via the Turtl add-on,
download your data (again, over TLS), and decrypt it *inside of the Turtl
add-on*.

Effectively, this gives you a private place to put data that you (and only you)
can access...and you can access it *anywhere*.

# When is Turtl *not* secure?

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

# Turtl security overview

Note that while Turtl employs standard encryption practices (AES 256, RSA 3072),
we do not believe this provides "security" (yet). Turtl is very, very new and
needs to be vetted by the community before being called secure.

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

## Sharing over email

As mentioned above in [When is Turtl *not* secure](#when-is-turtl-not-secure),
Turtl has a feature that allows inviting people to share content over email.
While this is not nearly as secure as sharing using the built-in messaging
system (which uses RSA encryption), it is a necessary feature for those who
don't necessarily need higher levels of information securty but want to use the
collaborative aspects of Turtl.

Here's a rundown of how it works: you want to share a board with your friend.
Your friend isn't signed up on Turtl (at least, the email address you have for
her isn't registered to a persona), so you initiate a board invite over email.
What happens next is Turtl generates a random string which will be used to
generate an AES key (we'll call it the invite key). The resulting AES key is a
combination of the random string (which is sent to the server along with the
other invite data) and the shared secret (if one is entered). The shared secret
never leaves the client. The invite key (remember, random string + shared secret)
is then used to encrypt the key of the board being shared (see [Subkeys and
sharing](#subkeys-and-sharing) above). This encrypted board key, the random
string used to generate the invite key, and the invitee's email are sent back to
the server, which stores the all the invite information (*except the random
string*) and sends an email containing an invite code (last 7 digits of a hash
of the current time, the invitee's email, and a crypto-secure random number),
the invite ID (deterministic SHA256 value of the board's ID + the invitee's
email), and the random string to the invitee (all of the above is in a link,
of course). Note that Turtl purposefully splits up the random string and the
encrypted board key in the case the database is compromised.

This email contains all the information to download the invite (including the
encrypted board key) and accept the invite (giving the invitee access to the
board and its data). When the user clicks the link in the email, they are taken
to a page that lets them download the add-on for their favorite browser. The
add-on, on install, detects that it's on an invite page and saves the invite
for later (until the user has joined/logged in).

It's important to note that if a shared secret is not used and the email sent to
to the invitee is intercepted OR the invite data sent from the client to the
server is intercepted, *it can be used to gain full access to the board and all
its data*. If you care about security at all, use the shared secret. If you
*really* care about securty, don't share over email...only share with someone
who has a persona registered on Turtl already. Remember, sharing between
existing personas uses RSA encryption!

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

Also, for now, an account can only have one persona. This may or may not change
in the future.

## Encryption libraries

Turtl uses [CowCrypt](https://github.com/rubbingalcoholic/cowcrypt) for all
encryption. All AES keys are 256-bit, generated using PBKDF2 with SHA256, 400 
iterations. All RSA keys are 3072-bit. All random numbers are generated using
`crypto.getRandomValues`.

Turtl uses a [single object](https://github.com/turtl/js/blob/master/library/tcrypt.js)
to wrap all low-level encryption, and a [higher-level model](https://github.com/turtl/js/blob/master/models/_protected.js)
(known as "Protected") for handling subkeys, (de)serialization, and asymmetric
encryption. All models using encryption extend the Protected model and use its
functions. Some models use tcrypt directly for various tasks, such as key/hash
generation, (de)serializing tcrypt binary keys, and certain RSA key operations.
