define(['gchart/style/style',
		'gchart/util',
		'gchart/vector'], function(Style, util, Vector){
	var markStyle = Style.mark;
 	function layout_horizontal(nodes, xScale, yScale, legendScale, space){
 		nodes.forEach(function(nodeRoot, i){
 			var data = nodeRoot.data();
 			var lineNode = util.select(nodeRoot, function(node, i){
 				return node.kind() == 'help_line';
 			});
 			var circleNodes = util.selectAll(nodeRoot, function(node, i){
 				return node.kind() == 'mark';
 			});
 			var lineArr = [];
 			circleNodes.forEach(function(circle, i){
 				var d = circle.data();
 				var x_coor = xScale.exec(d.x);
 				var y_coor = yScale.exec(d.y);
 				circle.setAttribute({
 					cx: x_coor,
 					cy: y_coor,
 					r: 3,
 				});
 				lineArr.push({x:x_coor, y:y_coor});
 			});
 			var d = Vector.createBezierLine(lineArr);
 			lineNode.setAttribute({
 				d: d,
 				stroke: legendScale.exec(data.name)
 			});
 			//set the x and y of the g-header
 			nodeRoot.setX(space.x);
 			nodeRoot.setY(space.y);
 		});
 	};
	function layout(nodes, xScale, yScale, legendScale, space){
		var type = xScale.type();
		if(type == 'ordinal'){
			layout_horizontal(nodes, xScale, yScale, legendScale, space);
		}else{
			//layout_vertival(nodes, xScale, yScale, legendScale, space);
		}
		
	}
	return layout;
});