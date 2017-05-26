define(['gchart/util'], function(util){

    var deal = function(parentEle, node){
    	var tag = node.tag;
    	var type = node.type;
    	debugger;
    	var element = util.makeSVG(type, tag, node.properties);
    	parentEle.appendChild(element);
    	return element;
    }
    /*
    data:
    	[data0, data1, data2, data3, data4, data5];
     	root: data0
		
		data[i]:
		 {
			tag: tag,
			type : type,
			properties: {},
			parent: index, 			// parent
			children: [],  			// children
			ele: node,				// svg element
			parentEle: parentNode   // parent svg element
			kind: flag,             // kind to find
			id: id   				// id
		 }

	level traverse(BFS)
	*/
	var render = function(svg, root){
		var queue = [], len, ele, parentEle, node;
		if(root == null) return;
		root.parentElement(svg);
		queue.push(root);

		while(queue.length > 0){
			len = queue.length;
			for(var i = 0; i < len; ++i){
				node = queue.shift();
				parentEle = node.parentElement(); // parent element in svg
				var ele = node.createNodeCase(); 
				parentEle.appendChild(ele);
				node.element(ele); //set the element info for node.
				if(util.isArray(node.children())){
					var children = node.children();
					for(var j = 0; j < children.length; ++j){
						var childNode = children[j];
						childNode.parentElement(ele);
						queue.push(childNode);
					}
				}
			}
		}
	}
	return render;
});