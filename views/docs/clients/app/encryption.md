---
title: Encryption | App | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    <a href="/docs/clients/app/index">App</a> &raquo;
    Encryption
</div>

# Encryption

{{toc}}

## Ciphers and modes
- AES 256
- CBC
- random IV on each encrypt

## Authentication

- HMAC
- sub-key derivation (master key used to derive HMAC and encryption key)

## Serialization format

show format (via github)

## Tcrypt/Protected model

- link architecture#mvc
- central point of encryption for all data
