//Ordinal scale
define(['gchart/scales/scale', 'gchart/util'], function(Scale, util){
	/*
	 * domain array
	 * range array
	 * ['CD', 'MP4', 'TY', 'DD']

	// var test = new Ordinal();
	// test.domain(['CD', 'MP4', 'TY', 'DG', 'UR']).range([0, 100]).run();
	*/
	function Ordinal(domain, range){
		Scale.call(this, domain, range);
		this._re = undefined;
		this._step = -1;
		this._map = {};
		this._type = 'ordinal';
	};
	Ordinal.prototype = new Scale();
	Ordinal.prototype.run = function(){
		var domain = this.domain(), range = this.range(), len, step;
		if(domain == null && !util.isArray(domain) && domain.length > 0) util.err('domain','must be array and length of array must be greater than 0.');
		if(range == null && !util.isArray(range)) util.err('range', 'must be array');
		this.map();
		len = domain.length, step = (range[1] - range[0]) / len;
		this._re = [];
		this._step = Math.abs(step);
		for(var i = 0; i < len; ++i){
			this._re.push(range[0] + i * step + step / 2);
		}
		this.calTicks();
		return this;
	};
	Ordinal.prototype.map = function(){
		var k = 0, domain = this.domain();
		this._map = {};
		for (var i = 0; i < domain.length; i++) {
			if(this._map[domain[i]] == null){
				this._map[domain[i]] = k++;
			}
		}
	};
	Ordinal.prototype.exec = function(val){
		var index = this._map[val];
		if(index == null) util.err(val, "don't exist.");
		return this._re[index];
	};
	Ordinal.prototype.calTicks = function(){
		var ticks = this.ticks();
		ticks = [];
		var count = this.count();
		var density = this.density();
		var range = this.range();
		var domain = this.domain();
		var len = domain.length;
		var realCount = count > len ? len : count;
		var step = Math.ceil(len / realCount);
		for(var i = 0; i < len; i += step){
			ticks.push(domain[i]);
		}
		this.ticks(ticks);
		return this;
	};
	return Ordinal;
});