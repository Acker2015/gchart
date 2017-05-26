define([
		'gchart/util',
		'gchart/layout/legend',
		'gchart/layout/pie',
		'gchart/layout/axis',
		'gchart/layout/bar',
		'gchart/layout/line'
	], function(util, Legend, Pie, Axis, Bar, Line){
	var seriesType = {};
	var map2map = {
		'bar': Bar,
		'line': Line
	}
	function legendLayout(info){
		Legend(info);
		
	}
	function pieLayout(info){
		Pie(info);
	}
	function cartesianLayout(info){
		var xAxis = info.xAxis;
		var yAxis = info.yAxis;
		var series = info.series;
		var xScale = xAxis.scale, yScale = yAxis.scale, legendScale = info.legend.color_scale;
		var root = series.root;
		var seriesSpace = info.seriesSpace;
		Axis(xAxis, 'x');
		Axis(yAxis, 'y');
		series.each(function(se, i){
			seriesType[se.type] = 1;
		});
		for(k in seriesType){
			var seriesNodes = util.selectAll(root, function(node,i){
				return node.kind() == k;
			});
			var layoutFunc = map2map[k];
			if(k == null) continue;
			layoutFunc(seriesNodes, xScale, yScale, legendScale, seriesSpace);
		}


	}
	return {
		legend : legendLayout,
		pie: pieLayout,
		cartesian: cartesianLayout
	}
});