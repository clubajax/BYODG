define([], function () {
	
	function noop(){}
	
    var
        DomNode = {
            createElement: function () {
                return DomNode;
            },
            appendChild: function () {
                return DomNode;
            },
            removeChild: function () {
                return DomNode;
            },
            classList: {
                add: noop,
                remove: noop
            }
        },
        isNodeEnvironment = typeof document === 'undefined',
        dimensions = {left: 0, right: 100, top: 0, bottom: 100, width: 100, height: 100},
        canvasMock = {},
        canvasMockMethods = 'createLinearGradient,createPattern,createRadialGradient,addColorStop,rect,fillRect,strokeRect,clearRect,fill,' +
            'stroke,beginPath,moveTo,closePath,lineTo,clip,quadraticCurveTo,bezierCurveTo,arc,arcTo,isPointInPath,scale,rotate,' +
            'translate,transform,setTransform,fillText,strokeText,measureText,createImageData,getImageData,putImageData,save,' +
            'restore,createEvent,getContext,toDataURL,setLineDash',
        uids = {};

    if (isNodeEnvironment) {
        global.requestAnimationFrame = function (cb) {
            cb();
        };
        global.window = global;
        global.document = DomNode;
        global.document.body = DomNode;
        global.document.styleSheets = [
            {
                href: 'chart.css',
                cssRules:[]
            }
        ];
        global.document.ISMOCKED = true;
    }

    canvasMockMethods.split(',').forEach(function (m) {
        canvasMock[m] = noop;
    });
    canvasMock.measureText = function () {
        return dimensions;
    };
    canvasMock.createLinearGradient = function () {
        return {
            addColorStop: noop
        };
    };

    canvasMock.getImageData = function(){
        return {
            data:[]
        };
    };

    function uid(type) {
        if (!uids[type]) {
            uids[type] = [];
        }
        var id = type + '_' + (uids[type].length + 1);
        uids[type].push(id);
        return id;
    }

    function box(node) {
        return dimensions;
    }

    function dom(nodeType, options, parentNode) {
        options = options || {};
        var node;

        if(parentNode && !parentNode.classList){
            parentNode.classList = {
                add: noop,
                remove: noop
            };
        }

        node = {
            children: [],
            nodeType: nodeType,
            parentNode: parentNode,
            appendChild: function(node){
                this.children.push(node);
            },
            removeChild: function(node){
                for(var i = 0; i < this.children.length; i++){
                    if(this.children[i] === node){
                        this.children.splice(i, 1);
                        break;
                    }
                }
            },
            getContext: function () {
                return canvasMock;
            },
            classList: {
                remove: noop,
                add: noop,
				toggle: noop,
				contains: noop
            }
        };



        node.html = node.innerHTML = options.innerHTML || options.html;
        node.className = node.css = options.css;

        Object.defineProperty(node, 'firstChild', {
            get: function(){
                return this.children[0];
            }
        });

        Object.defineProperty(node, 'innerHTML', {
            get: function(){
                return node.html;
            },
            set: function(str){
                node.html = str;
            }
        });

        if(parentNode){
            parentNode.appendChild(node);
        }

        return node;
    }

    dom.classList = {
        remove: noop,
        add: noop,
        contains: noop,
        toggle: noop
    };

    dom.requestAnimationFrame = function (cb) {
        cb();
    };

    dom.query = function(){ return dom('div'); };
    dom.uid = uid;
    dom.box = box;
    dom.attr = noop;
    dom.style = noop;
    dom.destroy = noop;
    dom.show = noop;
    dom.hide = noop;
    dom.clean = noop;
    dom.isStub = true;

    return dom;
});
