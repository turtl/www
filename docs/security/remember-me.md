---
layout: documentation
title: 'Stay logged in | Documentation'
permalink: 'docs/security/remember-me/'
---

# Stay logged in
{% include toc.md %}

The Turtl app has a feature called "Stay logged in" that remembers your previous
login and logs you in automatically when opening the app. This feature trades
security for convenience for people with longer passwords who don't want to log
in by hand each time.

Stay logged in uses the concept of login tokens: an object that store's the user's
id, master key, auth token, and username. This is essentially a "key" to log in.
It does not include the user's password, but it can be used to log in to the
user's account.

Below are some of the platform-specific ways that "Stay logged in" works.

## Desktop

On desktop, when the user logs in (and has "Stay logged in" checked) the user's
login token is encrypted and saved to disk. The key that encrypts the login
token is handed back to the desktop app, and it stores this in a simple on-disk
storage called "localStorage" which is stored in plaintext on the disk.

This means that anybody with read access to the user's home directory (the
default location of the app's files) can access the key that decrypts the user's
login token and can gain access to their account.

This risk can be mitigated by using drive encryption, however any malicious
program that is able to run under your user will be able to steal your login
token.

If you value the security of your account, **it is recommended *not* to use
"Stay logged in" on desktop!**

## Android

On desktop, when the user logs in (and has "Stay logged in" checked) the user's
login token is encrypted and saved to disk. The key that encrypts the login
token is handed back to the Android app, and it encrypts this key using the
[Android Keystore](https://developer.android.com/training/articles/keystore)
and stores the encrypted key into the app's preferences.

This means that in order to decrypt the key for the login token, an attacker
would need root access to the Android phone.

It is recommended that you encrypt your device and *not* root your phone if
using "Stay logged in" on Android. Also, it is safer if you use a device that
has TEE/TPM hardware, which more actively protects the Keystore from leaking
keys.

