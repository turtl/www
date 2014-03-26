---
title: Encryption | Core | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    <a href="/docs/clients/core/index">Core</a> &raquo;
    Encryption
</div>

# Encryption
{{toc}}

As mentioned in the [architecture overview](/docs/clients/core/architecture),
Turtl is an MVC application. All models that use encryption in the core extend
a model called [Protected](https://github.com/turtl/js/blob/master/models/_protected.js).
The Protected model provides all the abstracted methods used for encrypting and
decrypting data.

Behind the scenes, all encryption goes through the [Tcrypt library](https://github.com/turtl/js/blob/master/library/tcrypt.js),
which is the static class responsible for actually encrypting/decrypting data,
serialization into the standard format, data authentication, etc.

## Ciphers and modes
Turtl uses [SJCL](http://bitwiseshiftleft.github.io/sjcl/) for all low
level encryption.

The keys generated for all symmetric encryption are 256-bit and the block mode
used is [GCM](http://en.wikipedia.org/wiki/Galois/Counter_Mode).
When encrypting data via the Protected model (and by default otherwise), Turtl
always uses a random Initial Vector, generated via [crypto.getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues).

## Symmetric Serialization format
Tcrypt packs data in the following binary format:

```
|-2 bytes-| |-1 byte----| |-N bytes-----------| |-16 bytes-| |-N bytes----|
| version | |desc length| |payload description| |    IV    | |payload data|
```

1. __Version__ - The serialization version. Lets tcrypt know how this data was
serialized and how to parse it.
1. __Description length__ - How many bytes long the payload description is.
1. __Payload description__ - Describes the cipher used, the block mode, the 
padding method, the key derivation method, and possibly more. These are just
array indexes of the items at the top of [tcrypt.js](https://github.com/turtl/js/blob/master/library/tcrypt.js),
with the `*_index` key names.
1. __Initial vector__ - The IV this payload uses.
1. __Payload data__ - Our actual encrypted data, in binary form.

## Asymmetric serialization format
Tcrypt.asym packs data in the following binary format:
```
|-2 bytes-| |-96 bytes-| |-N bytes----|
| version | |   tag    | |payload data|
```

1. __Version__ - The serialization version (independent of `version` in the
symmetric serialization format). Lets tcrypt know how to process/decrypt this
data.
1. __Tag__ - A public value used with a private ECC key to generate a symmetric
AES decryption key.
1. __Payload data__ - Our encrypted data in binary form. This is AES-256/GCM
encrypted, using the key derived from the ECC public key.

## Protected model
As mentioned at the top, all models that use encryption extend the Protected
model and use its methods for (de)serialization. This provides a single point
in the code for encryption/decryption/serialization/deserialization to occur.
The Protected model deals in synchronous, symmetric encryption.

The Protected model not only handles the encryption/decryption of data, but
also the encoding of key data into models and/or the finding of keys from the
user's keychain.

### ProtectedThreaded
The ProtectedThreaded model extends Protected, but does so in a way that
converts serialization/deserialization into an asynchronous background thread.
This is great for encrypting or decrypting large amounts of data without
blocking the main thread (files, for instance).

### ProtectedShared
The ProtectedShared model extends Protected, but uses the asymmetric functions
of tcrypt (`tcrypt.asym`) to do encryption. This allows use of public/private
key pairs when doing encryption/decryption, perfect for messaging between a
pair of users.

## Encrypted messaging
When sending a message (ie, a board key) to a persona, Turtl uses ECC (384 bit)
to do so.  The public key of the recieving persona is used to encrypt a random
key (the key used to encrypt the message body). The private key of the recieving
persona is then used to retrieve the key and decrypt the message.

This all happens automatically using the [ProtectedShared](#protectedshared)
model, which is specially equipped to handle asymmetric encryption.

