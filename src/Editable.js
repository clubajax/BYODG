define([
	'declare',
	'EventTree',
	'dom',
	'on'
], function(declare, EventTree, dom, on){
	
	return declare(EventTree, {
		declaredClass: 'Editable',
		constructor: function(options){
			this.grid = options.grid;
			this.grid.on('edit', this.edit, this);
		},
		
		edit: function(event){
			
			var
				self = this,
				input,
				changed = false,
				value = event.value,
				orgValue = event.value,
				node = event.cell;
			
			function close(){
				dom.destroy(input);
				if(changed){
					event.item[event.field] = value;
					self.emit('change', event);
				}
				node.innerHTML = value; 
			}
			
			node.innerHTML = '';
			
			input = dom('input', {attr:{value: event.value}}, dom('div', {css: 'editable'}, node));
			input.focus();
			on(input, 'blur', close);
			on(input, 'keyup', function(event){
				if(event.keyCode === 27){
					changed = false;
					value = orgValue;
					input.blur();
				}
				else if(event.keyCode === 13){
					input.blur();
				}
				else{
					value = input.value;
					changed = true;
				}
			});
		}
	});
});