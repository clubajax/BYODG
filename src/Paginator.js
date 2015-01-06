define([
	'declare',
	'EventTree',
	'on',
	'dom',
	'./Menu'
], function(declare, EventTree, on, dom, Menu){
	
	return declare(EventTree, {
		
		constructor: function(options,node){
			this.parentNode = node;
			this._listeners = [];
			this.id = 'paginator-' + (options.id || '');
			
			this.params = options.pagiProps || {
				count: 10,
				start: 0
			};
			
			this.build();
		},
		
		onMenuChange: function(event){
			this.emit('change', {count:event.value, start: 0});
		},
		
		reset: function(){
		
		},
		
		gotoPage: function(where){
			
			if(where === 'next'){
				this.paging.beg += this.paging.count;
			}
			else if(where === 'prev'){
				this.paging.beg -= this.paging.count;
			}
			else if(where === 'first'){
				this.paging.beg = 1;
			}
			else if(where === 'last'){
				this.paging.beg = this.paging.last;
			}
			else{
				this.paging.beg = (this.paging.count * where) + 1;
			}
			
			var params = {
				start: this.paging.beg,
				count: this.paging.count
			};
			
			this.emit('change', params);
		},
		
		update: function(data){
			var
				inc = data.count, // step
				beg = data.start,
				total = data.total,
				end = Math.min(beg + inc - 1, total),
				lastAmt = inc, //(Math.floor(total / inc) * inc),
				last = total - lastAmt + 1,
				isLast = beg + inc >= total,
				page = isLast ? Math.floor(((beg - 1) + inc) / inc) : Math.ceil(((beg - 1) + inc) / inc),
				
				i = 0,
				step = 0,
				firstClass = 'paginator-step first nav' + (beg < 2 ? ' disabled' : ''),
				lastClass = 'paginator-step last nav'  + (isLast || total < last ? ' disabled' : ''),
				stepClass = 'paginator-step step',
				prevClass = 'paginator-step prev nav' + (beg < 2 ? ' disabled' : ''),
				nextClass = 'paginator-step next nav' + (end >= total ? ' disabled' : '');
			
			this.paging = {
				beg:beg,
				end:end,
				count:data.count,
				total:total,
				last: last
			};
			
			if(total){
				this.pagResultsNode.innerHTML = beg + ' - '+end+' of '+total+' Results';
			}else{
				this.pagResultsNode.innerHTML = '0 Results';
			}
			this.pagIncNode.innerHTML = '';
			
			dom('span', {css:firstClass + (page === 0 ? ' disabled' : '')}, this.pagIncNode);
			dom('span', {css:prevClass}, this.pagIncNode);

			if(total > inc * 3){
				if(page === 1){
					total = inc * 3;
				}else{
					i = page - 2;
					step = page * inc - inc * 1;
					total = page * inc + inc * 2;
				}
				//step = page - 1;
				//total = page + 1;
				// one on each side
				// or two on one side
			}
			
			while(step < total){
				i++;
				dom('span', {css: stepClass + (page === i || i * 10 >= last ? ' disabled' : ''), innerHTML:i}, this.pagIncNode);
				step += data.count;
			}
			
			dom('span', {css:nextClass}, this.pagIncNode);
			dom('span', {css:lastClass}, this.pagIncNode);
		},
		
		build: function(){
			var
				self = this,
				node = dom('div', {css:'paginator'});
			
			//log('GRIDRESULTS', currentMax, typeof currentMax, profile.get('gridResults'));
			
			this.pagResultsNode = dom('div', {css:'paginator-total'}, node);
			this.pagIncNode = dom('div', {css:'paginator-incrementor'}, node);
			
			this.pagIncNode.innerHTML = '';
			
			this._listeners.push(on(this.pagIncNode, 'click', function(event){
				if(/disabled/.test(event.target.className)){ return; }
				var cls = event.target.className.split(' ')[1];
				if(cls === 'step'){
					self.gotoPage(parseInt(event.target.innerHTML, 10) - 1);
				}
				else if(cls === 'next' || cls === 'prev' || cls === 'first' || cls === 'last'){
					self.gotoPage(cls);
				}
			}));
			
			this.pagResultsNode.innerHTML = 'no results.';
			
			
			this.menu = new Menu({
				parentNode:node,
				items:[
					{
						group:'count-results',
						value:10,
						label: 10 + ' Results',
						selected: this.params.count === 10
					},{
						group:'count-results',
						value:25,
						label: 25 + ' Results',
						selected: this.params.count === 25
					},{
						group:'count-results',
						value: 50,
						label: 50 + ' Results',
						selected: this.params.count === 50
					}
				]
			});
			
			this.menu.on('change', this.onMenuChange.bind(this));
			
			this.parentNode.appendChild(node);
			this.domNode = node;
		},
		
		hide: function(){
			this.domNode.style.display = 'none';
		},
		
		show: function(){
			this.domNode.style.display = 'block';
		},
		
		destroy: function(){
			this.parentNode = null;
			this._listeners.forEach(function(h){ h.remove(); });
			this.domNode = null;
		}
	});
});