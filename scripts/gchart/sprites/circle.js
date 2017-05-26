/*
 * circle sprite
 */
define(['gchart/util', 'gchart/sprites/sprite'], function(util, Sprite){
	var Circle = function(data){
		Sprite.call(this, data);
		this.type = 'circle';
		this.tag = 'circle';
		this.setAttribute({
			fill:'#777',
			stroke: 'none'
		});
	}
	/*
	 * cx, xy, r
	 */
	Circle.prototype = new Sprite();
	Circle.prototype.moveTo = function(x, y){
		this.properties.cx = x;
		this.properties.cy = y;
	}
	Circle.prototype.moveBy = function(x, y){
		this.properties.cx += x;
		this.properties.cy += y;
	}
	return Circle;
});