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
		
		
		render: function(items){
			dom.clean(this.container);
			
			var columns = Object.keys(items[0]),
				table = dom('table', {}, this.container),
				head = dom('thead', {}, table),
				tr = dom('tr', {}, head),
				body = dom('tbody', {}, table);
				
			columns.forEach(function(col){
				dom('th', {html: col}, tr);
			});
				
			items.forEach(function(item){
				var tr = dom('tr', {}, body);
				Object.keys(item).forEach(function(key){
					dom('td', {html: item[key]}, tr);
				});
			});	
			
		
		},
		
		build: function(nodeId){
			this.node = dom('div', {css:this.baseClass}, nodeId);
			this.container = dom('div', {css:this.containerClass}, this.node);
			
		}
	});

});