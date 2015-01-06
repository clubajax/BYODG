define([
	'declare',
	'EventTree',
	'dom',
	'on'
], function(declare, EventTree, dom, on){
	
	return declare(EventTree, {
		declaredClass: 'Selection',
		constructor: function(options){
			this.grid = options.grid;
			this.clickHandler = options.clickHandler;
			this.clickHandler.on('row-click', this.select, this);
		},
		
		select: function(event){
			if(typeof event.index !== 'number'){
				console.warn('Failed to select numeric row index of', event.index);
				return;
			}
			if(!this.grid.table){
				console.warn('Table not ready to select row');
				return;
			}
			var
				row = this.grid.table.rows[event.index],
				item = this.grid.items[event.index],
				emitEvent = {
					item:item,
					index: event.index,
					row: row
				};
				
			if(event.cell){
				emitEvent.cell = event.cell;
				emitEvent.field = event.cell.getAttribute('data-field');
			}
			
			if(this.currentRow){
				dom.classList.remove(this.currentRow, 'selected');
			}
			
			this.currentRow = row;
			dom.classList.add(this.currentRow, 'selected');
			
			this.emit('select-row', emitEvent);
		}
	});
});