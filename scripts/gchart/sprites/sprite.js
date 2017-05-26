define(['gchart/util'], function(util){
	// Sprite super class
	var Sprite = function(data){
		this.type = undefined;
		// this.x; this.y;this.width;this.height;this.fill;this.stroke;this.strokeWidth;this.opacity;
		this._children = [];
		this._parent = undefined;
		this._data = (data == null ? {} : data);
		this.properties = {};
		this.dynamicProperties = {};
		this._element = undefined;
		this._parentElement = undefined;
		this.nodeCase = undefined;
	}
	Sprite.prototype.children = function(){
		return this._children;
	}
	Sprite.prototype.parent = function(){
		return this._parent;
	}
	Sprite.prototype.addChild = function(d){
		this._children.push(d);
	}
	Sprite.prototype.setParent = function(p){
		this._parent = p;
	}
	Sprite.prototype.setAttribute = function(){
		var t = arguments[0];
		if(util.isString(t) && arguments.length >= 2){
			this.properties[t] = arguments[1];
		}else if(util.isObject(t)){
			for(k in t){
				this.properties[k] = t[k];
			}
		}else util.err(t, ' is not accepted.');
	}
	Sprite.prototype.attribute = function(key){
		return this.properties[key];
	}
	Sprite.prototype.setData = function(data){
		this._data = data;
	}
	Sprite.prototype.data = function(data){
		return this._data;
	}
	Sprite.prototype.moveTo = function(x, y){
		if(x == undefined || y == undefined) util.err('x or y', ' is not accepted.');
		this.setAttribute({x: x, y: y});
	}
	Sprite.prototype.moveBy = function(x, y){
		x = x || 0;
		y = y || 0;
		this.properties.x += x;
		this.properties.y += y;
	}
	Sprite.prototype.kind = function(k){
		if(k == null) return this.dynamicProperties.kind;
		this.dynamicProperties.kind = k;
	}
	Sprite.prototype.id = function(id){
		if(id == null) return this.dynamicProperties.id;
		return this.dynamicProperties.id = id;
	}
	Sprite.prototype.setDynamicAttribute = function(){
		var t = arguments[0];
		if(util.isString(t) && arguments.length >= 2){
			this.dynamicProperties[t] = arguments[1];
		}else if(util.isObject(t)){
			for(k in t){
				this.dynamicProperties[k] = t[k];
			}
		}else util.err(t, ' is not accepted.');
	}
	Sprite.prototype.dynamicAttribute = function(k){
		return this.dynamicProperties[k];
	}
	// pull the parent data.
	Sprite.prototype.getParentData = function(){
		var parent = this._parent;
		return parent.data();
	}
	//append
	Sprite.prototype.appendAll = function(node, data){
		if(this.type != 'container') util.err(node, ' is not a container, so you can not append child for this node.');
		var appendEles = [];
		for(var i = 0; i < data.length; ++i){
			var newNodeCase = new node(data[i]);
			this.addChild(newNodeCase);
			newNodeCase.setParent(this);
			appendEles.push(newNodeCase);
		}
		return appendEles;
	}
	Sprite.prototype.append = function(node, d){
		if(this.type != 'container') util.err(node, ' is not a container, so you can not append child for this node.');
		var newNodeCase = new node(d);
		this.addChild(newNodeCase);
		newNodeCase.setParent(this);
		return newNodeCase;
	};
	Sprite.prototype.element = function(e){
		if(e == null) return this._element;
		this._element = e;
	}
	Sprite.prototype.parentElement = function(e){
		if(e == null) return this._parentElement;
		this._parentElement = e;
	}
	Sprite.prototype.createNodeCase = function(){
		this.nodeCase = util.makeSVG(this.type, this.tag, this.properties);
		return this.nodeCase;
	};
	return Sprite;
})