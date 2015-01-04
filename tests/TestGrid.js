define([
	'declare',
	'EventTree',
	'grid/xhr',
	'grid/Grid'
], function(declare, EventTree, xhr, Grid){
	
	return declare(EventTree, {
		declaredClass:'TestGrid',
		constructor: function(options, nodeId){
			this.buildGrid(nodeId);
			this.loadData(options, function(data){
				this.render(data);
			}.bind(this));
		},
		
		render: function(data){
			console.log('render!', data);
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
				console.table(data.items);
				callback(data);
			}, function(error){
				console.error('error', error);
			});		
		},
		
		buildGrid: function(nodeId){
			this.grid = new Grid(nodeId);
			this.grid.on('data', function(data){
				this.emit('data', data);
			}, this);
			this.grid.on('render', function(grid){
				this.emit('render', grid);
			}, this);
		}
	});
	
		
		
		
});