/*
legend scene
*/
define(['gchart/sprites/text',
		'gchart/sprites/container', 
		'gchart/sprites/annular'], function(Text, Container, Annular){
	function create(info){
		var subRoot = new Container();
		subRoot.kind('series');
		var d = info.data;
		var angleData = info.angleData;
		var label = info.label;
		var annularChildren = subRoot.appendAll(Annular, angleData);
		annularChildren.each(function(node, i){ node.kind('sector'); });
		if(label.hidden != null && !label.hidden){
			var textChildren = subRoot.appendAll(Text, angleData);
			textChildren.each(function(node, i){ 
				node.kind('text');
				node.setDynamicAttribute('label', label); 
			});
		}
		return subRoot;
	}
	return create;
});