define([
	'declare',
	'EventTree',
	'dom',
	'on'
], function(declare, EventTree, dom, on){
	
	return declare(EventTree, {
		declaredClass: 'ColumnSizer',
		constructor: function(options){
			this.grid = options.grid;
			this.grid.on('render', this.sizeColumns, this);
		},
		
		sizeColumns: function(grid){
			var
				i, minWidth, thw, tdw,
				container = grid.container,
				header = grid.header,
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