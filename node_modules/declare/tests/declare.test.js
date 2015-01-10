define([], function () {

    var
		sandbox,
		declare,
		mocks = null,
		path = 'declare/src/declare';


    suite({

        name: 'declare',
		
		before: function(){
			sandbox = sinon.sandbox.create();	
		},
		
		after: function(){
			
		},

        beforeEach: function (load) {
			load(path, mocks, function(module){
				declare = module;
			});	
		},

        afterEach: function (unload) {
			sinon.sandbox.restore();
			unload();
		},

        'constructor loading': function () {
            expect(declare).to.be.a('function');
        },
		
		'declare a constructor': function(){
			var Cnst = declare({
				constructor: function(){}	
			});
			expect(Cnst).to.be.a('function');
		},
		
		'instanciate a constructor': function(){
			var Cnst = declare({
				constructor: function(){}	
			}),
			c = new Cnst();
			expect(c).to.be.an('object');
		},
		
		'constructor should call instance methods': function(){
			var
				Cnst = declare({
					result: false,
					constructor: function(){
						this.foo();	
					},
					foo: function(){
						this.result = true;
					}
				}),
				c = new Cnst();
				
			expect(c.result).to.equal(true);
		},
		
		'constructors should fire from both prototypes': function(){
			var
				o1 = {
					o1: false,
					constructor: function(){
						this.o1 = true;	
					}
				},
				o2 = {
					o2: false,
					constructor: function(){
						this.o2 = true;
					}
				},
				Cnst = declare(o1,o2),
				c = new Cnst();
				
				console.dir(c);
				
			expect(c.o1).to.equal(true);
			expect(c.o2).to.equal(true);
		},
		
		'constructor should call other prototypes methods': function(){
			var
				o1 = {
					result: false,
					otherbarResult: false,
					constructor: function(){
						this.foo();	
					},
					foo: function(){
						this.result = true;
					},
					otherbar: function(){
						this.otherbar = true;
					}
				},
				o2 = {
					barResult: false,
					constructor: function(){
						this.bar();
						this.otherbar();
					},
					bar: function(){
						this.barResult = true;
					}
				},
				Cnst = declare(o1,o2),
				c = new Cnst();
				console.dir(c);
			expect(c.result).to.equal(true);
		},
		
		'should handle multiple inheritance': function(){
			
			// Make this a MIX?
			
			//function clone(orig) {
			//	let origProto = Object.getPrototypeOf(orig);
			//	return Object.assign(Object.create(origProto), orig);
			//}
			
			var
				o1 = {
					declaredClass:'O1',
					o1: false,
					constructor: function(){
						this.o1 = true;	
					}
				},
				o2 = {
					declaredClass:'O2',
					o2: false,
					constructor: function(){
						this.o2 = true;
					}
				},
				o3 = {
					declaredClass:'O3',
					o3: false,
					constructor: function(){
						this.o3 = true;
					}
				},
				o4 = {
					declaredClass:'O4',
					o4: false,
					constructor: function(){
						this.o4 = true;
					}
				},
				Cnst = declare(o1,o2,o3,o4),
				c;
				
				setTimeout(function(){ c = new Cnst();
				console.dir(Cnst.prototype);
				console.dir(c); }, 100);
				
			//expect(c.result).to.equal(true);
		},
		
		'constructor should work after last one': function(){
			var
				Cnst = declare({
					declaredClass: 'Cool',
					cool: false,
					constructor: function(){
						this.cool = true;	
					}
				}),
				c = new Cnst();
				console.dir(Cnst.prototype);
				console.dir(c);
			//expect(c.result).to.equal(true);
		},
	});
});