define(['gchart/style/style',
	'gchart/util'], function(Style, util){
	var markStyle = Style.mark;
	function groupBy(source, attr){
 		var flag = source.map(function(){return 1;});
 		var goal = [];
 		source.forEach(function(node, i){
 			if(flag[i] != 1) return;
 			var d = node.data();
 			var value = d[attr];
 			var result = [node];
 			flag[i] = 0;
 			source.forEach(function(node_node, ii){
 				if(flag[ii] != 1) return;
 				var dd = node_node.data();
 				if(dd[attr] == value){
 					result.push(node_node);
 					flag[ii] = 0;
 				}
 			});
 			goal.push(result);
 		});
 		return goal;
 	}
 	function layout_horizontal(groupNodes, xScale, yScale, legendScale, space){
 		var step = xScale.step();
 		var len1 = groupNodes.length;
 		var yDomain = yScale.domain();
 		var yRange = yScale.range();
 		var bar_width = (step - 2 * markStyle.outerPadding - (len1 - 1) * markStyle.innerPadding) / len1;
 		var bar_width = bar_width > 40 ? 40 : bar_width;

 		var diff_start = len1 * (bar_width / 2) + (len1 - 1) * (markStyle.innerPadding / 2);

 		groupNodes.each(function(nodes, z){
 			//nodes為堆叠的組合
 			var help = [];
 			//if(z >= 2) return;
 			var diff = diff_start - z * (bar_width + markStyle.innerPadding);
 			// debugger;
 			nodes.each(function(node, i){
 				var d = node.data();
 				var newData = d.newData;
 				var name = d.name;
 				var markChildren = util.selectAll(node, function(n, i){
 					return n.kind() == 'mark';
 				});
 				var textChildren = util.selectAll(node, function(n, i){
 					return n.kind() == 'text';
 				});
 				markChildren.each(function(mark, j){
 					var d = mark.data();
 					var x = d.x, y = d.y;
 					var x_coor = xScale.exec(x), y_coor = yScale.exec(y);
 					if(help[j] == undefined) help[j] = 0;
 					mark.setAttribute({
 						x: x_coor - diff,
 						y: y_coor - help[j],
 						width: bar_width,
 						height: yRange[0] - y_coor,
 						fill: legendScale.exec(name)
 					});
 					if(textChildren.length <= 0){
 						help[j] += (yRange[0] - y_coor);
 						return;
 					}
 					var textNode = textChildren[j];
 					textNode.setAttribute('text', y);
 					var bbox = textNode.getBBox();
 					textNode.setAttribute({
 						x: x_coor - diff + bar_width / 2 - bbox.width / 2,
 						y: y_coor - help[j] + (yRange[0] - y_coor) / 2 + bbox.height / 2,
 					});

 					help[j] += (yRange[0] - y_coor);

 				});
 				
 				//set the x and y of the g-header
 				node.setX(space.x);
 				node.setY(space.y);
 			});
 		});
 	};
	function layout(nodes, xScale, yScale, legendScale, space){
		var groupNodes = groupBy(nodes, 'stack');
		var type = xScale.type();
		if(type == 'ordinal'){
			layout_horizontal(groupNodes, xScale, yScale, legendScale, space);
		}else{
			layout_vertival(groupNodes, xScale, yScale, legendScale, space);
		}
		
	}
	return layout;
});