define(['gchart/style/spriteProperties'], function(prop){
	var ctx;
	var svgRoot;
	var commonProp = prop.common;
	function getCanvas2dContext(){
		if(ctx != null) return ctx;
		var cv = createHiddenSketchpad();
		ctx = cv.getContext('2d');
		return ctx;
	}
	function createHiddenSketchpad(width, height){
		var cv = document.createElement('canvas');
		if(width != undefined) cv.width = width;
		if(height != undefined) cv.height = height;
		return cv;
	}
	function fontToString(font){
		var style = (font.style == undefined) ? 'normal' : font.style;
		var weight = (font.weight == undefined) ? 400 : font.weight;
		var size = (font.size == undefined) ? '14px' : font.size;
		var family = (font.family == undefined) ? 'Arial' : font.family;
		return style + ' ' + weight + ' ' + size + ' ' + family;
	}
	var help = {};
	help.color = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', 
	              '#ff69b4', '#ba55b3', '#cd5c5c', '#ffa500', '#40e0d0',
	              '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
	              '#6699ff', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];
	Array.prototype.each = function(f){
		for(var i = 0; i < this.length; ++i){
			f(this[i], i);
		}
	}
	// Object.prototype.each = function(f){
	// 	for(k in this){
	// 		f(k, this[k]);
	// 	}
	// }
	help.isArray = function(v){
		return Object.prototype.toString.call(v) == '[object Array]';
	}
	help.isObject = function(v){
		return Object.prototype.toString.call(v) == '[object Object]';
	}
	help.isString = function(v){
		return typeof v == 'string';
	}
	help.isNumber = function(v){
		return typeof v == 'number';
	}
	help.isBoolean = function(v){
		return typeof v == 'boolean';
	}
	help.err = function(v, info){
		console.error(v, ' : ',info);
	}
	help.sum = function(arr){
		var t = 0;
		arr.each(function(d, i){
			t += d;
		});
		return t;
	}
	help.angle2Radian = function(d){
		return d * Math.PI / 180;
	}
	help.setSvgRoot = function(root){
		svgRoot = root;
	}
	help.svgRoot = function(){
		return svgRoot;
	}
	/*
       find all children that meet the predicate condition within the height of their children.
	*/
	help.findAll = function(node, predicate, height){
		var result = [], tmp, len;
		var queue = [];
		queue.push(node);
		if(height == null) height = 10000;
		while(queue.length > 0 && height > 0){
			len = queue.length;
			for(var i =0 ; i < len; ++i){
				tmp = queue.shift();
				var children = tmp.children();
				if(children == null || children.length <= 0) continue;
				for(var j = 0; j < children.length; ++j){
					//console.log(children[j]);
					if(predicate(children[j], j)){
						result.push(children[j]);
					}
					queue.push(children[j]);
				}
			}
			height--;
		}
		return result;
	}
	help.find = function(node, predicate, height){
		var tmp, len;
		var queue = [];
		queue.push(node);
		if(height == null) height = 10000;
		while(queue.length > 0 && height > 0){
			len = queue.length;
			for(var i =0 ; i < len; ++i){
				tmp = queue.shift();
				var children = tmp.children();
				if(children == null || children.length <= 0) continue;
				for(var j = 0; j < children.length; ++j){
					//console.log(children[j]);
					if(predicate(children[j], j)){
						return children[j];
					}
					queue.push(children[j]);
				}
			}
			height--;
		}
		return null;
	}
	/*
	var predicate = function(n){
		n.dynamicAttribute('kind') == 'bar';
	}
	*/
	help.selectAll = function(node, predicate){
		return this.findAll(node, predicate);
	}
	help.select = function(node, predicate){
		return this.find(node, predicate);
	}
	help.makeSVG = function(type, tag, attrs) {
		var whichProp = prop[type];
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs){
        	if(commonProp[k] == null && whichProp[k] == null) continue;
            el.setAttribute(k, attrs[k]);
        }
        return el;
    }
	help.measureText= function(str, font){
		var ctx = getCanvas2dContext();
		ctx.save();
		ctx.font = fontToString(font);
		console.log(fontToString(font));
		var mes = ctx.measureText(str);
		var size = (font.size == null) ? '14px' : font.size;
		var pos = size.indexOf('px'); 
		mes.height = Number(size.slice(0, pos));
		ctx.restore();

		return mes;
	}
	help.textBbox = function(str, font){
		var t = this.makeSVG('text', 'text', font);
		t.innerHTML= str;
		svgRoot.appendChild(t);
		var bbox = svgRoot.getBBox();
		svgRoot.removeChild(t);
		return bbox;
	}
	return help;

});