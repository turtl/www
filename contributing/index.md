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

## Translations

Would you like to translate Turtl to your language? Thanks for helping out! We
love being multi-lingual.

First, check if someone has already started translating in your language by
looking through the [existing translations](https://github.com/turtl/js/tree/master/locales).

If there's one for your language/locale already, feel free to make any updates
to the file and submit a pull request.

If you language/locale isn't there, copy the [latest language template file](https://github.com/turtl/js/blob/master/locales/locale.js.template)
to a new file witht he format `<language code>_<locale code>.js` (if your
language doesn't have a specific locale code, just use the language code again).
For example, a Spanish translation in the Mexican locale would be `es_mx.js`.

Now just fill in what you can and submit a pull request on Github! Keep in mind
that translations are significant contributions, and therefor you must [sign the CLA](#sign-the-contributor-license-agreement)
before new translations can be accepted.

## Project coding conventions

Please review the programming conventions used for Turtl's various projects
before you spend time writing code.

### Javascript

These conventions apply to the following projects:

- [js](https://github.com/turtl/js)
- [android](https://github.com/turtl/android)
- [desktop](https://github.com/turtl/desktop)
- [browser-extension](https://github.com/turtl/browser-extension)

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

- __Tabs__: use `[tabs]` instead of `[spaces]`. If you are using Sublime Text,
  you are most likely not using tabs, even if you think you are.
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

- __Whitespace__: Please use readable whitespace.

  Examples:

  ```js
  // fine
  function test(arg1, arg2) {
      ...
  }

  // fine (dropped braces are OK)
  if(condition)
  {
      ...
  }

  // one-line functions are also fine
  var cb = function(err, res) { ... };

  // nope. please use readable whitespace
  function test(arg1,arg2){
  }

  // nope. use whitespace!
  var obj = {
      key:val1,
      key:val2,
  };
  ```

- __Variable declarations__: `var`-per-declaration is the preferred method, but
if this is against your normal style, that's ok. One thing that will not be
tolerated is leading commas.

  Examples:

  ```js
  // good
  var my_data = get_some_data();
  var success = send_some_data(data);

  // if you must.
  var my_data = get_some_data(),
      success = send_some_data(data);

  // Not allowed (leading commas, ugh)
  var my_data = get_some_data()
    , success = send_some_data(data);
  ```
- __Trailing commas__: Either leave them at the end of the line on the last item
  or take the trailing comma off. Do *NOT* put the comma before the item.

  Examples:

  ```js
  // good (trailing comma on last item is great A+++)
  var obj = {
      name: 'andrew',
      hates: 'leading commas',
      seriously: 'do not do it',
  };

  // good (no trailing comma on last item also fine)
  var obj = {
      name: 'slappy',
      friends: 0
  };

  // NO. never.
  var obj = {
        name: 'andrew'
      , hates: 'leading commas'
      , seriously: 'your code will be roundly rejected'
  };
  ```

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

### Rust

Our Rust code follows the standard Rust conventions, but I'll list some of the
bigger ones here:

- __Indent with two spaces__: Please follow this. All of our code uses two-space
indendation and if you use tabs or four spaces or anything else, you will be
asked to re-tab.

- __Use underscores__: No camelCase. This is a hard rule.
  
  Examples:

  ```rust
  // good
  fn get_data() -> u32 {
    0
  }

  // bad
  fn thisIsNotJava(orCSharp: u32) -> { ... }
  ```

## Issue tracker

Our [Github issue tracker](https://github.com/turtl/tracker/issues) covers all
of the Turtl projects. We used to have a tracker-per-project, but this was
confusing to users and difficult for us to manage. Now everything lives in one
place.

### Looking to contribute?

We have marked [a list of items in our issue tracker you can help with](https://github.com/turtl/tracker/issues?q=is%3Aissue+is%3Aopen+milestone%3A%2A+label%3Astatus%3Ahelp-wanted)!

This includes all items with the `help-wanted` tag that are a part of one of
our milestones. There are some issues that are very core to the app and
require intimate knowledge of its inner workings, and these are generally not
marked with `help-wanted`.

Please ask before working on issues that do not have a milestone as these are
generally meant to track ideas that haven't been fully realized or "maybe"
features that we want to consider but haven't decided to include yet.

Once again, *if you work on issues that are not part of a milestone, chances are
your PR will be rejected*. When in doubt, pull issues off the [help wanted list](https://github.com/turtl/tracker/issues?q=is%3Aissue+is%3Aopen+milestone%3A%2A+label%3Astatus%3Ahelp-wanted)!

## Questions

If you have questions on any of the above, or run into a situtation that isn't
covered, please [reach out to us](/contact)!

