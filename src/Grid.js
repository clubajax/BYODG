define([
	'declare',
	'dom'
], function(declare, dom){
	
	return declare({
		declaredClass: 'grid',
		
		baseClass:'base-grid',
		rowClass:'base-grid-row',
		headerWrapClass:'base-grid-header-wrap',
		headerClass:'base-grid-header',
		containerClass:'base-grid-container',
		scrollerClass:'base-grid-scroller',
		
		constructor: function(nodeId){
			console.log('GRID!');
			this.build(nodeId);
		},
		
		renderHeader: function(columns){
			dom.clean(this.header);
			var
				table = dom('table', {}, this.header),
				tr = dom('tr', {}, table);
				
			columns.forEach(function(col){
				dom('th', {html: col}, tr);
			});
		},
		
		renderBody: function(items){
			dom.clean(this.container);
			var
				table = dom('table', {}, this.container);
				
			items.forEach(function(item){
				var tr = dom('tr', {}, table);
				Object.keys(item).forEach(function(key){
					dom('td', {html: item[key]}, tr);
				});
			});
		},
		
		render: function(items){
			var columns = Object.keys(items[0]);
			this.renderHeader(columns);
			this.renderBody(items);
		},
		
		build: function(nodeId){
			this.node = dom('div', {css:this.baseClass}, nodeId);
			this.header = dom('div', {css:this.headerClass},
				dom('div', {css:this.headerWrapClass}, this.node));
			this.container = dom('div', {css:this.containerClass}, this.node);
			
		}
	});

});