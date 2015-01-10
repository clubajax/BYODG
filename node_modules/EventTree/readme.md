# EventTree

## Description

`EventTree` is a library for emitting events. Its primary feature is it returns a handle, from which
you can pause, resume, and remove the event. Handles are much easier to manipulate than using
`removeEventListener`, or `off` which sometimes necessitates recreating complex or recursive function
signatures.

Think of handles as something like a returned Promise - an object with methods, with which you can
control the event handler.

	 var
		tree = new EventTree(),
		handle = tree.on('something-special', function(event){
		   console.log('special event:', event);
		});
	
	tree.emit('something-special', 'event string');
	handle.pause(); // event will not fire
	handle.resume(); // event fires again
	handle.remove(); // event is permanently removed

## Support

`EventTree` supports all browsers and Node.js. IE6 is included and should work with some simple ES5 shims, although
it has not been tested.

This library uses UMD, meaning it can be consumed with RequireJS, Browserify or Node.js (CommonJS),
or a standard browser global.

## Installation

You can clone the repository with your generic clone commands as a standalone repository or
submodule.

	git clone git://github.com/clubajax/EventTree.git

It is recommended that you set the config.path of RequireJS to make `EventTree` accessible as an
absolute path. If using as a global or with Browserify, it is suggested that you use an
*NPM run script* to copy the `EventTree` script to a location more convenient for your project.
	
`EventTree` has no dependencies.

## Options

EventTree options are all optional. Options can be an object with the following optional options:

	new EventTree({
		// If provided an events object, the key and/or values are used to
		// ensure a supported event was passed. Used to prevent mis-typed
		// event names 
		events:{loading:'tree-loading'},
		
		// If a sourceName string is passed, and the emitted event is an object, the EventTree
		// instance will be added to the event with the key of the sourceName. Useful for discovery
		// of event origination in event chains and hierarchies
		sourceName: 'myWidget'
	});

## Methods

	tree.on (name, callback, context, handleId)
	Key method for handling events.
		name: event name
		callback: method to invoke when event is captured
		context: optional: An object to bind the callback. Could be "this" or "self"
		handleId: An identifier to ad to a series of handles so they can be removed
			all at once via EventTree.removebyId(id);
		returns: handle (Object)
		
	tree.once (name, callback, context, handleId){
		Attach a listener that will get called only once.

	tree.emit (name, event, event, event){
		Key method used to emit an event.
			name: name of the event
			event: optional parameter to be passed as the event. Can be any data type (object,
			array, number, string, etc.)
			additional events: You may emit more than one argument
			
	tree.child (options){
		Method for creating a new EventTree instance that is linked in the hierarchy
		options: Same options used when creating an instance like new EventTree(options);
		example:
			parent = new EventTree({sourceName:'A'});
			child = parent.child({sourceName:'B'});
			
	 tree.pause
		Pauses all listeners at once. Can be used instead of calling pause on multiple handles.
		example:
			instance.pause();

    tree.resume
		Resumes all listeners at once. Can be used instead of calling resume on multiple handles.
		Note: Will resume *all* active handles, regardless of how or where the handle was paused
		example:
			instance.resume();
	
	tree.dispose
		Used to remove all listeners, remove references and destroy the EventTree instance.
		
	EventTree.removeById(handleId)
		Event connections can be assigned an ID, and those connections can be removed by ID.
		Sometimes easier than keeping a collection of handles.
		
## Features

Multiple `EventTree` instances can be linked together in a hierarchy. Events emitted on low level children will bubble up
to the top of the tree - but not dowm. So a child event will emit on the child, its parent, and its parent's parent (etc).
When it reaches the top of the tree it will stop. Essentially this means "cousins" do not listen to each other's events.

`EventTree` has a `constructor` method, so it is easy to use in inheritance or with Class-construction
libraries like [dcl](http://github.com/uhop/dcl).

	var
		events = {
			be:'be',
			bop:'bop',
			baLuLa: 'ba-lu-la'
		},
		widget,
		spy;
		
	function Widget(options){
		this.constructor(options);
		
		this.load = function(){
			console.log('loading!');
		};
		this.on('load', this.load, this);
		
		this.ready = function(){
			this.emit('load');		
		};
	}
	
	Widget.prototype = new EventTree();
	widget = new Widget({events:events});
	
	widget.on('bop', function(event){
		console.log('event', event);
	});
	
	widget.ready();
	
