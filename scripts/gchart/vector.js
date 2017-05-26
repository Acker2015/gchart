define([], function(){
	var Vector = function(x, y){
		this.x = x;
		this.y = y;
	}
	/*
	 length: get the length of vector  {(0, 0) -> vector}
	 normalize: convert the vector to unit vector
	 add: vector adding
	 multiple: vector * f
	 dot: inner product
	 angle: the angle of two vectors
	 */
	Vector.prototype = {
		length : function(){
			return Math.sqrt(this.x * this.x + this.y * this.y);
		},
		normalize: function(){
			var inv = 1 / this.length();
			return new Vector(this.x * inv, this.y *inv);
		},
		add: function(v){
			return new Vector(this.x + v.x, this.y + v.y);
		},
		multiply: function(f){
			return new Vector(this.x * f, this.y * f);
		},
		dot: function(v){
			return new Vector(this.x * v.x, this.y * v.y);
		},
		angle: function(v){
			return Math.acos(this.dot(v) / (this.length() * v.length())) * 180 / Math.PI;
		}
	}
	//path = [{x: 50, y: 50}, {x: 200, y: 100}, {x: 250, y: 50}, {x: 350, y:150}, {x:370, y:100}, {x:570, y: 200}];
	function getControlPoint(path){
		var rt = 0.3;
		var i = 0, count = path.length - 2;
		var arr = [];
		for(; i < count; ++i){
			var a = path[i], b = path[i + 1], c = path[i + 2];
			var v1 = new Vector(a.x - b.x, a.y - b.y);
			var v2 = new Vector(c.x - b.x, c.y - b.y);
			var v1_len = v1.length(), v2_len = v2.length();
			var centerV = v1.normalize().add(v2.normalize()).normalize();
			var ncp1 = new Vector(centerV.y, centerV.x * -1);
			var ncp2 = new Vector(centerV.y * -1, centerV.x);
			if(ncp1.angle(v1) < 90){
				var p1 = ncp1.multiply(v1_len * rt).add(b);
				var p2 = ncp2.multiply(v2_len * rt).add(b);
			}else{
				var p1 = ncp1.multiply(v2_len * rt).add(b);
				var p2 = ncp2.multiply(v1_len * rt).add(b);
			}
			(p1.x < p2.x) ? arr.push(p1, p2) : arr.push(p2, p1);
		}
		return arr;
	}
	function createBezierLine(path){
		var len = path.length;
		var arr = getControlPoint(path);
		arr.unshift(path[1]);
		arr.push(path[len - 1]);
		var d = `M${path[0].x} ${path[0].y} `;
		var k = 0;
		for(var i = 1; i < len; ++i){
			d += `C ${arr[k].x} ${arr[k++].y}, ${arr[k].x} ${arr[k++].y}, ${path[i].x} ${path[i].y} `;
		}
		return d;
	}
	return {
		Vector: Vector,
		getControlPoint: getControlPoint,
		createBezierLine: createBezierLine
	}
});