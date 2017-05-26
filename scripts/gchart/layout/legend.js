define([
	'gchart/style/style',
	'gchart/util'], function(Style, util){
	function judge(area, textW, w) {
		var legendStyle = Style.legend;
		if(w + textW + legendStyle.frameWidth + legendStyle.innerPadding > area.width){
			return true;
		}else{
			return false;
		}
	}
	function layout(info){
		var root = info.root;
		var legendStyle = Style.legend;
		var scale = info.color_scale;
		var space = info.space;
		var frameNodes = util.selectAll(root, function(node, i){
			return node.kind() == 'frame';
		});
		var textNodes = util.selectAll(root, function(node, i){
			return node.kind() == 'text';
		});
		var startH = legendStyle.padding;
		var maxH = Math.max(legendStyle.textHeight, legendStyle.frameHeight);
		var w = 0, len = frameNodes.length, legendWidth = 0;
		frameNodes.each(function(node, i){
			var textNode = textNodes[i];
			var bbox = textNode.getBBox();
			//judge the exceed width
			if(judge(space, bbox.width, w)){
				legendWidth = Math.max(legendWidth, w);
				w = 0;
				startH += (maxH + legendStyle.verticalPadding);
			}
			node.setAttribute({
				x: w,
				y: startH + maxH / 2 - legendStyle.frameHeight / 2,
				height: legendStyle.frameHeight,
				width : legendStyle.frameWidth,
				fill : scale.exec(node.data())
			});
			w += (legendStyle.frameWidth + legendStyle.innerPadding);
			textNodes[i].setAttribute({
				x: w,
				y: startH + maxH / 2 + bbox.height / 2 - 2, //the last 2px may be the line-height
			});
			w += bbox.width;
			legendWidth = Math.max(legendWidth, w);
			if(i != len - 1){
				w += legendStyle.outerPadding;
			}

		});
		root.setX(space.width / 2 - legendWidth / 2);
		root.setY(space.y);
	}
	return layout;
});