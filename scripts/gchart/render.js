define(['gchart/util'], function(util){
	var make = function(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs){
            el.setAttribute(k, attrs[k]);
        }
        return el;
    }
    var deal = function(parentEle, node){
    	var tag = node.tag;
    	var type = node.type;
    	var element = util.makeSVG(type, tag, node.properties);
    	parentEle.appendChild(element);
    	return element;
    }
    /*
    data:
    	[data0, data1, data2, data3, data4, data5];
     	root: data0
		
		data[i]:
		 {
			tag: tag,
			type : type,
			properties: {},
			parent: index, 			// parent
			children: [],  			// children
			ele: node,				// svg element
			parentEle: parentNode   // parent svg element
			kind: flag,             // kind to find
			id: id   				// id
		 }

	level traverse(BFS)
	*/
	var render = function(svg, root){
		var queue = [], len, ele, parentEle, node;
		if(root == null) return;
		root.parentElement(svg);
		queue.push(root);

		while(queue.length > 0){
			len = queue.length;
			for(var i = 0; i < len; ++i){
				node = queue.shift();
				parentEle = node.parentElement(); // parent element in svg
				var ele = node.createNodeCase(); 
				parentEle.appendChild(ele);
				node.element(ele); //set the element info for node.
				if(util.isArray(node.children())){
					var children = node.children();
					for(var j = 0; j < children.length; ++j){
						var childNode = children[j];
						childNode.parentElement(ele);
						queue.push(childNode);
					}
				}
			}
		}
	}
	function animation(svg, root, which){
		which = which || 1;
		var graph = util.select(root, function(node, i){
			return node.kind() == 'series';
		});
		var space = graph.data();
		var rect = make('rect', {x: space.x + 1, y: space.y, width: space.width, height: space.height, fill: '#fff'});
		svg.appendChild(rect);
		var attr = which == 1 ? 'height' : 'width';
		var measure = which == 1 ? space.height : space.width;
		if(which == 1){
			var tt = setInterval((function(len){
				return function(){
					measure -= len;
					len += 0.01;
					measure = measure <= 0 ? 0 : measure;
					rect.setAttribute(attr, measure);
					if(measure <= 0){
						clearInterval(tt);
						rect.setAttribute(attr, 0);
					}
				}
				
			})(2),1);
		}else if(which == 3){
			var tt = setInterval((function(opa){
				return function(){
					opa -= 0.002;
					opa = opa <= 0 ? 0 : opa;
					rect.setAttribute('fill-opacity', opa);
					if(opa<=0){
						clearInterval(tt);
					}
				}
				
			})(1),1);
		}else{
			var width = space.width;
			var x = space.x;
			var tt = setInterval((function(len){
				return function(){
					width -= len;
					x += len;
					len += 0.01;
					width = width <= 0 ? 0 : width;
					rect.setAttribute('x', x);
					if(width <= 0){
						clearInterval(tt);
						rect.setAttribute('width', 0);
					}
				}
				
			})(2),1);
		}
	}
	return {
		render:render,
		animation: animation
	}
});