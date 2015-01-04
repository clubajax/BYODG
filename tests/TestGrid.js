define([
	'declare',
	'grid/xhr',
	'grid/Grid'
], function(declare, xhr, Grid){
	
	return declare({
		declaredClass:'TestGrid',
		constructor: function(nodeId){
			this.buildGrid(nodeId);
			this.loadData(function(data){
				this.render(data);
			}.bind(this));
		},
		
		render: function(data){
			console.log('render!', data);
			this.grid.render(data.items);
		},
		
		loadData: function(callback){
			xhr('http://0.0.0.0:3000/?start=10&count=20&sort=index&dir=desc&filter=firstName,lastName', function(data){
				console.table(data.items);
				callback(data);
			}, function(error){
				console.error('error', error);
			});		
		},
		
		buildGrid: function(nodeId){
			this.grid = new Grid(nodeId);
		}
	});
	
		
		
		
});