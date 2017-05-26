define([
	'gchart/sprites/text',
	'gchart/sprites/container', 
	'gchart/sprites/path',
	'gchart/sprites/circle'
	], function(Text, Container, Path, Circle){
	function create(info){
		var newData = info.newData;
		var subRoot = new Container(info);
		subRoot.kind('line');
		subRoot.id(info.id);

		var lineChild = subRoot.append(Path, info);
		lineChild.kind('help_line');

		var circleChildren = subRoot.appendAll(Circle, info.newData);
		circleChildren.each(function(node, i){ node.kind('mark'); })
		return subRoot;
	}


	return create;
});