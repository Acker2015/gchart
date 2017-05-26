/*
 * path sprite
 */
define(['gchart/util', 'gchart/sprites/sprite'], function(util, Sprite){
	var Path = function(data){
		Sprite.call(this, data);
		this.type = 'path';
		this.tag = 'path';
		this.setAttribute({
			fill: 'none',
			stroke: '#ccc',
			'stroke-width': 1
		});
	}
	/*
	 * cx, xy, r
	 */
	Path.prototype = Object.create(Sprite.prototype);
	return Path;
});