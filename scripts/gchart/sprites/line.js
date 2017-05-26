define(['gchart/util', 'gchart/sprites/sprite'], function(util, Sprite){
	var Line = function(data){
		Sprite.call(this, data);
		this.tag = 'line';
		this.type = 'line';
		this.setAttribute({
			'stroke-width': 1,
			'stroke' : '#1a1a1a'
		});
	}
	/*
	 * cx, xy, r
	 */
	Line.prototype = new Sprite();
	return Line;
});