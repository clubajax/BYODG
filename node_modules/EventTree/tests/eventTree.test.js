define([], function () {

    var
		sandbox,
		EventTree,
		mocks = null,
		path = 'EventTree/src/EventTree';


    suite({

        name: 'EventTree',
		
		before: function(){
			sandbox = sinon.sandbox.create();	
		},
		
		after: function(){
			
		},

        beforeEach: function (load) {
			load(path, mocks, function(module){
				EventTree = module;
			});	
		},

        afterEach: function (unload) {
			sinon.sandbox.restore();
			unload();
		},

        'constructor loading': function () {
            expect(EventTree).to.be.a('function');
        },

        'invoke constructor': function () {
            expect(new EventTree()).to.be.an('object');
        },
        
        'simple event emit': function () {
                var
                    tree = new EventTree(),
                    callback = sandbox.spy();
        
                tree.on('zap', callback);
                tree.emit('zap');
        
                sinon.assert.calledOnce(callback);
        },
        
        'emit with arg': function () {
			var
				tree = new EventTree(),
				callback = function(arg){
					expect(arg).to.equal('bam!');
				};
	
			tree.on('zap', callback);
			tree.emit('zap', 'bam!');
        },
        
        'on with context': function () {
			var
				tree = new EventTree(),
				widget = {
					connect: function(){
						tree.on('zap', function(){
							this.callback();
						}, this);
					},
					callback: function(){}
				};
	
			widget.callback = sandbox.spy(widget, 'callback');
			widget.connect();
			tree.emit('zap');
			sinon.assert.calledOnce(widget.callback);
        },
        
        'emit with multiple args': function () {
			var
				tree = new EventTree(),
				spy = sandbox.spy();
	
			tree.on('zap', spy);
			tree.emit('zap', 'bam!', 'pow!', 'biff!');
			sinon.assert.calledWith(spy, 'bam!', 'pow!', 'biff!');
        },
        
        'emit with different args': function () {
			var
				tree = new EventTree(),
				spy = sandbox.spy();
	
			tree.on('zap', spy);
			tree.emit('zap', 'ouch!');
			tree.emit('zap', 'oof!');
			
			sinon.assert.calledWith(spy, 'ouch!');
			sinon.assert.calledWith(spy, 'oof!');
	
		},
        
        'emit, pause, emit': function () {
			var
				handle,
				tree = new EventTree(),
				spy = sandbox.spy();
	
			handle = tree.on('zap', spy);
			tree.emit('zap', 'buzz!');
			handle.pause();
			tree.emit('zap', 'brup!');
			handle.resume();
			tree.emit('zap', 'brap!');
	
			sinon.assert.calledWith(spy, 'buzz!');
			sinon.assert.neverCalledWith(spy, 'brup!');
			sinon.assert.calledWith(spy, 'brap!');
			sinon.assert.calledTwice(spy);
        },
        
        'emit, pause, pause, resume, emit': function () {
			var
				handle,
				tree = new EventTree(),
				spy = sandbox.spy(),
				spyCall;
			
			handle = tree.on('zap', spy);
			tree.emit('zap', 'buzz!');
			handle.pause();
			handle.pause();
			tree.emit('zap', 'kzzt!');
			handle.resume();
			tree.emit('zap', 'brap!');
			
			spyCall = spy.getCall(0);
			spyCall.calledWith('buzz!');
			sinon.assert.calledWith(spy, 'buzz!');
			sinon.assert.neverCalledWith(spy, 'kzzt!');
			sinon.assert.calledWith(spy, 'brap!');
        
        },
		
		'pause and resume EventTree (not handle)': function () {
			var
				handle,
				tree = new EventTree(),
				spy = sandbox.spy(),
				spyCall;
			
			handle = tree.on('zap', spy);
			tree.emit('zap', 'buzz!');
			tree.pause();
			tree.emit('zap', 'kzzt!');
			tree.resume();
			tree.emit('zap', 'brap!');
			
			spyCall = spy.getCall(0);
			spyCall.calledWith('buzz!');
			sinon.assert.calledWith(spy, 'buzz!');
			sinon.assert.neverCalledWith(spy, 'kzzt!');
			sinon.assert.calledWith(spy, 'brap!');
        
        },
        
        'emit, remove': function () {
			var
				handle,
				tree = new EventTree(),
				spy = sandbox.spy();
	
			handle = tree.on('zap', spy);
			tree.emit('zap', 'grrk!');
			handle.remove();
			tree.emit('zap', 'argh!');
			handle.resume();
			tree.emit('zap', 'doh!');
	
			sinon.assert.calledOnce(spy.withArgs('grrk!'));
			sinon.assert.neverCalledWith(spy, 'argh!');
			sinon.assert.neverCalledWith(spy, 'doh!');
		},
        
        'emit, remove from widget': function () {
			var
				tree = new EventTree(),
				widget = {
					connect: function(){
						this.handle = tree.on('zap', this.callback, this);
					},
					disconnect: function(){
						this.handle.remove();
					},
					callback: function(){}
				};
	
			widget.callback = sandbox.spy(widget, 'callback');
			widget.connect();
			tree.emit('zap');
			widget.disconnect();
			tree.emit('zap');
			
			sinon.assert.calledOnce(widget.callback);
			
		},
        
        'remove all listeners': function () {
			var
				tree = new EventTree(),
				spy = sandbox.spy();
	
			tree.on('be', spy);
			tree.on('bop', spy);
			tree.on('ba-lu-la', spy);
	
			tree.removeAll();
	
			tree.emit('be');
			tree.emit('bop');
			tree.emit('ba-lu-la');
			
			sinon.assert.notCalled(spy);
		},
		
		'emit once': function () {
			var
				tree = new EventTree(),
				spy = sandbox.spy();
	
			tree.once('be', spy);
			tree.once('bop', spy);
			tree.once('ba-lu-la', spy);
			
			tree.emit('be');
			tree.emit('bop');
			tree.emit('ba-lu-la');
			
			tree.emit('be');
			tree.emit('bop');
			tree.emit('ba-lu-la');
			
			// called 3 times, not 6
			sinon.assert.calledThrice(spy);
		},
		
		'remove by id': function () {
			var
				id = 'testing',
				tree = new EventTree(),
				spy = sandbox.spy();
	
			tree.on('be', spy, id);
			tree.on('bop', spy, id);
			tree.on('ba-lu-la', spy, id);
	
			EventTree.removeById(id);
	
			tree.emit('be');
			tree.emit('bop');
			tree.emit('ba-lu-la');
			
			sinon.assert.notCalled(spy);
		},
        
        'dispose': function () {
			var
				handle,
				tree = new EventTree(),
				spy = sandbox.spy();
	
			handle = tree.on('zap', spy);
			tree.emit('zap', 'woop!');
			tree.dispose();
			tree.emit('zap', 'wup!');
			
			sinon.assert.calledOnce(spy.withArgs('woop!'));
			sinon.assert.neverCalledWith(spy, 'wup!');	
		},
        
        'enforce event names': function () {
			var
				events = {
					be:'be',
					bop:'bop',
					baLuLa: 'ba-lu-la'
				},
				tree = new EventTree({events:events, suppressWarnings:true}),
				spy = sandbox.spy(tree, 'missingEventName');
	
			tree.emit('bop');
			sinon.assert.notCalled(spy);
			tree.emit(events.bop);
			sinon.assert.notCalled(spy);
			tree.emit('zap');
			sinon.assert.calledOnce(spy);
		},
        
        'bubbling': function(){
        
            var
                tree = new EventTree(),
                spy1 = sandbox.spy(),
                spy2 = sandbox.spy();
        
            tree.on('zap', spy1);
			// sp1 does not prevent spy2 from emitting
            tree.on('zap', spy2);
        
            tree.emit('zap');
			sinon.assert.calledOnce(spy1);
			sinon.assert.calledOnce(spy2);
        },
        
        'prevent bubbling': function(){
        
            var
                tree = new EventTree(),
                spy1 = sandbox.spy(),
                spy2 = sandbox.spy();
        
            tree.on('zap', function(){
                spy1();
                return false;
            });
            tree.on('zap', function(){
                spy2();
            });
        
            tree.emit('zap');
			sinon.assert.calledOnce(spy1);
			sinon.assert.notCalled(spy2);
        },
		
		'inheritance': function(){
			function Widget(options){
				this.constructor(options);
			}
            var
				events = {
					be:'be',
					bop:'bop',
					baLuLa: 'ba-lu-la'
				},
                widget,
                spy;
        
			Widget.prototype = new EventTree();
			widget = new Widget({events:events, suppressWarnings:true});
			spy = sandbox.spy(widget, 'missingEventName');
			
            widget.emit('bop');
			sinon.assert.notCalled(spy);
			widget.emit(events.bop);
			sinon.assert.notCalled(spy);
			widget.emit('zap');
			sinon.assert.calledOnce(spy);
        },
        
        'event tree, single branch, test event sources': function(){
			var
				parent = new EventTree({sourceName:'A'}),
				childA = parent.child({sourceName:'B'}),
				grandchildA = childA.child({sourceName:'C'}),
				parentSpy = sandbox.spy(),
				childASpy = sandbox.spy();
	
			parent.on('zap', function(event){
				expect(event.A).to.equal(parent);
				expect(event.B).to.equal(childA);
				expect(event.C).to.equal(grandchildA);
				parentSpy();
			});
			childA.on('zap', function(event){
				expect(event.B).to.equal(childA);
				expect(event.C).to.equal(grandchildA);
				childASpy();
			});
			grandchildA.on('zap', function(event){
				expect(event.C).to.equal(grandchildA);
				childASpy();
			});
	
			grandchildA.emit('zap', {a:1});
	
			sinon.assert.calledOnce(parentSpy);
			sinon.assert.calledTwice(childASpy);
        },
        
        'event tree, multi branch': function(){
			var
				parent = new EventTree({sourceName:'A'}),
				childA = parent.child({sourceName:'B'}),
				grandchildA = childA.child({sourceName:'C'}),
				
				childB = parent.child({sourceName:'B'}),
				grandchildB = childB.child({sourceName:'C'}),
				
				parentSpy = sandbox.spy(),
				childASpy = sandbox.spy(),
				childBSpy = sandbox.spy(),
				grandchildBSpy = sandbox.spy();
	
			parent.on('zap', function(event){
				parentSpy();
			});
			childA.on('zap', function(event){
				childASpy();
			});
			
			childB.on('zap', function(event){
				childBSpy();
			});
			grandchildB.on('zap', function(event){
				grandchildBSpy();
			});
			
			// emit on grandchild A
			grandchildA.emit('zap', {a:1});
			// bubble up to child A
			sinon.assert.calledOnce(childASpy);
			// bubble up to parent
			sinon.assert.calledOnce(parentSpy);
			
			// does not emit on sibling (child B)
			sinon.assert.notCalled(childBSpy);
			// does not emit across the hierarchy (grandchild B)
			sinon.assert.notCalled(grandchildBSpy);
        }
    });
});
