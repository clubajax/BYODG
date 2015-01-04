define([
	'declare',
	'dom',
	'on'
], function(declare, dom, on){
	
	return declare({
		declaredClass: 'grid',
		
		baseClass:'base-grid',
		rowClass:'base-grid-row',
		headerWrapClass:'base-grid-header-wrap',
		headerClass:'base-grid-header',
		containerClass:'base-grid-container',
		scrollerClass:'base-grid-scroller',
		
		templateString:'<div class="${baseClass}"><div class="base-grid-header-wrap"><div data-dojo-attach-point="header" class="${headerClass}"></div></div><div data-dojo-attach-point="container" class="${containerClass}"><div data-dojo-attach-point="scroller" class="${scrollerClass}"></div></div></div>',
		rowLabelValueTemplate:'<div class="base-list-pair"><div class="base-list-label">{LABEL}</div><div class="base-list-text">{TEXT}</div></div>',
		rowLabelTemplate:'<div class="base-list-pair"><div class="base-list-label">{LABEL}</div></div>',
		rowValueTemplate:'<div class="base-list-pair"><div class="base-list-text">{TEXT}</div></div>',
		
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
			this.setColumnWidths();
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
		},
		
		setColumnWidths: function(){
			var
				i, minWidth, thw, tdw,
				container = this.container,
				header = this.header,
				headerTable = header.querySelector('table'),
				ths = headerTable.querySelectorAll('th'),
				colPercent = (100 / ths.length) + '%',
				containerTable = container.querySelector('table'),
				tds = containerTable.querySelector('tr').querySelectorAll('td');
				window.table = containerTable;
				
			
			// reset
			//
			// set containers to absolute and an arbitrary, small width
			// to force cells to squeeze together so we can measure their
			// natural widths
			dom.style(header, {
				position:'absolute',
				width:100
			});
			dom.style(container, {
				position:'absolute',
				width:100
			});
			dom.style(headerTable, 'width', 'auto');
			dom.style(containerTable, 'width', 'auto');
			// reset header THs
			for(i = 0; i < ths.length; i++){
				dom.style(ths[i], {width:'', minWidth:''});
				// TDs shouldn't have a width yet,
				// unless this is a resize
				dom.style(tds[i], {width:'', minWidth:''});
			}
			
			// wait for DOM to render before getting sizes
			window.requestAnimationFrame(function(){
				// after the next 
				for(i = 0; i < ths.length; i++){
					if(ths[i].className !== 'dummy'){
						thw = dom.box(ths[i]).width;
						tdw = dom.box(tds[i]).width;
						minWidth = Math.max(thw, tdw);
						dom.style(ths[i], {width:colPercent, minWidth:minWidth});
						dom.style(tds[i], {width:colPercent, minWidth:minWidth});
					}
				}
				// remove temp container styles
				dom.style(header, {
					position:'',
					width:''
				});
				dom.style(container, {
					position:'',
					width:''
				});
				// replace table widths
				dom.style(headerTable, 'width', '100%');
				dom.style(containerTable, 'width', '100%');
			});	
		}
	});

});