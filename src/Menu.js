define([
	'declare',
	'EventTree',
	'on',
	'dom'
], function(declare, EventTree, on, dom){
	
	return declare(EventTree, {
		declaredClass: 'Menu',
		items: null,
		baseClassName: 'base-menu',
		button:null,
		parentNode: null,
		closeOnSelect: true,
		itemFieldName: 'value',
		align: 'bottom',
		
		constructor: function(){
			this._listeners = [];
			this.groups;
			this.nodes = {};
		},
		
		postCreate: function(){
			var
				self = this,
				buttonNode,
				menuDialog,
				menuHandle,
				menuShowing,
				className = this.baseClassName;
				
			// button:
			if(this.button){
				buttonNode = this.button.domNode;
			}else{
				buttonNode = dom('div', {className:'base-icon icon-add'}, this.parentNode);
				this.button = {
					domNode: buttonNode
				};
			}
			
			// popup menu container
			menuDialog = this.menuDialog = dom('div', {className:className}, document.body);
			
			function show(){
				menuShowing = 1;
				menuDialog.style.display = 'block';
				self.position();
				setTimeout(menuHandle.resume, 1);
			}
			
			function hide(){
				menuShowing = 0;
				menuDialog.style.display = 'none';
				menuHandle.pause();
			}
			
			this._listeners.push(on(buttonNode, 'click', function(){
				if(menuShowing){
					hide();	
				}
				else{
					show();
				}
			}));
			

			this.render();
			
			menuHandle = on(document.body, 'click', function(event){
				var
					isCheckbox,
					checked,
					index,
					node,
					group,
					groups = this.groups,
					css = event.target.className;
					
				if(/checkbox/.test(css) || /label/.test(css)){
					node = event.target.parentNode;
					css = node.className;
				}
				else if(/item/.test(css)){
					node = event.target;
				}
				else{
					hide();
				}
				
				if(!node){
					console.log('click-off menu');
					return;
				}
				
				index = +(node.getAttribute('data-index'));
				group = node.getAttribute('data-group');
				if(group){
					if(groups[group].currentMenuItem){
						dom.css.remove(groups[group].currentMenuItem, 'checked');
						groups[group].currentMenuItem = node;
						dom.css.add(groups[group].currentMenuItem, 'checked');
					}		
				}
				else if(!isCheckbox){
					if(/checked/.test(css)){
						dom.css.remove(node, 'checked');
						checked = false;
					}
					else{
						dom.css.add(node, 'checked');
						checked = true;
					}
				}
				
				
				// TODO
				// save it in owner class...
				//profile.set(self.id, this.items[index]),
				this.emit('change', {
					index: index,
					field: this.items[index][this.itemFieldName],
					checked: checked, 
					item: this.items[index],
					value: this.items[index].value
				});
				if(this.closeOnSelect){
					hide();
				}
				
			}.bind(this));
			
			this._listeners.push(menuHandle);
			hide();	
		},
		
		position: function(){
			var
				top,
				winH = window.innerHeight,
				box = dom.box(this.menuDialog),
				pos = dom.pos(this.button.domNode);
			
			if(pos.y + pos.h + box.h > winH){
				top = pos.y - box.h - 10 + 'px';
			}else{
				top = pos.y + pos.h + 'px';
			}
			
			dom.style.set(this.menuDialog, {
				left: (pos.x - box.w) + 'px',
				top: top
			});
		},
		
		render: function(){
			var
				i,
				itemNode,
				txt,
				cls,
				groups = {},
				menuDialog = this.menuDialog,
				currentMenuItem;
				
			for(i = 0; i < this.items.length; i++){
				if(this.items[i].divider){
					dom('div', {className:'base-menu-divider'}, menuDialog);
				}
				else if(this.items[i].checkbox){
					// checkboxes to match those from dgrid
					txt = this.items[i].label;
					cls = 'base-menu-item' + (this.items[i].selected ? ' checked' : '');
					
					itemNode = dom('label', {className:cls, 'data-index':i}, menuDialog);
					
					//dom('input', {type:'checkbox', checked:!!this.items[i].selected}, itemNode);
					dom('span', {className:'checkbox'}, itemNode);
					dom('span', {className:'label', innerHTML:txt}, itemNode);
				}
				else{ //radio checkmarks
					txt = this.items[i].label;
					cls = 'base-menu-item item-' + i + (this.items[i].selected ? ' checked' : '');
					itemNode = dom('div', {className:cls, 'data-index':i}, menuDialog);
					
					if(this.items[i].group){
						itemNode.setAttribute('data-group', this.items[i].group);
						if(!groups[this.items[i].group]){
							groups[this.items[i].group] = {};
						}
						if(this.items[i].selected){
							groups[this.items[i].group].currentMenuItem = itemNode;
						}
						this.items[i].node = itemNode;
					}
					dom('span', {className:'checkbox'}, itemNode);
					dom('span', {className:'label', innerHTML:txt}, itemNode);
					
					if(this.items[i].selected){
						currentMenuItem = itemNode;
					}
				}
				
				this.nodes[this.items[i].field] = itemNode;
			}
			
			this.groups = groups;
		},
		
		enableOptions: function(fields){
			fields.forEach(function(field){
				//var item = this.items.find(function(item){ return item.field === field; });
				//if(item){
				if(this.nodes[field]){
					dom.css.remove(this.nodes[field], 'disabled');
				}
			}, this);
		},
		
		disableOptions: function(fields){
			fields.forEach(function(field){
				if(this.nodes[field]){
					dom.css.add(this.nodes[field], 'disabled');
				}
			}, this);
		},
		
		setSelected: function(value){
			// currently a quick and dirty way of setting a group value
			var i, item;
			for(i = 0; i < this.items.length; i++){
				if(this.items[i].value === value){
					item = this.items[i];
					break;
				}
			}
		},
		
		destroy: function(){
			this._listeners.forEach(function(h){ h.remove(); });
			this.domNode = null;
		}
		
	});
});