define([
	'gchart/style/style',
	'gchart/util'], function(Style, util){
		var axisStyle = Style.axis;//axis : {tick: 3,padding: 5,tick_text: 2}
		console.log(axisStyle);
		function layoutX(info){
			var root = info.root;
			var scale = info.scale;
			var space = info.space;
			var range = scale.range();
			
			var lineNode = util.select(root, function(node, i){
				return node.kind() == 'line';
			});
			var tickNodes = util.selectAll(root, function(node, i){
				return node.kind() == 'tick';
			});
			var textNodes = util.selectAll(root, function(node, i){
				return node.kind() == 'text';
			});

			lineNode.setAttribute({
				x1:range[0], y1:1, x2:range[1],y2:1,stroke:axisStyle.stroke
			});
			tickNodes.each(function(node, i){
				var d = node.data();
				var location = scale.exec(d);
				node.setAttribute({
					x1:location, y1: 0, x2: location, y2: axisStyle.tick,stroke:axisStyle.stroke
				});
			});
			textNodes.each(function(node, i){
				var d = node.data();
				var location = scale.exec(d);
				node.setAttribute('text', d);
				var bbox = node.getBBox();
				node.setAttribute({
					x: location - bbox.width / 2,
					y: axisStyle.tick + axisStyle.tick_text + bbox.height,
					text: d,
					fill:axisStyle.fill
				});
			});
			root.setX(space.x + 0.5);
			root.setY(space.y - 0.5);
		}
		function layoutY(info){
			var root = info.root;
			var scale = info.scale;
			var space = info.space;
			var range = scale.range();
			var lineNode = util.select(root, function(node, i){
				return node.kind() == 'line';
			});
			var tickNodes = util.selectAll(root, function(node, i){
				return node.kind() == 'tick';
			});
			var textNodes = util.selectAll(root, function(node, i){
				return node.kind() == 'text';
			});
			lineNode.setAttribute({
				x1: space.width, y1: range[0], x2: space.width, y2: range[1],stroke:axisStyle.stroke
			});
			tickNodes.each(function(node, i){
				var d = node.data();
				var location = scale.exec(d);
				node.setAttribute({
					x1: space.width, y1: location, x2: space.width - axisStyle.tick, y2: location,stroke:axisStyle.stroke
				});
			});
			textNodes.each(function(node, i){
				var d = node.data();
				var location = scale.exec(d);
				node.setAttribute('text', d);
				var bbox = node.getBBox();
				node.setAttribute({
					x: space.width - axisStyle.tick - axisStyle.tick_text - bbox.width,
					y: location + bbox.height / 2,
					text: d,
					fill:axisStyle.fill
				});
			})
			root.setX(space.x + 0.5);
			root.setY(space.y + 0.5);
		}	
		function layout(info, which){
			if(which == 'x') layoutX(info);
			if(which == 'y') layoutY(info);
		}
		return layout;
	});