define([
	'gchart/sprites/text',
	'gchart/sprites/container', 
	'gchart/sprites/line'
	], function(Text, Container, Line){

	function create(info, which){
		var subRoot = new Container();
		subRoot.kind(which);
		subRoot.setAttribute({'data': info});
		var scale = info.scale;
		var ticks = scale.ticks();
		var node = subRoot.append(Line, info);
		node.kind('line');
		var ticksChildren = subRoot.appendAll(Line, ticks);
		ticksChildren.each(function(node, i){ node.kind('tick');});
		var textChildren = subRoot.appendAll(Text, ticks);
		textChildren.each(function(node, i){ node.kind('text');});

		return subRoot;
	}

	return create;

});