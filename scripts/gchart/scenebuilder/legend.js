/*
legend scene
*/
define(['gchart/sprites/text',
		'gchart/sprites/container', 
		'gchart/sprites/rect'], function(Text, Container, Rect){
	function create(legendInfo){
		var subRoot = new Container();
		subRoot.kind('legend');
		var d = legendInfo.data;
		var rectChildren = subRoot.appendAll(Rect, d);
		rectChildren.each(function(node,i){ node.kind('frame')});
		var textChildren = subRoot.appendAll(Text, d);
		textChildren.each(function(node, i){return node.kind('text')});
		return subRoot;
	}
	return create;
});