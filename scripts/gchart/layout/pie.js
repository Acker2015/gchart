define(['gchart/style/style', 'gchart/util'], function(Style, util){

	function addEvent(nodes){
		nodes.each(function(node, i){
			$(node).click(function(){
				console.log('123');
			});
		});
	}

	function layout(info){
		var d;
		var space = info.space;
		var label = info.label;
		var data = info.data;
		var angleData = info.angleData;
		var scale = info.scale;
		var root = info.root;
		var annularNodes = util.selectAll(root, function(node, i){
			return node.kind() == 'sector';
		});
		var textNodes = util.selectAll(root, function(node, i){
			return node.kind() == 'text';
		})
		var maxSpan = Math.min(space.width, space.height);
		// var R = Math.floor(0.9 * maxSpan / 2);
		annularNodes.each(function(node, i){
			d  = node.data();
			if(d.start == 0 && d.end == 360) d.end = 359.99;
			node.setAttribute({
				cx: space.width / 2,
				cy: space.height / 2,
				start: d.start,
				end: d.end,
				innerRadius : d.innerRadius,
				outerRadius : d.outerRadius,
				fill: scale.exec(d.category),
			});
		});
		//addEvent(annularNodes);
		textNodes.each(function(node, i){
			d = node.data(); 
			var va = (d.start + d.end) / 2;
			var text = label.text(d.origin_data, i);
			node.setAttribute('text', text);
			var bbox = node.getBBox();
			var useR = (d.innerRadius + d.outerRadius) / 2;
			var dx = Math.cos(util.angle2Radian(va)) * useR;
			var dy = Math.sin(util.angle2Radian(va)) * useR;
			node.setAttribute({
				x: space.width / 2 + dx - bbox.width / 2,
				y: space.height / 2 + dy + bbox.height / 2 
			});
		})
		root.setX(space.x);
		root.setY(space.y);
	}

	return layout;
});