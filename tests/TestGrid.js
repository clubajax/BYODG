define([
	'declare',
	'dom',
	'EventTree',
	'grid/xhr',
	'grid/Grid',
	'grid/Sort',
	'grid/Paginator',
	'grid/Editable',
	'grid/ColumnSizer',
	'grid/ClickHandler',
	'grid/Selection'
], function(declare, dom, EventTree, xhr, Grid, Sort, Paginator, Editable, ColumnSizer, ClickHandler, Selection){
	
	return declare(EventTree, {
		declaredClass:'TestGrid',
		constructor: function(options, nodeId){
			this.buildGrid(nodeId);
			
			this.clickHandler = new ClickHandler({grid: this.grid});
			
			this.selection = new Selection({clickHandler: this.clickHandler, grid: this.grid});
			
			this.sorter = new Sort({grid: this.grid, clickHandler: this.clickHandler});
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
			
			
			
			this.editable = new Editable({clickHandler:this.clickHandler});
			this.editable.on('change', function(event){
				console.log('CHANGED', event);
			});
			
			new ColumnSizer({grid:this.grid});
			
			this.connectEvents();
			
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
		},
		
		connectEvents: function(){
			// pass-through events
			this.grid.on('data', function(data){
				this.emit('data', data);
			}, this);
			this.grid.on('render', function(grid){
				this.emit('render', grid);
			}, this);
			this.selection.on('select-row', function(event){
				this.emit('select-row', event);
			}, this);
			this.clickHandler.on('header-click', function(event){
				this.emit('header-click', event);
			}, this);
		}
	});
	
		
		
		
});