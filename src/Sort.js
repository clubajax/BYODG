define([
	'declare',
	'EventTree',
	'dom'
], function(declare, EventTree, dom){
	
	return declare(EventTree, {
		declaredClass: 'Sort',
		
		constructor: function(options){
			this.grid = options.grid;
			this.renderHandle = this.grid.on('header-click', this.onHeaderClick, this);
			if(options.sortProps){
				this.setSort(options.sortProps.column, options.sortProps.dir);
			}
		},
		
		setSort: function(nodeOrField, dir){
			var
				field,
				node;
			if(typeof nodeOrField === 'string'){
				field = nodeOrField;
				node = this.getNodeByField(nodeOrField);
			}else{
				node = nodeOrField;
				field = node.getAttribute('data-field');
			}
			if(this.currentCell){
				dom.classList.remove(this.currentCell, this.currentDir);	
			}
			
			this.currentDir = dir || '';
			this.currentCell = node;
			dom.classList.add(this.currentCell, this.currentDir);
			console.log('sort:', dir, this.currentDir, this.currentCell);
			this.emit('sort', {
				dir: this.currentDir,
				field: this.currentDir ? field : ''
			});
		},
				
		onHeaderClick: function(event){
			var
				sort = 'desc',
				target = event.cell;
			if(!target){
				return;
			}
			
			if(target === this.currentCell){
				if(this.currentDir === 'desc'){
					sort = 'asc';
				}
				else if(this.currentDir === 'asc'){
					sort = '';
				}
				else{
					sort = 'desc';
				}
			}
			this.setSort(target, sort);
		},
		
		getNodeByField: function(field){
			if(!this.cells){
				this.cells = this.getHeaderCells();
			}
			return this.cells.map[field];
		},
		
		getHeaderCells: function(){
			this.cells = [];
			this.cells.map = {};
			var
				i,
				field,
				cells = this.grid.header.getElementsByTagName('TH');
			for(i = 0; i < cells.length; i++){
				field = cells[i].getAttribute('data-field');
				if(field){
					this.cells.push(cells[i]);
					this.cells.map[field] = cells[i];
				}
			}
			return this.cells;
		}
	});
});