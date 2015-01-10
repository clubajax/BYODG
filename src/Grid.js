define([
	'declare',
	'dom',
	'on',
	'EventTree'
], function(declare, dom, on, EventTree){
	
	return declare(EventTree, {
		declaredClass: 'grid',
		
		baseClass:'base-grid',
		rowClass:'base-grid-row',
		headerWrapClass:'base-grid-header-wrap',
		headerClass:'base-grid-header',
		containerClass:'base-grid-container',
		
		constructor: function(nodeId){
			this.build(nodeId);
		},
		
		renderHeader: function(columns){
			dom.clean(this.header, true);
			var
				table = dom('table', {}, this.header),
				tr = dom('tr', {}, table);
				
			columns.forEach(function(col){
				dom('th', {html: '<span>'+col+'</span>', attr:{'data-field': col}}, tr);
			});
		},
		
		renderBody: function(items){
			dom.clean(this.container, true);
			var
				table = dom('table', {}, this.container);
				
			items.forEach(function(item, i){
				var tr = dom('tr', {attr:{'data-index': i}}, table);
				Object.keys(item).forEach(function(key){
					dom('td', {html: item[key], attr:{'data-field': key, tabIndex: 1}}, tr);
				});
			});
			
			this.table = table;
		},
		
		render: function(items){
			this.items = items;
			this.emit('data', items);
			var columns = Object.keys(items[0]);
			this.renderHeader(columns);
			this.renderBody(items);
			this.emit('render', this);
		},
		
		build: function(nodeId){
			this.node = dom('div', {css:this.baseClass}, nodeId);
			this.header = dom('div', {css:this.headerClass},
				dom('div', {css:this.headerWrapClass}, this.node));
			this.container = dom('div', {css:this.containerClass}, this.node);
			this.connectScroll();
		},
		
		connectScroll: function(){
			var self = this;
			this.scrollHandle = on(this.container, 'scroll', function(event){
				self.header.scrollLeft = event.target.scrollLeft;
			});
		}
	});

});