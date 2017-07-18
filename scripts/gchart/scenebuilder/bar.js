define([
	'gchart/sprites/text',
	'gchart/sprites/container', 
	'gchart/sprites/rect'
	], function(Text, Container, Rect){

	function create(info){
		console.log(info);
		var id = info.id;
		var newData = info.newData;
		var subRoot = new Container(info);
		subRoot.setAttribute({'data': info});
		subRoot.kind('bar');
		subRoot.id(id);

		var barChildren = subRoot.appendAll(Rect, newData);
		barChildren.each(function(node, i){ node.kind('mark'); });
		if(!info.hidden){
			var textChildren = subRoot.appendAll(Text, newData);
			textChildren.each(function(node, i){ node.kind('text'); });
		}
		return subRoot;
	}

	return create;

});