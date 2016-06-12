---
layout: documentation
title: "Contributing to Turtl"
permalink: "contributing/"
---

# Contributing to the Turtl project
{% include toc.md %}

Thanks for your interest in helping build Turtl! Turtl is an open-source project
owned and operated by [Lyon Bros. Enterprises, LLC.](https://lyonbros.com).

## Sign the Contributor License Agreement

In order for us to accept your contributions to the Turtl project, you need to
read and agree to the Contributor License Agreement. You can find the agreements
here:

- [Individual Contributor License Agreement](/contributing/icla)  
  For individuals wanting to contribute
- [Entity Contributor License Agreement](/contributing/ecla)  
  If you are contributing code as a member of a company, organization, or other
  entity, have someone from your organization who makes legal decisions sign
  this form.

## Project conventions

Please review the programming conventions used for Turtl's various projects
before you spend time writing code.

### Javascript

These conventions apply to the following projects:

- [js](https://github.com/turtl/js)
- [mobile](https://github.com/turtl/mobile)
- [desktop](https://github.com/turtl/desktop)
- [chrome-bookmarker](https://github.com/turtl/chrome-bookmarker)
- [firefox-bookmarker](https://github.com/turtl/firefox-bookmarker)

You will find these conventions draconian and upsetting, but please adhere to
them.

- __Underscores__: `use_underscores` instead of `camelCasing`. The exception is
  when defining top-level classes, which use `CapitalCamelCasing`.

  Example:
  
  ```js
  // good
  var user_settings = (new User()).get_settings();

  // good (defining a top-level class)
  var User = Composer.Model.extend({...});

  // nope
  var userSettings = ...;

  // nope
  function getAllNotes() ...
  ```

- __Tabs__: use `[tabs]` instead of `[spaces]`. Seriously, use tabs.
  If you have to drop an `if` into multiple lines, do it like so:

  ```js
  // good
  if(
      condition1 &&
      condition2
  ) { ... }

  // good
  if( condition1 &&
      confition2 ) { ... }
  ```

  where `condition1` would have a `[tab]` between it and the opening paren.

- __Braces__: Braces can be on the same line as your `if`/`function`/etc
  definitions. We drop them on the line below, but you are free do it as you
  please *as long as there is some kind of whitespace between the closing paren
  and the brace*.

  Examples:

  ```js
  // fine
  function test(arg1, arg2) {
      ...
  }

  // fine
  if(condition)
  {
      ...
  }

  // one-line functions are fine
  var cb = function(err, res) { ... };

  // nope. please use readable whitespace
  function test(arg1,arg2){
  }
  ```

- __Promises__: Turtl makes heavy use of Promises (specifically, the [Bluebird](http://bluebirdjs.com/)
  library) for just about all asynchronous processing. If you find yourself
  writing functions that take a `function(err, res) {}` callback, please make
  use of a promise instead, unless there is a specific documented reason for not
  doing so.

#### Third-party libraries

Turtl strives to use *as little third-party code as possible* in its front-end
clients. The reason for this is that each library that *is* included has to be
vetted for possible security leaks.

For this reason, if you do feel a third-party library would suit the project,
please note this in your pull request. Put your third-party libraries directly
into the source tree and version them. If the third-party library makes any
kind of AJAX calls, form posts, writes any scripts to &lt;head&gt;, or makes
any other outbound connection, there is a very good chance your changes will not
be merged.

Dependency management tools like bower/npm/etc are not to be used or included
in the javascript-based projects.
Note that we do use npm to power some aspects of the build system (lessc,
handlebars, postcss, etc) but under no cirumcstances does it download code to
be included in the app itself.

Please note that third-party libraries included in Turtl cannot be licensed
copyleft (eg, GPLv3). This prevents us from relicensing Turtl, for instance
if we want to release an app in the Apple iOS store. MIT/BSD
licenses are strongly favored, but others will be considered on a case-by-case
basis.

Please make sure any third-party code you include contains the license it uses
in its source file(s).


### Common lisp

These conventions apply to the following projects:

- [api](https://github.com/turtl/api)

The conventions for common lisp largely follow the community standard:

- __Spaces__: indent code with two spaces.

- __Parens__: Don't close parens on a different line, close them on the last
  line they apply to:

  ```lisp
  ;; good
  (defun test ()
    (run-test))

  ;; bad
  (defun test ()
    (run-test)
    )
  ```

- __Dashes__: Don't use camelCasing or\_underscores in your function or variable
  names. Please use-dashes:

  ```lisp
  ;; good
  (defun my-function ()
    ...)

  ;; good
  (let ((my-var 69))
    (process-var my-var))

  ;; bad
  (defun doStuff ()
    ...)

  ;; bad
  (defun hai_there ()
    (say_hai))
  ```

## Trello

Need something to do? [Check out our Trello list](https://trello.com/b/yIQGkHia/turtl-product-dev).
You can pick anything off any of the lists you'd like to tackle (besides,
obviously, the "Complete" list :)). Keep in mind that the Turtl team may be
working on items in the "Dev" list, so reach out to us before grabbing any items
from Dev.

## Questions

If you have questions on any of the above, or run into a situtation that isn't
covered, please [reach out to us](/contact)! We're here to help.

