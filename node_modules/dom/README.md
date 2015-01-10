# dom

## Description

`dom` is a convenience library for common DOM methods. Its primary function is to make it more
finger-friendly to create, modify, and delete DOM nodes, and to add and remove styles and attributes.
There is some extended functionality as noted in the API docs below.

## Support

`dom` supports modern browsers, IE9 and up. Some modern DOM methods like `classList` are expected.

This library uses UMD, meaning it can be consumed with RequireJS, Browserify (CommonJS),
or a standard browser global.

## Installation

You can clone the repository with your generic clone commands as a standalone repository or
submodule.

	git clone git://github.com/clubajax/dom.git

It is recommended that you set the config.path of RequireJS to make `dom` accessible as an
absolute path. If using as a global or with Browserify, it is suggested that you use an
*NPM run script* to copy the `dom` script to a location more convenient for your project.
	
`dom` has no dependencies.

## Comes with Stub Included!

The benefit of using `dom` exclusively in your code, is it comes complete with a "dom stub",
which can be substituted in Node.js unit tests.

The stub is as described, a stub, meaning most of the functions are NOOPs. But there are a few
functions that work as mocks, meaning they are functional with dummy/partial data. Simple objects
are returned as dom nodes, which should result to truthy in tests. These simple objects have an
`innerHTML` getter/setter so text comparisons can also be done. They also keep track of their
children and parent nodes, so some DOM manipulation can be simulated.

It is reccomended that the stub/dom.js should be looked over to learn of its full functionality.

## The `dom` function

`dom` is the main function, and has several more functions attached to that function. So you can
create a node with the main function like:

	dom('div');
	
And you could access nodes with the `byId` attached function, like:

	var node - dom.byId('my-node');
	
## API

**dom()**

Creates and returns a node.


if the first argument is a string and starts with '<', it is assumed to use be an HTML string, and
creates a node using innerHTML. Optional second arg is a parentNode.

	var node = dom('<div>my dome node</div>', parentNode);
	
if the first argument is a string and does *not* start with '<', it is assumed to be a nodeName,
and a node is created via `document.createElement()`.

	var node = dom('div');
	
Additional parameters (all optional):

The second parameter is `options` which is an object that can contain properties or other objects:

	id: sets the node ID
	className: Sets the node class
	css: Sets the node class (alias for className)
	innerHTML: Sets the node's innerHTML
	html: Sets the node's innerHTML (alias for innerHTML)
	style: An object of CSS key-value styles. This object is passed to dom.style()
	attr: An object of attribute key-value pairs. This object is passed to dom.attr()

The third parameter is an node or a node id, where the newly created node will be appended

The fourth parameter is a boolean. If true, the newly created node will be prepended, not appended.
	

**dom.style()**
        
`dom.style` is a getter or a setter, depending on the parameters passed.

To use as a getter, the parameters should be a node, and a string property (only one property can be
accessed at a time). If the result is in the node.style object, that is returned. If not, the
property is acquired through the window global `getComputedStyle`.

To use as a setter, add a third parameter as a value:

	dom.style(node, 'width', 100);

Note that like jQuery, the value did not need to be a string appended with 'px'. If the style is a
dimensional property, this is done automatically. The dimensional properties are:

	width
	height
	top
	left
	right
	bottom
	maxWidth
	max-width
	maxHeight
	max-height

A more common way to use as a setter is to make the second parameter an object:

	dom.style(node, {
		width: 100,
		height: 100,
		position: 'absolute',
		zIndex: 1
	});

**dom.attr()**

Similar to `dom.style`, `dom.attr` is a getter/setter to get and set attributes on nodes.

As a getter:

	var dataItem = dom.attr(node, 'data-item');
	
As a setter:

	dom.attr(node, 'data-item', dataItem);
	
Or multiple attributes:

	dom.attr(node, {
		'data-item': dataItem
		scrollTop: 100,
		contentEditable: true
	});
		
**dom.byId('nodeId')**

If the parameter is a string, it finds a node with document.getElementByid(). If not found, returns
null. If the parameter is an object, it is assumed to already be a node and is returned.

Bonus: if it is detected to be a jQuery $element, it "de-jQuery-ifies" it, and returns a node.

**dom.box(node)**

Returns the dimensions of the passed node. Mainly an alias for `getBoundingClientRect()`. If the
passed item in the window object, returns its width and height.

**dom.query('div.myClass')**

An alias for `document.querySelectorAll`, so the parameter should conform to that. If the result is
one node, returns a node. If the result is multiple nodes, they are returned as an Array and not a
NodeList.

**dom.destroy(node)**

Destroys a node completely.

**dom.clean(node)**

Removes (but does not destroy) all child nodes.

**dom.show(node)** and **dom.hide(node)**

These methods simply add or remove the className "off". So by itself it will do little else. Your CSS
should ad a ".off" class that has `display:none`.

This techinque is more effective than setting `style:display:none`, because it is too difficult to
reverse. It is not easily known if the node has `display:block` or `display:inline-block` or a table style.


**dom.classList**

`dom.classList` is essentially a passthrough for node.classList methods, `add`, `remove`, `toggle`, and
`contains`.

There is extended functionality in `add` and `remove`: standard functionality doesn't allow for Arrays or
strings with spaces (ergo, two classes at once). `dom.classList` allows for this.


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