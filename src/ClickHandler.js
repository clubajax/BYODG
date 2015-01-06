define([
	'declare',
	'EventTree',
	'dom',
	'on'
], function(declare, EventTree, dom, on){
	
	return declare(EventTree, {
		declaredClass: 'ClickHandler',
		constructor: function(options){
			this.grid = options.grid;
			this.grid.on('render', this.handleClicks, this);
		},
		
		onRowClick: function(event){
			var
				index,
				emitEvent,
				cell = on.ancestor(event.target, 'TD'),
				row = on.ancestor(event.target, 'TR');
			if(!row){ return; }
			
			index = +(row.getAttribute('data-index'));
			
			emitEvent = {
				index: index,
				cell: cell,
				row: row
			};
			this.emit('row-click', emitEvent);
			
			//this.grid.select(index, cell);
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
			item = this.grid.items[index];
			
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
		
		handleClicks: function(grid){
			if(this.clickHandles){
				this.clickHandles.forEach(function(h){ h.remove(); });
			}
			
			this.clickHandles = [
				on(grid.header, 'click', this.onHeaderClick, this),
				on(grid.container, 'click', this.onRowClick, this),
				on(grid.container, 'dblclick', this.onDoubleClick, this),
				on(grid.container, 'keyup', this.onKey, this)
			];
		}
	});
});