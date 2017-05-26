//Linear scale
define(['gchart/scales/scale'], function(Scale){
	/*
	 * domain array
	 * range array
	// var t = new Linear();
	// t.domain([0, 10]).range([0,100]).run();
	*/
	function Linear(domain, range){
		Scale.call(this, domain, range);
		this._re = undefined;
		this._step = -1;
		this._map = {};
		this._realDomain = [];
		this._padding = 5;
		this._type = 'linear';
	}
	//add super class prototype.
	Linear.prototype = new Scale();

	Linear.prototype.run = function(){
		this._ticks = [];
		var domain = this.domain(), range = this.range(), step, flag, count;
		if(domain == null && !util.isArray(domain) && domain.length > 0) util.err('domain','must be array and length of array must be greater than 0.');
		if(range == null && !util.isArray(range)) util.err('range', 'must be array');
		flag = domain[1] > domain[0] ? true : false;
		count = this.count() == null ? 10 : this.count();
		//step = Math.abs(domain[1] - domain[0]) / count;
		step = this.niceStep(count, domain);
		this._step = step;
		var ss = Math.abs(step);
		this._realDomain[0] = Math.floor(domain[0] / ss) * ss;
		this._realDomain[1] = Math.ceil(domain[1] / ss) * ss + ss / 2;
		start = this._realDomain[0];
		while(start <= this._realDomain[1]){
			this._ticks.push(start);
			start += step;
		}
		//console.log(this.niceStep(count, domain));
		return this;
	};
	Linear.prototype.exec = function(val, flag){
		var realDomain = this._realDomain;
		var range = this.range();
		if(flag == null || !flag){
			return (val - realDomain[0]) / (realDomain[1] - realDomain[0]) * (range[1] - range[0]) + range[0];
		}else{
			return (val - range[0]) / (range[1] - range[0]) * (realDomain[1] - realDomain[0]) + realDomain[0];
		}
	};
	//TODO!!!!!!!!!!!!!!!!!!!!
	Linear.prototype.calTicks = function(){
		this._ticks = [];
		this.run();
	};
	Linear.prototype.step = function(){
		return this._step;
	}
	Linear.prototype.niceStep = function(count, domain){
		function bestRatio(step){
			span = Math.abs(domain[1] - domain[0]);
			var best = 0;
			var lastDiffCount = Math.abs(span / step - count), diff;
			for (var i = 1; i < ratio.length; i++) {
				diff = Math.abs(span / (ratio[i] * step) - count);
				if(diff < lastDiffCount){
					best = i;
					lastDiffCount = diff;
				}
			}
			return best;
		}
		var start = domain[0], end = domain[1];
		var flag = domain[1] >= domain[0] ? true : false;
		//get the step that in the 10^x;
		var step = Math.pow(10, Math.floor(Math.log10(Math.abs((end - start) / count))));
		var ratio = [1, 2, 2.5, 5, 10];
		var index = bestRatio(step);
		var betterStep = ratio[index] * step; 
		//var tmp = Math.pow(10, Math.lg(Math.floor((end - begin) / count)));
		return flag ? betterStep : betterStep * (-1);
	}
	return Linear;
});