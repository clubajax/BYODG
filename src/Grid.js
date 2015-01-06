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
			this.setColumnWidths();
			this.connectClicks();
			this.emit('render', this);
		},
		
		build: function(nodeId){
			this.node = dom('div', {css:this.baseClass}, nodeId);
			this.header = dom('div', {css:this.headerClass},
				dom('div', {css:this.headerWrapClass}, this.node));
			this.container = dom('div', {css:this.containerClass}, this.node);
			this.connectScroll();
		},
		
		select: function(index, cell){
			if(typeof index !== 'number'){
				console.warn('Failed to select numeric row index of', index);
				return;
			}
			if(!this.table){
				console.warn('Table not ready to select row');
				return;
			}
			var
				row = this.table.rows[index],
				item = this.items[index],
				event = {
					item:item,
					index: index,
					row: row
				};
			if(cell){
				event.cell = cell;
				event.field = cell.getAttribute('data-field');
			}
			
			if(this.currentRow){
				dom.classList.remove(this.currentRow, 'selected');
			}
			
			this.currentRow = row;
			dom.classList.add(this.currentRow, 'selected');
			
			this.emit('select-row', event);
		},
		
		onRowClick: function(event){
			var
				index,
				cell = on.ancestor(event.target, 'TD'),
				row = on.ancestor(event.target, 'TR');
			if(!row){ return; }
			
			index = +(row.getAttribute('data-index'));
			
			this.select(index, cell);
		},
		
		onHeaderClick: function(event){
			var
				cell = on.ancestor(event.target, 'TH'),
				field = cell.getAttribute('data-field'),
				emitEvent = {
					field: field,
					cell: cell
				};
			
			this.emit('header-click', emitEvent);
		},
		
		onDoubleClick: function(event){
			var
				index,
				emitEvent,
				item,
				cell = on.ancestor(event.target, 'TD'),
				field = cell.getAttribute('data-field'),
				row = on.ancestor(event.target, 'TR');
			if(!row){ return; }
			
			index = +(row.getAttribute('data-index'));
			item = this.items[index];
			
			emitEvent = {
				cell: cell,
				item: item,
				field: field,
				value: item[field],
				row: row,
			};
			
			this.emit('edit', emitEvent);
		},
		
		onKey: function(event){
			if(event.keyCode === 13){
				this.onDoubleClick(event);
			}
		},
		
		connectClicks: function(){
			if(this.clickHandles){
				this.clickHandles.forEach(function(h){ h.remove(); });
			}
			
			this.clickHandles = [
				on(this.header, 'click', this.onHeaderClick, this),
				on(this.container, 'click', this.onRowClick, this),
				on(this.container, 'dblclick', this.onDoubleClick, this),
				on(this.container, 'keyup', this.onKey, this)
			];
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