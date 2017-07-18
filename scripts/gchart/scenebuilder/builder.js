define(['gchart/sprites/container',
		'gchart/scenebuilder/title',
		'gchart/scenebuilder/legend',
		'gchart/scenebuilder/pie',
		'gchart/scenebuilder/axis',
		'gchart/scenebuilder/bar',
		'gchart/scenebuilder/line'], function(Container, title, legend, pie, axis, bar, line){
	var map2map = {
		'bar': bar,
		'line': line
	}
	function createTitle(titleInfo){
		return title(titleInfo);
	}
	function createLegend(legendInfo){
		return legend(legendInfo);
	}
	function createPie(info){
		return pie(info);
	}
	function createCartesian(info, space){
		var xAxis = info.xAxis, yAxis = info.yAxis, series = info.series;
		var subRoot = new Container();
		subRoot.setAttribute('space', space);
		var xAxisRoot = axis(xAxis, 'xAxis');
		var yAxisRoot = axis(yAxis, 'yAxis');
		subRoot.addChild(xAxisRoot);
		subRoot.addChild(yAxisRoot);

		var seriesRoot = new Container(space);
		seriesRoot.kind('series');
		series.each(function(se, i){
			var xData = se.xData, yData = se.yData, data = se.data, xField = se.xField, yField = se.yField;
			var newData = xData.map(function(d, i){
				return {x: d, y: yData[i], origin_data: data[i], xField : xField, yField: yField};
			});
			se.newData = newData;
			var sceneCreate = map2map[se.type];
			if(sceneCreate == null) return;
			var tmpRoot = sceneCreate(se);
			seriesRoot.addChild(tmpRoot);
		});
		subRoot.addChild(seriesRoot);
		return {
			series: seriesRoot,
			xAxis: xAxisRoot,
			yAxis: yAxisRoot,
			root: subRoot
		}
	}
	return {
		title: createTitle,
		legend: createLegend,
		pie: createPie,
		cartesian: createCartesian
	}
});