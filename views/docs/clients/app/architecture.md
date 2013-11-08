---
title: Architecture | App | Clients | Documentation
layout: documentation
---

<div class="breadcrumb">
    <a href="/docs">Documentation</a> &raquo;
    <a href="/docs/clients/index">Clients</a> &raquo;
    <a href="/docs/clients/app/index">App</a> &raquo;
    Architecture
</div>

# Architecture
{{toc}}

The Turtl app is set up as an MVC (Model View Controller) application written in
Javascript. The idea behind it is that "models" are representations of data.
When a model changes, it signals that change using an event, and anyone
listening (other models, collections of models, or controllers) will be able to
act on that. Controllers are responsible for rendering and updating views based
on the events they listen to. Events are the fabric the entire app is woven
from.

## Data profile
Just about all of a user's profile is stored as collections or models in the
`Profile` model. This includes boards, notes, personas, etc...anything that's
part of a user's data profile is stored here.

The Profile model can be accessed via `turtl.profile` and is set up as a
"relational" model. This means that any data added to it automatically has
models and collections created (as opposed to just flat javascript objects).

If you wanted to get a user's boards, you'd do

```javascript
turtl.profile.get('boards');
```

The same goes for the notes:

```javascript
turtl.profile.get('notes');
```

### Structure
The profile holds the following items:

- __keychain__ - Holds all keys for a user's boards (owned or shared)
- __boards__ - Holds all the boards a user has access to (owned or shared)
  - __tags__ - A collection of all the tags of all the notes in this board
  - __notes__ - A [filtercollection](#filtercollections) holding all this
    board's notes
  - __personas__ - A collection of all the personas this board is shared with
- __notes__ - Holds all of a user's notes (as a flat collection)
  - __tags__ - A collection of all the tags this note has
- __personas__ - Holds all of a user's personas

### FilterCollections
A FilterCollection is an object that listens to another (master) collection. It
filters the items that are added, removed, or changed in the master collection
and applies those changes to itself. It also has the ability to sort models,
filter mased on the data the models contain, and limit the amount of models it
holds.

This is esoteric, so here's an example: `turtl.profile.get('notes')` holds *all*
of a user's notes that are currently in memory. Each of these notes belongs to a
board, but instead of manually adding the correct note into the correct board
based on the note's `board_id`, we get just set up a FilterCollection in the
board that automatically finds the right notes. The FilterCollection would use
`turtl.profile.get('notes')` as the "master" collection and use a filter to
weed out any notes that are *not* a member of the board. 

This way, models can be automatically placed in the right collections completely
automatically just based on the data they hold.

## Controllers
The controllers in Turtl are responsible for displaying the templates and views,
listening for events from both views and models, and acting on those events
accordingly.

For instance, a controller may call `render()` on itself if its model triggers a
`change` event. Or the controller may call its `submit_form()` method if the
user clicks a submit button in a form that the controller displays.

The controllers all exist under the app's `controllers/` folder and generally
have self-explanatory names.

## Local storage
Turtl mirrors your profile locally using IndexedDB. All changes that happen to
your data flow through the local db whether they are triggered by you or coming
from the API syncing data to your profile.

When you save a note (or other data) in the Turtl app interface, it triggers a
`save()` on the corresponding model. The `save` method saves the model's data to
the local DB, marking it as recently modified. This allows other parts of the
app to locate data that has recently changed and apply those changes where
needed (or sync the changes to the API).

To read more about local storage, check out the [Local storage/syncing section](/docs/clients/app/local_db)
of the docs.

