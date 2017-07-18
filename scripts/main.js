requirejs.config({
	baseUrl: 'scripts',
	paths: {
		jquery: 'lib/jquery'
	}
});
require(['jquery',  
		 'gchart/sprites/annular', 
		 'gchart/sprites/container',
		 'gchart/sprites/rect',
		 'gchart/sprites/text',
		 'gchart/render',
		 'gchart/chart',
		 'gchart/vector'], 
		 function($, Annular, Container, Rect, Text, Render, Chart, Vector){
	var p = document.getElementById('pie');
	var width = Number(p.getAttribute('width'));
	var height = Number(p.getAttribute('height'));
	 var option = {
	 	container: p,
	 	area: {x : 0, y: 0, width: width, height: height},
	 	type: 'cartesian',
	 	data : [
	 		{value1: 335, name: 'one', value2: 130, value3: 270},
			{value1: 679, name: 'two', value2: 372, value3: 290},
			{value1: 105, name: 'three', value2: 692, value3: 300},
			{value1: 779, name: 'four', value2: 140, value3: 50},
			{value1: 300, name: 'five', value2: 90, value3: 100}
	 	],
	 	legend:{
	 		hidden: false
	 	},
	 	title:{
	 		text: '测试专用',
	 		hidden: false
	 	},
	 	tooltip: {
	 		text: function(d){
			 			return ['name: '+d.name, 'value1: '+d.value1, 'value2: '+ d.value2, 'value3: '+ d.value3];
			 		},
	 		trigger: 'item'
	 	},
	 	xAxis: {
	 		type: 'ordinal',
	 	},
	 	yAxis: {
	 		type: 'linear',
	 		count: 5,
	 		boundaryGap:[0.1, 0.1],
	 	},
	 	series: [
	 		{
	 			name: 'ios',
	 			type: 'bar',
	 			xField: 'name',
	 			yField: 'value1',
	 		},
	 		{
	 			name: 'android',
	 			type: 'bar',
	 			xField: 'name',
	 			yField: 'value2',
	 		},
	 	],
	 	//colors: ["#E2EAE9", "#D4CCC5"]
	 };
	Chart.create(option);
	return;
	var makeSVG = function(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs){
            el.setAttribute(k, attrs[k]);
        }
        return el;
    }
	var path = [{x: 0, y: 50}, {x: 100, y: 100}, {x: 200, y: 50}, {x: 300, y:150}, 
				{x:400, y:100}, {x:500, y: 200}, {x: 600, y: 40}];
	var re = Vector.createBezierLine(path);
	for (var i = 0; i < path.length; i++) {
		p.appendChild(makeSVG('circle', {
			cx: path[i].x,
			cy: path[i].y,
			fill: 'none',
			stroke:'#777',
			r: 3
		}));
	}
	$('path').attr('d', re);
	debugger;
})