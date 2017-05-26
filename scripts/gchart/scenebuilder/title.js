define(['gchart/sprites/text','gchart/sprites/container'], function(Text, Container){
	function create(titleInfo){
		var subRoot = new Container();
		var textNode = new Text(titleInfo);
		textNode.kind('title');
		textNode.setAttribute({
			text: titleInfo.text
		});
		subRoot.addChild(textNode);
		return subRoot;
	}
	return create;
});