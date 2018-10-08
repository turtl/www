---
layout: page
title: "Privacy"
permalink: "privacy/"
---

Last update: __December 8, 2015__

Privacy
=======

We have created this page to explain, very clearly and without legal speak, how
we collect and use your information while the Turtl app is connected to our
servers.

Note that this document will update as new features are added to Turtl. However,
parts of this document that state that something will *never* happen will not be
changed in any material way other than to clarify any possible ambiguity. When
we say never, we mean it.

## Information collection

Times when Turtl collects user information:

- When users join Turtl. They do so with a username and password: the username
  is currently never sent to the servers, but in future versions may be sent in
  plain text to our servers. The password, along with the username, create two
  pieces of data: an authentication token used to verify that the user logging
  in is the same user we have on our servers, and a master key used to encrypt
  and decrypt your profile. The master key is never sent outside of the Turtl
  app. The authentication token is created by one-way hashing the username and
  password and then encrypting using the master key. It does not contain any
  personally identifiable information, nor can any be reversed from the token.
- When users add a persona. Personas allow your account, which is private by
  default, to be shared with by other people. So when you create a persona,
  Turtl asks for an email address (required), name (optional), and in the future
  possibly more optional fields (such as an avatar photo).
- When you add data to your profile. The notes/bookmarks/files you add will all
  be encrypted (in the client) then sent to the Turtl service (where all your
  data remains encrypted). Your data is only ever decrypted when inside the
  application, and the only way to decrypt your profile is with your master key
  or if you purposefuly share with another person. Your profile cannot even be
  read by us.

## Information sharing/disclosure

Times when Turtl shares your information:

- When you successfully log in to your account, Turtl will download your data
  profile (notes/bookmarks/files) to your local computer, in encrypted form,
  and then decrypt your data when it arrives.
- When someone is searching for your email in the sharing interface, Turtl will
  indicate whether or not the email typed in belongs to a current Turtl persona.
  However, one must be logged in to the Turtl service to perform this search,
  and there is no way to search multiple emails based on a wildcard. An email
  must be known beforehand.
- When United States law enforcement or a government agency has a court order 
  or warrant which mandates that we share information on a specific user, we
  must comply. However, keep in mind that your data profile remains encrypted
  during this process. We have no way to decrypt your data, and most likely
  neither does any law enforcement agency. Whether or not you choose to share
  your encryption key with them is your decision.

The above may change, but with the restriction that Turtl will never share your
information with any third party other than a law enforcement agency which has
a valid, legal court order mandating us to turn over information. We will not
give your information to third parties.

## Advertisement

Turtl has no third-party advertisements of any kind. Turtl will never have any
form of third-party advertisement. Doing so would cripple the security measures
Turtl takes to protect your information.

At times, Turtl may advertise, endorse, or promote features or other products,
but at no time will any third-party advertiser be allowed to place any hooks
into our codebase. Any advertisements run on the Turtl application will be run
by Turtl and no one else.

