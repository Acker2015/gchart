define(['gchart/util', 'gchart/sprites/sprite'], function(util, Sprite){
	var Rect = function(data){
		Sprite.call(this, data);
		this.tag = 'rect';
		this.type = 'rect';
	}
	/*
	 * cx, xy, r
	 */
	Rect.prototype = new Sprite();
	return Rect;
});