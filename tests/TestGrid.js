define([
	'declare',
	'dom',
	'EventTree',
	'grid/xhr',
	'grid/Grid',
	'grid/Sort',
	'grid/Paginator',
	'grid/Editable'
], function(declare, dom, EventTree, xhr, Grid, Sort, Paginator, Editable){
	
	return declare(EventTree, {
		declaredClass:'TestGrid',
		constructor: function(options, nodeId){
			this.buildGrid(nodeId);
			this.sorter = new Sort({grid: this.grid});
			
			this.sorter.on('sort', function(event){
				Object.keys(event).forEach(function(key){ options[key] = event[key]; });
				this.loadData(options);
			}, this);
			
			dom.classList.add(dom.byId(nodeId), 'has-paginator');
			this.paginator = new Paginator({}, dom.byId(nodeId));
			
			this.paginator.on('change', function(event){
				Object.keys(event).forEach(function(key){ options[key] = event[key]; });
				this.loadData(options);
			}, this);
			
			this.editable = new Editable({grid:this.grid});
			this.editable.on('change', function(event){
				console.log('CHANGED', event);
			});
			this.loadData(options);
		},
		
		render: function(data){
			this.grid.render(data.items);
		},
		
		onData: function(data){
			this.render(data);
			this.paginator.update(data);
		},
		
		loadData: function(options){
			var
				url = 'http://0.0.0.0:3000/?',
				params = [];
				
			options.start = options.start || 1;
			options.count = options.count || 10;
			
			Object.keys(options).forEach(function(key){
				params.push(key + '=' + options[key]);
			});
			
			url += params.join('&');
			
			xhr(url, function(data){
				//console.table(data.items);
				this.onData(data);
			}.bind(this), function(error){
				console.error('error', error);
			});		
		},
		
		buildGrid: function(nodeId){
			this.grid = new Grid(nodeId);
			
			// pass-through events
			this.grid.on('data', function(data){
				this.emit('data', data);
			}, this);
			this.grid.on('render', function(grid){
				this.emit('render', grid);
			}, this);
			this.grid.on('select-row', function(event){
				this.emit('select-row', event);
			}, this);
			this.grid.on('header-click', function(event){
				this.emit('header-click', event);
			}, this);
			
			
		}
	});
	
		
		
		
});