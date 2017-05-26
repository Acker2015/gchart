define([], function(){
	var prop = {
		common : {
			'fill' : 1,
			'stroke' : 1,
			'stroke-width' : 1,
			'fill-opacity' : 1,
			'stroke-opacity' : 1,
			'opacity' : 1
		},
		annular : {
			'd' : 1
		},
		circle : {
			'cx': 1,
			'cy': 1,
			'r' : 1
		},
		text : {
			'x' : 1,
			'y' : 1,
			'text' : 1,
			'font-size' : 1,
			'font-weight' : 1,
			'font-family' : 1,
			'font-style' : 1,
			'text-anchor' : 1,
			'font' : 1
		},
		rect : {
			'x': 1,
			'y': 1,
			'width' : 1,
			'height' : 1,
			//rounded corners
			'rx' : 1, 
			'ry' : 1
		},
		container: {
			'transform' : 1
		},
		line: {
			'x1': 1,
			'y1': 1,
			'x2': 1,
			'y2': 1
		},
		path:{
			'd': 1
		}
	}
	return prop;
})