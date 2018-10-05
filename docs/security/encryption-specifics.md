---
layout: documentation
title: 'Encryption specifics | Documentation'
permalink: 'docs/security/encryption-specifics/'
---

# Encryption specifics
{% include toc.md %}

<ul class="uk-breadcrumb uk-padding-small uk-padding-remove-vertical uk-padding-remove-right">
<li><a href="/docs">Documentation</a></li>
<li><a href="/docs/security">Security and encryption</a></li>
<li>Encryption specifics</li>
</ul>

This page will explain the specific algorithms and methods Turtl uses to encrypt,
decrypt, (de)serialize, and authenticate data.

## Subkeys and sharing

Every encrypted object in Turtl has its own key. This goes for spaces, boards,
and notes. This means that every object can be decrypted independently of the
profile's master key (generated from the user's authentication info).

Encrypted objects have the ability to store their own key in their data,
encrypted via another object's key. Sounds confusing, so the primary example
would be this: Note A has its own key that will decrypt its data. Note A is in
Space B. Note A's data contains Note A's key encrypted with Space B's key. So
if Alice shares Space B with Bob, she can share Space B's key, and now Bob has
the ability to decrypt any note in Space B (including Note A).

This is what allows objects to be sharable in Turtl without compromising the
master key...sharing can be done granularly and on a per-object basis. That said
the only objects that are currently sharable in Turtl are spaces.

## Algorithms

As of v0.7.0, Turtl now handles all encryption in [the Turtl core](https://github.com/turtl/core-rs),
which uses [libsodium](https://download.libsodium.org/doc/) under the hood for
all cryptographic operation.

### Key generation

When you log in, Turtl takes your email (as a salt) and your password (as the
main input) and runs them through libsodium's default key-derivation function
(scryptsalsa208sha256).

The resulting key is your account's master key.

### Ciphers and modes

Turtl uses [libsodium](https://download.libsodium.org/doc/) for all low
level encryption. Symmetric encryption uses the chacha20poly1305 (IETF)
algorithm, and asymmetric crypto uses the more abstract [libsodium sealed box](https://download.libsodium.org/doc/public-key_cryptography/sealed_boxes.html).

### Symmetric Serialization format
Turtl packs encrypted data in the following binary format:

~~~
|-2 bytes-| |-1 byte----| |-N bytes-----------| |-1 byte-----| |-N bytes-| |-N bytes--|
| version | |desc length| |payload description| |nonce length| |  nonce  | |ciphertext|
~~~

1. __Version__ - The serialization version. Lets tcrypt know how this data was
serialized and how to parse it.
1. __Description length__ - How many bytes long the payload description is.
1. __Payload description__ - Describes the cipher used in this payload.
1. __Nonce__ - The nonce this payload uses.
1. __Ciphertext__ - Our actual encrypted data, in binary form.

### Authentication

The chacha20poly1305 algorithm handles payload authentication internally, which
means that the `ciphertext` itself has a tag used to verify that it has not been
modified in any way.

### Asymmetric serialization format

Data encrypted with the sealed box algorithm is int he following format:
~~~
|-1 byte--| |-N bytes--|
| version | |ciphertext|
~~~

Note that because the sealed box handles the serialization for us, our own
format is painfully simple, and just includes a version that lets us switch
algorithms/formats later on if needed.

