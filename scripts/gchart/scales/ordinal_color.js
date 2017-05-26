define(['gchart/scales/scale', 'gchart/util'], function(Scale, util){
	function Ordinal_Color(domain, range){
		Scale.call(this, domain, range);
		this.range(util.color);
		this._map = {};
		this.index = 0;
		this._type = 'ordinal_color';
	}
	Ordinal_Color.prototype = new Scale();
	Ordinal_Color.prototype.map = function(){
		var k = 0, domain = this.domain();
		this._map = {};
		for (var i = 0; i < domain.length; i++) {
			if(this._map[domain[i]] == null){
				this._map[domain[i]] = k++;
			}
		}
	}
	Ordinal_Color.prototype.run = function(){
		var domain = this.domain(), range = this.range();
		if(domain == null && !util.isArray(domain) && domain.length > 0) util.err('domain','must be array and length of array must be greater than 0.');
		if(range == null && !util.isArray(range)) util.err('range', 'must be array');
		this.map();
		return this;
	}
	Ordinal_Color.prototype.exec = function(val){
		var index = this._map[val];
		if(index == null) util.err(val, "don't exist.");
		return this.range()[index];
	}

	return Ordinal_Color;
})