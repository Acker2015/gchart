//set as super class of scale 
define(['gchart/util'], function(util){
	var Init = function(domain, range){
		this._domain = domain == null ? [] : domain;
		this._range = range == null ? [] : range;
		this._count = 10;
		this._density = 50;
		this._ticks = [];
	}
	Init.prototype = {
		//domain
		domain: function(d){
			if(d == null) return this._domain;
			if(!util.isArray(d)) util.err(d, 'must be array.');
			this._domain = d;
			return this;
		},
		//range
		range: function(r){
			if(r == null) return this._range;
			if(!util.isArray(r)) util.err(r, 'must be array.');
			this._range = r;
			return this;
		},
		//tick count
		count: function(c){
			if(c == null) return this._count;
			this._count = Number(c);
			this.calTicks();// need the calculate again after updating the count.
			return this;
		},
		//tick density
		// TODO
		density: function(d){
			if(d == null) return this._density;
			this._density = Number(d);
			return this;
		},
		//ticks get&set
		ticks: function(t){
			if(t == null) return this._ticks;
			this._ticks = t;
			return this;
		},
		step: function(){
			return this._step;
		},
		type: function(){
			return this._type;
		}
	}
	return Init;
});