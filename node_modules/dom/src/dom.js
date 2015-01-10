/* UMD.define */ (function (root, factory) {
    if (typeof define === 'function' && define.amd) { define([], factory); } else if (typeof exports === 'object') { module.exports = factory(); } else { root.returnExports = factory(); window.dom = factory(); }
}(this, function () {
    //  convenience library for common DOM methods
    //      dom()
    //          create dom nodes
    //      dom.style()
    //          set/get node style
    //      dom.attr()
    //          set/get attributes
    //      dom.destroy()
    //          obliterates a node
    //      dom.box()
    //          get node dimensions
    //      dom.uid()
    //          get a unique ID (not dom specific)
    //
    var
        isDimension = {
            width:1,
            height:1,
            top:1,
            left:1,
            right:1,
            bottom:1,
            maxWidth:1,
            'max-width':1,
			minWidth:1,
            'min-width':1,
            maxHeight:1,
            'max-height':1
        },
        uids = {},
        destroyer = document.createElement('div');

    function uid(type){
        if(!uids[type]){
            uids[type] = [];
        }
        var id = type + '-' + (uids[type].length + 1);
        uids[type].push(id);
        return id;
    }

    function isNode(item){
        return (/HTML/).test(Object.prototype.toString.call( item ));
    }

    function getNode(item){
        
        if(!item){ return item; }
        if(typeof item === 'string'){
            return document.getElementById(item);
        }
        // de-jqueryify
		return item.get ? item.get(0) :
			// item is a dom node
			item;
    }

    function byId(id){
        return getNode(id);
    }

    function style(node, prop, value){
        // get/set node style(s)
        //      prop: string or object
        //
        var key, computed;
        if(typeof prop === 'object'){
			// object setter
            for(key in prop){
                if(prop.hasOwnProperty(key)){
                    style(node, key, prop[key]);
                }
            }
            return null;
        }else if(value !== undefined){
			// property setter
            if(typeof value === 'number' && isDimension[prop]){
                value += 'px';
            }
            node.style[prop] = value;

            if(prop === 'userSelect'){
				value = !!value ? 'text' : 'none';
                style(node, {
                    webkitTouchCallout: value,
                    webkitUserSelect: value,
                    khtmlUserSelect: value,
                    mozUserSelect: value,
                    msUserSelect: value
                });
            }
        }
		
		// getter, if a simple style
        if(node.style[prop]){
            return node.style[prop];
        }

		// getter, computed
        computed = getComputedStyle(node, prop);
        if(computed[prop]){
            if(/\d/.test(computed[prop])){
                return parseInt(computed[prop], 10);
            }
            return computed[prop];
        }
        return '';
    }

    function attr(node, prop, value){
        // get/set node attribute(s)
        //      prop: string or object
        //
        var key;
        if(typeof prop === 'object'){
            for(key in prop){
                if(prop.hasOwnProperty(key)){
                    attr(node, key, prop[key]);
                }
            }
            return null;
        }
        else if(value !== undefined){
            if(prop === 'text' || prop === 'html' || prop === 'innerHTML'){
                node.innerHTML = value;
            }else{
                node.setAttribute(prop, value);
            }
        }

        return node.getAttribute(prop);
    }

    function box(node){
        if(node === window){
            return {
                width: node.innerWidth,
                height: node.innerHeight
            };
        }
        // get node dimensions
        return getNode(node).getBoundingClientRect();
    }

    function query(node, selector){
        if(!selector){
            selector = node;
            node = document;
        }
        var nodes = node.querySelectorAll(selector);

        // none found; return null;
        if(!nodes){ return null; }

        // only one found, return single node
        if(nodes.length === 1){ return nodes[0];}

        // multiple found; convert to Array and return it
        return Array.prototype.slice.call(nodes);

    }
	
	function toDom(html, options, parent){
        // create a node from an HTML string
		// private; used by main dom method
        destroyer.innerHTML = html;
		parent = byId(parent || options);
        if(parent){
            while(destroyer.firstChild){
				parent.appendChild(destroyer.firstChild);
            }
            return parent.firstChild;
        }
        return destroyer.firstChild;
    }

    function dom(nodeType, options, parent, prepend){
        // create a node
        // if first argument is a string and starts with <, it is assumed
        // to use toDom, and creates a node from HTML. Optional second arg is
        // parent to append to
        // else:
        //      nodeType: string, type of node to create
        //      options: object with style, className, or attr properties
        //          (can also be objects)
        //      parent: Node, optional node to append to
        //      prepend: truthy, to append node as the first child
        //
        if(nodeType.indexOf('<') === 0){
            return toDom(nodeType, options, parent);
        }

        options = options || {};
        var
            className = options.css || options.className,
            node = document.createElement(nodeType);

        parent = getNode(parent);

        if(className){
            node.className = className;
        }

        if(options.html || options.innerHTML){
            node.innerHTML = options.html || options.innerHTML;
        }

        if(options.cssText){
            node.style.cssText = options.cssText;
        }
		
		if(options.id){
            node.id = options.id;
        }

        if(options.style){
            style(node, options.style);
        }

        if(options.attr){
            attr(node, options.attr);
        }

        if(parent && isNode(parent)){
            if(prepend && parent.hasChildNodes()){
                parent.insertBefore(node, parent.children[0]);
            }else{
                parent.appendChild(node);
            }
        }

        return node;
    }

    function destroy(node){
        // destroys a node completely
        //
        if(node) {
            destroyer.appendChild(node);
            destroyer.innerHTML = '';
        }
    }

    function clean(node, dispose){
        //	Removes all child nodes
		//		dispose: destroy child nodes
		if(dispose){
			while(node.children.length){
				destroy(node.children[0]);
			}	
			return;
		}
        while(node.children.length){
            node.removeChild(node.children[0]);
        }
    }

    function show(node){
        getNode(node).classList.remove('off');
    }

    function hide(node){
        getNode(node).classList.add('off');
    }

    dom.classList = {
        remove: function(node, names){
            if(!node || !names){
				console.error('dom.classList.remove should include a node and a className');
                return;
            }
            names = Array.isArray(names) ? names : names.indexOf(' ') > -1 ? names.trim().split(' ') : [names];
            names.forEach(function(name){
                if(name){
                    node.classList.remove(name.trim());
                }
            });
        },
        add: function(node, names){
            if(!node || !names){
                return;
            }
            names = Array.isArray(names) ? names : names.indexOf(' ') > -1 ? names.trim().split(' ') : [names];
            names.forEach(function(name){
                if(name){
                    node.classList.add(name.trim());
                }
            });
        },
        contains: function(node, name){
            if(!node || !name){
                return false;
            }
            return node.classList.contains(name);
        },
        toggle: function(node, name){
            if(!node || !name){
                return null;
            }
            return node.classList.toggle(name);
        }
    };

    if (!window.requestAnimationFrame) {
        dom.requestAnimationFrame = function(callback){
            setTimeout(callback, 0);
        };
    }else{
        dom.requestAnimationFrame = function(cb){
            window.requestAnimationFrame(cb);
        };
    }

    dom.clean = clean;
    dom.query = query;
    dom.byId = byId;
    dom.attr = attr;
    dom.box = box;
    dom.style = style;
    dom.destroy = destroy;
    dom.uid = uid;
    dom.show = show;
    dom.hide = hide;
	dom.isNode = isNode;

    return dom;
}));
