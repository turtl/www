---
layout: documentation
title: 'Encryption specifics | Documentation'
permalink: 'docs/security/encryption-specifics/'
---

<div class="breadcrumb">
<a href="/docs">Documentation</a> &raquo;
<a href="/docs/security">Security and encryption</a> &raquo;
Encryption specifics
</div>

# Encryption specifics
{% include toc.md %}

This page will explain the specific algorithms and methods Turtl uses to encrypt,
decrypt, (de)serialize, and authenticate data.

## Methodology

Every encrypted object in Turtl has its own key. This goes for both boards
and notes. This means that every object can be decrypted independently of the
profile's master key (generated from the user's authentication info).

Encrypted objects have the ability to store their own key in their data,
encrypted via another object's key. Sounds confusing, so the primary example
would be this: Note A has its own key that will decrypt its data. Note A is in
Board B. Note A's data contains Note A's key encrypted with Board B's key. So
if Alice shares Board B with Bob, she can share Board B's key, and now Bob has
the ability to decrypt any note in Board B (including Note A).

This is what allows objects to be sharable in Turtl without compromising the
master key...sharing can be done granularly and on a per-object basis. That said
the only objects that are currently sharable in Turtl are boards.

It's important to note that as of v0.6.0, all encrypted objects put their key
in the user's keychain, whether they can be decrypted by a parent object or not.
This allows notes to be in zero boards and still be decryptable. On top of this,
the keychain gives top-level objects a place to store their key outside of their
own data. This makes it easy to change a user's password: all that's required is
to regenerate their key and re-encrypt and save their keychain entries.

## Protected model
All models that use encryption extend the [Protected model](https://github.com/turtl/js/blob/master/models/_protected.js)
and use its methods for (de)serialization. This provides a single point
in the code for encryption/decryption/serialization/deserialization to occur.

The Protected model not only handles the encryption/decryption of data, but
also the encoding of key data into models and/or the finding of keys from the
user's keychain (or from parent objects).

## Tcrypt

Short for TurtlCrypt, [Tcrypt is the main encryption library](https://github.com/turtl/js/blob/master/library/tcrypt.js)
is the main encryption library for the app. It provides a standard interface for
encrypting/decrypting objects and keys, and manages the versioning of previous
data.

All encryption, decryption, hashing, key generation, and random number
generation go through Tcrypt.

## Algorithms

Turtl uses all standard algorithms for key generation, encryption, and
decryption: PBKDF2 for key generation, AES-GCM for encryption/decryption, and
OpenPGP for asymmetric crypto and sharing. Let's get in for a closer look!!

### Key generation

When you log in, Turtl takes your username (as a salt) and your password (as the
main input) and runs them through PBKDF2. It generates a 256-bit key using
100K iterations of SHA256.

This acts as your master key.

### Ciphers and modes
Turtl uses [SJCL](http://bitwiseshiftleft.github.io/sjcl/) for all low
level encryption.

The keys generated for all symmetric encryption are 256-bit and the block mode
used is [GCM](http://en.wikipedia.org/wiki/Galois/Counter_Mode).
When encrypting data via the Protected model (and by default otherwise), Turtl
always uses a random Initial Vector, generated via [crypto.getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues).

### Symmetric Serialization format
Tcrypt packs data in the following binary format:

~~~
|-2 bytes-| |-1 byte----| |-N bytes-----------| |-16 bytes-| |-N bytes----|
| version | |desc length| |payload description| |    IV    | |payload data|
~~~

1. __Version__ - The serialization version. Lets tcrypt know how this data was
serialized and how to parse it.
1. __Description length__ - How many bytes long the payload description is.
1. __Payload description__ - Describes the cipher used, the block mode, the 
padding method, the key derivation method, and possibly more. These are just
array indexes of the items at the top of [tcrypt.js](https://github.com/turtl/js/blob/master/library/tcrypt.js),
with the `*_index` key names.
1. __Initial vector__ - The IV this payload uses.
1. __Payload data__ - Our actual encrypted data, in binary form. Note that before
encryption, the payload as a UTF8 byte prepended to it. This byte is random, but
if `u <= 128` then the payload is binary, and if `u > 128` then the payload is
UTF8 encoded and needs to be decoded post-decryption. This allows us to NOT
blanket encode things, which in the case of files, can sometimes double the size
of the payload.

### Authentication

The authentication string given to GCM consists of `version`, `payload description`,
and `iv`. If any of these pieces of data are changed between encrypt and decrypt,
or the payload itself is changed in any way, the decryption fails and we throw
a `TcryptAuthFailed` exception.

### Asymmetric serialization format

Turtl now uses [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) for all
asymmetric crypto, and relies on that library's key generation and crypto
methods.

