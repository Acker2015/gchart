define(['gchart/util', 'gchart/sprites/sprite'], function(util, Sprite){
	function init(d){
		d['transform'] = 'translate(0, 0)';
	}
	var Container = function(data){
		Sprite.call(this, data);
		this.tag = 'g';
		this.type = 'container';
		init(this.properties);

	}
	Container.prototype = new Sprite();
	Container.prototype.setX = function(x){
		this.setAttribute('x', x);
		this._setTransform();
	}
	Container.prototype.setY = function(y){
		this.setAttribute('y', y);
		this._setTransform();
	}
	Container.prototype._setTransform = function(){
		var x = this.properties.x || 0;
		var y = this.properties.y || 0;
		var value = `translate(${x}, ${y})`;
		this.setAttribute('transform', value);
	}

	return Container;
});