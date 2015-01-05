define([
	'declare',
	'EventTree',
	'grid/xhr',
	'grid/Grid',
	'grid/Sort'
], function(declare, EventTree, xhr, Grid, Sort){
	
	return declare(EventTree, {
		declaredClass:'TestGrid',
		constructor: function(options, nodeId){
			this.buildGrid(nodeId);
			this.sorter = new Sort({grid: this.grid});
			
			this.sorter.on('sort', function(event){
				Object.keys(event).forEach(function(key){
					options[key] = event[key];
				});
				this.loadData(options, function(data){
					this.render(data);
				}.bind(this));
			}, this);
			
			this.loadData(options, function(data){
				this.render(data);
			}.bind(this));
		},
		
		render: function(data){
			this.grid.render(data.items);
		},
		
		loadData: function(options, callback){
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
				callback(data);
			}, function(error){
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