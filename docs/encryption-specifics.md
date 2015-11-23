---
layout: documentation
title: 'Encryption specifics | Documentation'
permalink: 'docs/encryption-specifics/'
---

<div class="breadcrumb">
<a href="/docs">Documentation</a> &raquo;
<a href="/docs/security">Security and encryption</a> &raquo;
Encryption specifics
</div>

# Encryption specifics
{% include toc.md %}

Behind the scenes, all encryption goes through the [Tcrypt library](https://github.com/turtl/js/blob/master/library/tcrypt.js),
which is the static class responsible for actually encrypting/decrypting data,
serialization into the standard format, data authentication, etc.

## Key generation

When you log in, Turtl takes your username (as a salt) and your password (as the
main input) and runs them through PBKDF2. It generates a 256-bit key using
100K iterations of SHA256.

This acts as your master key.

## Protected model
All models that use encryption extend the [Protected model](https://github.com/turtl/js/blob/master/models/_protected.js)
and use its methods for (de)serialization. This provides a single point
in the code for encryption/decryption/serialization/deserialization to occur.

The Protected model not only handles the encryption/decryption of data, but
also the encoding of key data into models and/or the finding of keys from the
user's keychain.

## Ciphers and modes
Turtl uses [SJCL](http://bitwiseshiftleft.github.io/sjcl/) for all low
level encryption.

The keys generated for all symmetric encryption are 256-bit and the block mode
used is [GCM](http://en.wikipedia.org/wiki/Galois/Counter_Mode).
When encrypting data via the Protected model (and by default otherwise), Turtl
always uses a random Initial Vector, generated via [crypto.getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues).

## Symmetric Serialization format
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

## Authentication

The authentication string given to GCM consists of `version`, `payload description`,
and `iv`. If any of these pieces of data are changed between encrypt and decrypt,
or the payload itself is changed in any way, the decryption fails and we throw
a `TcryptAuthFailed` exception.

## Asymmetric serialization format

Turtl now uses [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) for all
asymmetric crypto, and relies on that library's key generation and crypto
methods.

## Asynchronous/queued crypto

Almost all crypto in Turtl is asynchronous and runs through a queue. This queue
allows several hundred items to be decrypted simultaneously without overloading
the processor(s) running the app.

If the data having crypto applied is below a size threshold, the queue runs the
crypto job on the main thread. If the data is above a certain size, then the job
is farmed off to a background thread and run there. This works great in the case
of files, which often require long periods of time to encrypt/decrypt.

