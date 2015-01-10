# BYODG: Build Your Own Damn Grid!

## Description

BYODG is a project that demonstrates how to build your own grid instead of relying on one from a
library.

This grid is **not** intended for you to use in your projects. It is missing a few key features,
like life-cycle management (there are no `destroy` or `dispose` methods).

This grid **is** intended to show you not only how easy it is to build your own grid, but why you
should. Don't use jqGrid, FlexiGrid, Kendo Grid, Dojo Grid, EXT Grid... and don't even use this
grid. Build your own damn grid! In fact, don't use this code, **steal** the ideas!

Because of the visual relationship to the database, HTML data grids are one of the most common
widgets requested by business. But tabular data isn't enough, they tend to want a fixed header,
sorting, pagination, dynamic columns, and features, features, features, and more features.
Developers not wanting to "recreate the wheel" naturally reach for an off-the-shelf solution. 

The problem is it turns out Feature A doesn't work with Feature B, and Feature C is missing in
Library A, so you opt for Library C which is missing Feature A! All you have to do if implement
Feature A, right? WRONG! You're going to inevitably find great great difficulty modifying
someone else's code. Even if it is written well, chances are it is written to support hundreds if
not thousands of users; and hundreds or thousands of edge cases. It might even support IE6, which
means lots and lots of cruft in the code.

Build your own damn grid!

## What Should a Grid Do?

* Display tabular data
* Scroll
* Emit events
* That's all.

The base grid should do as little as possible. Integrating too many features is just bad
programming. It should be plugable, or extendable - some way of separating functionality.

## What Should a Grid **NOT** Do?

* Fetch data
 * This is something you should do yourself. Don't let a library talk you into their "Data Store". It will not be a one-size-fits-all solution.
* "Bind" to data
 * The grid should have a method that accepts an array of items that you pass to it. No need to make it any more complex than that.
* Display too much data
 * Infinite scrolling is stupid. Give your users a better way to find their data.
* Column resize
 * Maybe you do want this, but resizing doesn't always work with stretchy columns, dynamic columns, or a stretchy grid. Pick your poison.
* Inherit from 50 sub classes
 * Not all libraries do best practices. BYODG practices composition: features are instances, not inherited.
* About a million other things.

## How to Use this Project

This project is broken up into several branches, each of which is a step toward a full featured
grid. It starts from basic data-fetching, and finishes with a very simple grid with a plugin
system that can be modified, extended, and maintained.

Clone the project:

	git clone git@github.com:clubajax/BYODG.git
	
Then run `npm install` to get the dependencies. Do this before switching branches - not all the
branches maintain all files.

Use `git checkout b1` to check out the first branch and the others after:

1. Setup and Fetch Data
 * A "Hello World" to the project and dependencies. Included in the test folder is a dev-server. Start it from that folder in node: `node main.js`
1. Render a simple table
 * A table with a header that is not fixed. Most of the time this is all you need anyway.
1. Make it scrollable
 * Implement some basic CSS.
1. Fixed header
 * Now the CSS gets a bit more advanced.
1. Stretchy columns
 * Simply filling up the space.
1. Aligned Columns
 * This is main trick to scrollable grids.
1. Click Events
 * Event driven programming keeps things decoupled. The grid emits events that other objects can act upon.
1. Sorting
	Clicking the header will send sort options to the server.
1. Pagination
  * Pagination is actually a hard task, and the one here is not bullet proof, but works. It requires a lot of mundane math.
1. Editable Fields
 * While editing a field is not sending anything to the server, that step is something that can be done in your project easily.
1. Tab Indexes
 * Tab between cells like Excel, yo!
1. Refactor
 * After getting this far, the project was inspected and refactored, leaving the actual base grid as small as ever.

## FAQ

Q. Why should I build my own damn grid?
	
A. Because the base of a grid is simple and you can do it. Because grids always need customization,
and that's hard to do with someone else's code. ANYONE else's code.

Q. But I'm not a good enough developer to do it myself.

A. You will not have an easier time with someone else's grid.

Q. But I need *"Super Special Feature"* - and that's hard!

A. *"Super Special Feature A"* probably won't work with *"Super Special Feature B"* anyway.

Q. But I don't want to recreate the wheel!

A. That's a bad excuse to not write your own code.

## Dependencies

The grid depends on other clubajax projects. jQuery could theoretically be substituted, but...
while we are weaning ourselves off of grids, why not jQuery too?

## License

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>