define([
	'gchart/util',
	'gchart/dataProcess',
	'gchart/scales/linear',
	'gchart/scales/ordinal',
	'gchart/scales/ordinal_color',
	'gchart/sprites/container',
	'gchart/sprites/text',
	'gchart/scenebuilder/builder',
	'gchart/layout/layout',
	'gchart/style/style',
	'gchart/render',
	'gchart/event/event'],  function(util, dataProcess, Linear, Ordinal, Ordinal_Color, Container, Text, Builder, Layout, Style, Render, Event){
	var padding = 10;
	function dealTitle(titleInfo, area){
		var test = {
			'font-size' : '20px',
			'font-weight' : 400,
			'font-family' : 'Arial, Helvetica, sans-serif',
			'font-style' : 'normal',
			'fill': '#404040',
			 x : 100,
			 y:100
		};
		var titleRoot = Builder.title(titleInfo);
		var textNode = util.select(titleRoot, function(node, i){
			return node.kind() == 'title';
		});
		textNode.setAttribute({'font-size': '20px'});
		var bbox = textNode.getBBox();
		var height = bbox.height;
		titleRoot.setX(area.x);
		titleRoot.setY(area.y);
		console.log(bbox);
		textNode.setAttribute({
			x : (area.width - bbox.width) / 2,
			y : padding + bbox.height
		});
		titleRoot.setX(area.x);
		titleRoot.setY(area.y);
		titleInfo.space = {x: area.x, y: area.y, width: area.width, height: 2 * padding + bbox.height};
		var remain_space = {x: area.x, y: area.y + titleInfo.space.height, width:area.width, height: area.height - titleInfo.space.height};
		return {
			root: titleRoot,
			remain: remain_space
		}
	}
	function dealLegend(legendInfo, area){
		var legendStyle = Style.legend;
		var innerPadding = legendStyle.innerPadding, 
			outerPadding = legendStyle.outerPadding, 
			verticalPadding = legendStyle.verticalPadding, 
			frameWidth = legendStyle.frameWidth, 
			frameHeight = legendStyle.frameHeight;

		if(legendInfo == null || legendInfo.hidden == true){
			return {root: null,remain: area};
		}
		var d = legendInfo.data;
		var legend_scale = (new Ordinal_Color(d));
		if(legendInfo.colors && legendInfo.colors.length > 0) legend_scale.range(legendInfo.colors);
		legend_scale.run();
		legendInfo.color_scale = legend_scale;
		var legendRoot = Builder.legend(legendInfo);
		legendInfo.root = legendRoot;

		var textNodes = util.selectAll(legendRoot, function(node, i){
			return node.kind() == 'text';
		});
		var frameNodes = util.selectAll(legendRoot, function(node, i){
			return node.kind() == 'frame';
		});
		var textWidth = 0, textHeight = 0, bbox;
		textNodes.each(function(node,i){
			node.setAttribute('text', node.data());
			bbox = node.getBBox();
			textWidth += bbox.width;
			textHeight = Math.max(textHeight, bbox.height);
		});

		var wholeWidth = frameNodes.length * (frameWidth + innerPadding + outerPadding) - outerPadding + textWidth;
		//one line
		var lines = Math.ceil(wholeWidth/ area.width);
		var wholeHeight = (lines - 1) * verticalPadding + lines * Math.max(frameHeight, textHeight) + 2 * padding;
		legendStyle.textHeight = textHeight;
		legendStyle.lines = lines;
		legendStyle.wholeHeight = wholeHeight;
		legendStyle.wholeWidth = wholeWidth;

		legendInfo.space = {x: area.x, y: area.y + area.height - wholeHeight, width: area.width, height: wholeHeight};
		var remain = { x: area.x, y: area.y, width: area.width, height: area.height - wholeHeight };
		Layout.legend(legendInfo);

		return {
			root: legendRoot,
			remain: remain
		}
	}
	// now only deal with the first pie in the 1th version
	function dealPie(option, area){
		var series = option.series;
		if(series == null || (series.length && series.length == 0)){
			return {
				root : new Container(),
				remain : area
			}
		}
		var radius = option.radius;
		var pieInfo = series[0];
		var data = pieInfo.data, angleField = pieInfo.angleField, categoryField = pieInfo.categoryField, angle = pieInfo.angle;
		var tmp = data.map(function(d, i){ return d[angleField]; });
		var sum = util.sum(tmp);
		var span = Math.abs(angle[0] - angle[1]), start = Math.min(angle[0], angle[1]);
		
		var angleData = tmp.map(function(d, i){
			var ratio = d / sum;
			data[i].ratio = ratio;
			var obj = {
				origin_data : data[i], 
				value: d,
				category: data[i][categoryField],
				ratio: ratio, 
				start: start, 
				end: start + span * (d / sum),
				innerRadius: (radius == null || radius[0] == null) ? 0 : radius[0],
				outerRadius: (radius == null || radius[1] == null) ? Math.floor(0.9*Math.min(area.width, area.height) / 2) : radius[1],

			};
			start = obj.end;
			return obj;
		});
		pieInfo.angleData = angleData;
		pieInfo.space = area;
		// add scale to pieInfo
		if(option.legend && option.legend.color_scale){
			pieInfo.scale = option.legend.color_scale;
		}else{
			var categoryData = data.map(function(d, i){ return d[categoryField];});
			var scale = (new Ordinal_Color(categoryData)).run();
			pieInfo.scale = scale;
		}
		//build scene tree
		var seriesRoot = Builder.pie(pieInfo);
		pieInfo.root = seriesRoot;
		Layout.pie(pieInfo);
		return {
			root: seriesRoot
		}
	}
	function axisProcess(option, area){
		var xAxis = option.xAxis, yAxis = option.yAxis;
		var axisStyle = Style.axis;
		var text_test = new Text();
		var temporary_width = 0, temporary_height = 0;
		//---------------------------------------------------
			var dd= yAxis.data;
			var maxW = 0, bbox;
			dd.each(function(d, i){
				text_test.setAttribute('text', d);
				bbox = text_test.getBBox();
				maxW = Math.max(bbox.width, maxW);
			});
			temporary_width = axisStyle.padding + maxW + axisStyle.tick_text + axisStyle.tick + 2;
		//----------------------------------------------------
		text_test.setAttribute('text', 'test');
		temporary_height = axisStyle.padding + text_test.getBBox().height + axisStyle.tick_text + axisStyle.tick + 2;
		yAxis.space = {
			x: area.x, y: area.y, width: temporary_width, height: area.height - temporary_height
		};
		xAxis.space = {
			x: area.x + temporary_width,
			y: area.y + area.height - temporary_height,
			width: area.width - temporary_width,
			height: temporary_height
		}
		return {
			x: area.x + temporary_width,
			y: area.y,
			width: area.width - temporary_width,
			height: area.height - temporary_height
		}
	}
	function createScale(axis, witch){
		var data = axis.data;
		var space = axis.space;
		var count = axis.count;
		var type = axis.type;
		var range = witch == 'x' ? [0, space.width - padding] : [space.height, padding];
		var scale;
		if(type == 'ordinal'){
			scale = (new Ordinal()).domain(data).range(range).run();
			scale.count(count);
		}else{
			scale = (new Linear()).domain(data).range(range).run();
			scale.count(count);
		}
		axis.scale = scale;
		return scale;
	}
	function dealCartesian(option, area){
		var series = option.series;
		
		if(series == null || series.lenght <= 0) return {
			root: new Container(),
			remain: area
		};
		var seriesSpace = axisProcess(option, area);
		option.seriesSpace = seriesSpace;
		createScale(option.xAxis, 'x');
		createScale(option.yAxis, 'y');
		//create scale
		var graphRootObj = Builder.cartesian(option, seriesSpace);
		option.xAxis.root = graphRootObj.xAxis;
		option.yAxis.root = graphRootObj.yAxis;
		option.series.root = graphRootObj.series;
		Layout.cartesian(option);
		return {
			root : graphRootObj.root
		}
	}
	function dealGraph(option, area, type){
		if(type == 'pie') return dealPie(option, area);
		if(type == 'cartesian') return dealCartesian(option, area);
	}
 	function createChart(option){
 		var data = dataProcess(option);
 		var root = data.container;
 		var type = data.type;

 		var tmpRoot = new Container();
 		var area = data.area;
 		//deal title
 		var titleObj = dealTitle(data.title, area);
 		tmpRoot.addChild(titleObj.root);
 		//deal legend
 		var legendObj = dealLegend(data.legend, titleObj.remain);
 		tmpRoot.addChild(legendObj.root);

 		var ee = util.makeSVG('rect', 'rect', {
 			x:legendObj.remain.x,
 			y:legendObj.remain.y,
 			width:legendObj.remain.width,
 			height:legendObj.remain.height,
 			stroke:'#e6e6e6',
 			fill: 'white',
 			'stroke-width' : 1
 		});
 		//undo! deal graph
 		var graphObj = dealGraph(data, legendObj.remain, type);
 		tmpRoot.addChild(graphObj.root);
 		// root.appendChild(ee);
 		
 		Render.render(root, tmpRoot);
 		Render.animation(root, tmpRoot, data.animation);
 		Event(tmpRoot, option);
 	}
 	return {
 		create: createChart
 	}
});



