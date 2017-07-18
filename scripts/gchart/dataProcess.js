/*
 * data pre-processing
 */
 define([
 		 'gchart/scales/linear',
 		 'gchart/scales/ordinal',
 		 'gchart/scales/ordinal_color',
 		 'gchart/util'
 	], function(Linear, Ordinal, Ordinal_Color, util){
 	var idx = 0;
 	function generateId(){
 		return 'fk' + idx++;
 	}
 	function groupBy(source, attr){
 		var flag = source.map(function(){return 1;});
 		var goal = [];
 		source.forEach(function(d, i){
 			if(flag[i] != 1) return;
 			var value = d[attr];
 			var result = [d];
 			flag[i] = 0;
 			source.forEach(function(dd, ii){
 				if(flag[ii] != 1) return;
 				if(dd[attr] == value){
 					result.push(dd);
 					flag[ii] = 0;
 				}
 			});
 			goal.push(result);
 		});
 		return goal;
 	}
 	//only support single pie
 	function pieInfoProcess(opt, options){
 		var seriesInfo = options.series;
 		var data = opt.data;
 		if(seriesInfo == null || seriesInfo.length <= 0) util.err('series ', 'in options should be provided.');
 		var series = [];
		seriesInfo.forEach(function(d, index){
			var help = {};
			//var angleData = data.map(function(dd){ return dd[d.angle]; }) || []; 
			//var categoryData = data.map(function(dd){ return dd[d.category]; }) || [];
			help.data = data;
			help.name = d.name;
			help.angleField = d.angleField;
			help.categoryField = d.categoryField;
			help.angle = (d.angle == null ? [0, 360] : d.angle); 
			//help.angleData = angleData;
			//help.categoryData = categoryData;
			help.label = (d.label == null ? {hidden: true} : d.label);
			if(help.label.hidden == null) help.label.hidden = true;
			if(help.label.hidden && help.label.text == null) help.label.text = function(d){ return d;}
			series.push(help);
		}); 		
		opt.series = series;
 	}
 	function divideSeries(series, which_linear){
 		var newSeries = {}, type;
 		series.forEach(function(se, i){
 			type = se.type;
 			if(type == null) util.err('type of series', ' should not be null or undefined.');
 			if(newSeries[type] == null)
 				newSeries[type] = [se];
 			else
 				newSeries[type].push(se);
 		});
 		var min, max, tmp;
 		var dataDimLinear = which_linear == 'x' ? 'xData' : 'yData';
 		for( k in newSeries){
 			var v = newSeries[k];
 			v.each(function(d, i){
 				tmp = Math.max.apply(null, d[dataDimLinear]);
	 			max = (max == undefined || max < tmp) ? tmp : max;
	 			tmp = Math.min.apply(null, d[dataDimLinear]);
	 			min = (min == undefined || min > tmp) ? tmp : min;
 			});
 		}
 		if(newSeries['bar'] != null){
 			var re = groupBy(newSeries.bar, 'stack');
 			re.each(function(d, i){
 				var help = d[0][dataDimLinear].map(function(d, i){ return d;});
 				for(var j = 1; j < d.length; ++j){
 					d[j][dataDimLinear].each(function(d, i){
 						help[i] += d;
 					});
 				}
 				tmp = Math.max.apply(null, help);
 				max = (max == undefined || max < tmp) ? tmp : max;
 				tmp = Math.min.apply(null, help);
 				min = (min == undefined || min > tmp) ? tmp : min;
 			})
 			newSeries['bar'] = re;
 		}
 		max = max == undefined ? 0 : max;
 		min = (min == undefined || min > 0) ? 0 : min;
 		return {
 			series: newSeries,
 			linearSpan : [min, max]
 		}
 	}
 	/*
 	 which => 'x' or 'y'
 	*/
 	function axisInfoProcess(data, axis, seriesObj, xField, yField){
 		var type = axis.type;
 		var field = (which == 'x') ? xField : yField;
 		if(type == 'ordinal'){
 			axis.data = data.map(function(d){return d[field]});
 		}else if(type == 'linear'){
 			axis.data = seriesObj.linearSpan;
 		}else{
 			util.err(type, ': this type of axis is not supported.');
 		}
 	}
 	function cartesianInfoProcess(opt, options){
 		var xAxisInfo = options.xAxis;
 		var yAxisInfo = options.yAxis;
 		var seriesInfo = options.series;
 		var data = options.data;
 		opt.data = data;
 		if(data == null || seriesInfo == null) {
 			util.err('data in option', ' is null.');
 			return;
 		}
 		var series = [];
 		seriesInfo.forEach(function(d, i){
 			var help = {};
 			help.type = d.type || 'bar';
 			help.id = generateId();
 			help.name = d.name;
 			help.xField = d.xField;
 			help.yField = d.yField;
 			help.xData = data.map(function(dd){return dd[d.xField]});
 			help.yData = data.map(function(dd){return dd[d.yField]});
 			help.data = data;
 			help.stack = d.stack == null ? generateId() : d.stack;
 			help.hidden = d.hidden == null ? false : true;
 			series.push(help);
 		});
 		var which_linear = xAxisInfo.type == 'linear' ? 'x' : 'y';
 		var ordinal_field = which_linear == 'x' ? series[0].yField : series[0].xField;
 		var re = divideSeries(series, which_linear);
 		opt.series = series;
 		//opt.seriesArr = series;
 		//deal ordinal axis
 		if(which_linear == 'x'){
 			xAxisInfo.data = re.linearSpan;
 			yAxisInfo.data = data.map(function(d, i){ return d[ordinal_field]; });
 		}else{
 			xAxisInfo.data = data.map(function(d, i){ return d[ordinal_field]; });
 			yAxisInfo.data = re.linearSpan;
 		}
 		opt.xAxis = xAxisInfo;
 		opt.yAxis = yAxisInfo;
 	}
 	function commonInfoProcess(opt, options){
 		//process title
 		var titleInfo = options.title;
 		if(titleInfo != null){
 			var title = {};
 			title.text = titleInfo.text || "";
 			title.hidden = false;
 			opt.title = title;
 		}
 		//process legend
 		var legendInfo = options.legend;
 		if(legendInfo != null){
 			var legend = {};
 			legend.hidden = legendInfo.hidden || false;
 			opt.legend = legend;
 		}
 		//process tooltip
 		var tooltipInfo = options.tooltip;
 		if(tooltipInfo != null){
 			var tooltip = {};
 			tooltip.text = tooltipInfo.text;
 			tooltip.hidden = tooltipInfo.hidden || false;
 			opt.tooltip = tooltip;
 		}
 		var animation_type = options.animation || 1;
 		opt.animation = animation_type;
 	}
 	function legendInfoProcess(opt){
 		var legendInfo = opt.legend;
 		var type = opt.type;
 		var series = opt.series;
 		//var seriesArr = opt.seriesArr;
 		if(type == 'pie'){
 			// only get the category of first pie
 			var categoryField = series[0].categoryField;
 			legendInfo.data = series[0].data.map(function(d){return d[categoryField];});
 		}else{
 			legendInfo.data = series.map(function(d){ return d.name;});
 		}
 		legendInfo.colors = opt.colors;
 	}
 	function copyData(da){
 		var newData = [];
 		for (var i = 0; i < da.length; i++) {
 			var d = da[i];
 			var sub_obj = {};
 			for(var k in d){
 				sub_obj[k] = d[k];
 			}
 			newData.push(sub_obj);
 		}
 		return newData;
 	}
 	function dataProcess(options){
 		var opt = {};
 		commonInfoProcess(opt, options);
 		var type = options.type;
 		opt.type = type;
 		opt.area = options.area;
 		opt.container = options.container;
 		opt.colors = options.colors || [];
 		/**/
 		util.setSvgRoot(options.container);
 		/**/
 		var data = copyData(options.data);
 		var seriesInfo = options.series;
 		if(data == null || seriesInfo == null) {
 			util.err('data in option', ' is null.');
 			return;
 		}
 		if(type == null) type = 'cartesian';
 		// if(type == null || (type != 'pie' && type != 'cartesian')){
 		// 	util.err('type of chart', ' should be checked.');
 		// 	return;
 		// }
 		opt.data = data;
 		if(type == 'pie'){
 			opt.radius = options.radius || [0, 50];
 			pieInfoProcess(opt, options);
 		}else{
 			cartesianInfoProcess(opt, options);
 		}
 		//deal with legend info
 		legendInfoProcess(opt);
 		return opt;
 	}


 	return dataProcess;
 });