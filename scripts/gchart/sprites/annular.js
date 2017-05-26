define(['gchart/util', 'gchart/sprites/sprite'], function(util, Sprite){
	var Annular = function(data){
		Sprite.call(this, data);
		this.tag = 'path';
		this.type = 'annular';

	}
	Annular.prototype = new Sprite();
	/*
		options:
		x,y : coordinates for the center of the circle
		start, end : fill beyween these angles, clockwise
		innerRadius, outerRadius: distance from the center
		thickness: distance between innerRadius and outerRadius
		you should only specify two out of the three of the radius and thickness
	*/
	Annular.prototype.annularSector = function(options){
		var opts = this.initOptions(options);
		var p = [
			[opts.cx + opts.r2 * Math.cos(opts.startRadians),
			 opts.cy + opts.r2 * Math.sin(opts.startRadians)],
			[opts.cx + opts.r2 * Math.cos(opts.closeRadians),
			 opts.cy + opts.r2 * Math.sin(opts.closeRadians)],
			[opts.cx + opts.r1 * Math.cos(opts.closeRadians),
			 opts.cy + opts.r1 * Math.sin(opts.closeRadians)],
			[opts.cx + opts.r1 * Math.cos(opts.startRadians),
			 opts.cy + opts.r1 * Math.sin(opts.startRadians)]
		];
		var angleDiff = opts.closeRadians - opts.startRadians;
		var largeArc = (angleDiff % (Math.PI * 2)) > Math.PI ? 1 : 0;
		var d = [];
		d.push('M' + p[0].join());
		d.push('A' + [opts.r2, opts.r2, 0, largeArc, 1, p[1]].join());
		d.push('L' + p[2].join());
		d.push('A' + [opts.r1, opts.r1, 0, largeArc, 0, p[3]].join());
		d.push('Z');
		return d.join(' ');
	}
	//create a new object so that we don't mutate the original one.
	Annular.prototype.initOptions = function(o){
		var o2 = {
			cx : o.cx || 0,
			cy : o.cy || 0,
			startRadians : (o.start || 0) * Math.PI / 180,
			closeRadians : (o.end || 0) * Math.PI / 180,
		};
		var t = o.thickness !== undefined ? o.thickness : 100;
		if(o.innerRadius !== undefined) o2.r1 = o.innerRadius;
		else if( o.outerRadius != undefined) o2.r1 = o.outerRadius - t;
		else o2.r1 = 200 - t;

		if(o.outerRadius != undefined) o2.r2 = o.outerRadius;
		else o2.r2 = o2.r1 + t;

		if(o2.r1 < 0) o2.r1 = 0;
		if(o2.r2 < 0) o2.r2 = 0;

		return o2;
	}
	Annular.prototype.createNodeCase = function(){
		var cx = this.attribute('cx');
		var cy = this.attribute('cy');
		var start = this.attribute('start');
		var end = this.attribute('end');
		var innerRadius = this.attribute('innerRadius');
		var outerRadius = this.attribute('outerRadius');
		var d = this.annularSector({cx:cx, cy:cy, start:start, end:end, innerRadius:innerRadius, outerRadius:outerRadius});
		this.setAttribute({d: d});
		this.nodeCase = util.makeSVG(this.type, this.tag, this.properties);
		return this.nodeCase;
	}
	return Annular;
});