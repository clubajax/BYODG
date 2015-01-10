/* UMD.define */ (function (root, factory) {
    if (typeof define === 'function' && define.amd) { define([], factory); } else if (typeof exports === 'object') { module.exports = factory(); } else { root.returnExports = factory(); window.EventTree = factory(); }
}(this, function () {

	
// EventTree
//      EventTree is a typical event emitter with additional functionality
//      of generating child trees. A child event will bubble up the tree,
//      but will not down other branches.
//
//	See README for documentation

var
    _id = 0,
    registry = {};

function register(id, handle){
    if(!registry[id]){
        registry[id] = [];
    }
    registry[id].push(handle);
}

function uid(str){
    str = str || 'event-';
    return str + (_id++);
}

function noop(){}
noop.name = 'noop';

function EventTree (options) {
	// Pass optional options to the constructor method for
	// iniialization
    this.constructor(options);
}

EventTree.prototype = {

    constructor: function(options){
        options = options || {};
		// this.id is primarilly for debugging instances
        this.id = uid('event-tree-');
        this.listeners = {};
        this.handles = {};
        this.children = {};
        this.currentErrors = [];
		
		// See setEventNames()
        if(options.events){
            this.setEventNames(options.events);
        }
		
		// See setSource();
        if(options.sourceName){
            this.setSource(options.sourceName);
        }
		
		// treeParent happens automatically when creating an EventTree instance from another
		// EventTree using EventTree.child()
        if(options.treeParent){
            this.treeParent = options.treeParent;
        }
		
		// suppressWarnings will not console.warn
		this.suppressWarnings = options.suppressWarnings;
		
        this.paused = false;

		// If an inheriting class/constuctor has a dispose method, it is mixed in via simple AOP
        var
            _oldDispose,
            _dispose = function(){
                this.disposeAll();
            }.bind(this);

        if(this.dispose){
            _oldDispose = this.dispose.bind(this);
            this.dispose = function(){
                _oldDispose();
                _dispose();
            };
        }else{
            this.dispose = _dispose;
        }
    },

    setEventNames: function(events){
		// If provided an events object, the key and/or values are used to
		// ensure a supported event was passed. Used to prevent mis-typed
		// event names 
        this.__events = {};
        for(var key in events){
            if(events.hasOwnProperty(key)){
                this.__events[key] = events[key];
                this.__events[events[key]] = events[key];
            }
        }
    },

    setSource: function(name){
		// If a sourceName string is passed, and the emitted event is an object, the EventTree
		// instance will be added to the event with the key of the sourceName. Useful for discovery
		// of event origination in event chains and hierarchies
        this.sourceName = name;
        this.source = this;
        if(!name){
            console.error('A name is required');
        }
    },

    child: function(options){
		// Method for creating a new EventTree instance that is linked in the hierarchy
        options = options || {};
        options.events = this.__events;
        var tree = new EventTree(options);
        tree.parent = this;
        this.children[tree.id] = {
            tree: tree
        };
        return tree;
    },

    missingEventName: function(name){
		if(!this.suppressWarnings){
			console.warn('Possible incorrect event name:  emit('+name+')');
		}
    },

    emit: function(name, event /* additional events */){
		// Key method used to emit an event.
		//		name: name of the event
		//		event: optional parameter to be passed as the event. Can be any data type (object,
		//		array, number, string, etc.)
		//		additional events: You may emit more than one argument
		//
        if(this.__events && !this.__events[name]){
            this.missingEventName(name);
        }

        if(name.toLowerCase() === 'error'){
            this.currentErrors.push(event);
        }
        var
            stopBubbling,
            key,
            listeners = this.listeners[name],
            args = Array.prototype.slice.call(arguments);

        args.shift();
        
        if(this.source && typeof event === 'object'){
            event[this.sourceName] = this.source;
        }

        // If listener returns false, bubbling stops
        if(listeners){
            for(key in listeners){
                if(listeners.hasOwnProperty(key)){
                    stopBubbling = listeners[key].apply(null, args);
                    if(stopBubbling === false){
                        break;
                    }
                }
            }
        }

        if(this.parent){
            this.parent.emit.apply(this.parent, arguments);
        }

        if(this.treeParent){
            this.treeParent.emit.apply(this.treeParent, arguments);
        }

    },

    pause: function(){
		// Pauses all listeners at once. Can be used instead of calling pause on multiple handles.
		//	ex: instance.pause();
        this.paused = true;
        this.emit('pause');
        var handles = this.handles;
        Object.keys(handles).forEach(function(key){
            handles[key].pause();
        });
    },

    resume: function(){
		// Resumes all listeners at once. Can be used instead of calling resume on multiple handles.
		// Note: Will resume *all* active handles, regardless of how or where the handle was paused
		//	ex: instance.resume();
        this.paused = false;
        var handles = this.handles;
        Object.keys(handles).forEach(function(key){
            handles[key].resume();
        });
        this.emit('resume');
    },

    once: function(name, callback, context, handleId){
		// Attach a listener that will get called only once.
		//
        if(context && typeof context === 'object'){
            callback = callback.bind(context);
        }
        if(handleId && !this.suppressWarnings){
            console.warn('handleId not supported for `once`');
        }
        var handle = this.on(name, function(){
            callback.apply(null, arguments);
            handle.remove();
        });

        return handle;
    },

    on: function(name, callback, context, handleId){
		// Key method for handling events.
		//		name: event name
		//		callback: method to invoke when event is captured
		//		context: optional: An object to bind the callback. Could be "this" or "self"
		//		handleId: An identifier to ad to a series of handles so they can be removed
		//			all at once via EventTree.removebyId(id);
		//		returns: handle (Object)
		//
        if(this.__events && !this.__events[name] && !this.suppressWarnings){
            console.warn('Possible incorrect event name:  on('+name+')');
        }
        var
            handles = this.handles,
            handle,
            listeners = this.listeners,
            paused,
            id = uid('listener-');

        this.listeners[name] = this.listeners[name] || {};
        if(context){
            if(typeof context === 'string'){
                handleId = context;
            }else{
                callback = callback.bind(context);
            }
        }

        listeners[name][id] = callback;

		// returned handle
        handle = {
			// internal use, to track the handle
            id: uid('handle'),
			// `removed` can be inspected, to determine if the handle is still active
            removed: false,
            remove: function(){
				// Permanently removes the listener
                if(!listeners[name]){
                    // already destroyed
                    return;
                }
                this.pause();
                delete listeners[name][id];
                delete handles[this.id];
                paused = noop;
                this.removed = true;
            },
            pause: function(){
				// Temporarilly pauses the listener
                if(!paused){
					paused = listeners[name][id];
					listeners[name][id] = noop;
				}
            },
            resume: function(){
				// Resumes a paused listener
                if(paused){
                    listeners[name][id] = paused;
                }
            }
        };

        handles[handle.id] = handle;

        if(handleId){
            register(handleId, handle);
        }

        return handle;
    },
	
	removeAll: function(){
		// Used to remove all listeners, but not to destroy the instance.
		// Usually dispose() is used instead.
        var
            listeners = this.listeners,
            handles = this.handles;
        Object.keys(handles).forEach(function(key){
            handles[key].remove();
        });
        Object.keys(listeners).forEach(function(key){
            delete listeners[key];
        });
        this.listeners = {};
    },

    removeAllListeners: function(){
		// Used to remove all listeners, but not to destroy the instance.
		// Usually dispose() is used instead.
        this.removeAll();
    },
	
	// The dispose is in the constructor.
	// dispose: function(){
	//		Used to remove all listeners, remove references and destroy the EventTree instance.
	//}

    disposeAll: function(){
        // convenience method that can be called instead of
        // using inheritance on dispose()
        this.emit('dispose', this);
        this._disposeEvents();
        this.DISPOSED = true;
    },
	
	removeChild: function(childId){
		// Internal use, for removing a child EventTree
        delete this.children[childId].tree;
        delete this.children[childId];
    },

    _disposeEvents: function(){
		// Internal use. Use dispose() or disposeAll() instead
        this.removeAll();
        if(this.parent){
            this.parent.removeChild(this.id);
        }
        this.events = null;
    }
};

EventTree.removeById = function(handleId){
    // event connections can be assigned an ID, and those
    // connections can be removed by ID. Easier than keeping
    // a collection of handles.
    if(registry[handleId]){
        registry[handleId].forEach(function(h){ h.remove(); });
        registry[handleId] = null;
        delete registry[handleId];
    }else{
        console.error('handleId not found in registry', handleId, registry);
    }
};

return EventTree;

}));