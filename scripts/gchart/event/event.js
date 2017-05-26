define(['gchart/util'],function(util){
	function addEventForPie(root){
		var nodes = util.selectAll(root, function(node, i){
			return node.kind() == 'sector';
		});
		return nodes;
	}
	function addEventForCart(root){
		var nodes = util.selectAll(root, function(node, i){
			return node.kind() == 'mark';
		});
		return nodes || [];
	}
	function createTooltip(selector, vals){
		selector.empty();
		if(util.isArray(vals)){
			vals.forEach(function(val, i){
				selector.append(`<span class='ispan'>${val}</span>`);
			});
		}else{
			selector.append(`<span class='ispan'>${vals}</span>`);
		}
	}
	function addEvent(root, options){
		var type = options.type;
		var tooltip = options.tooltip;
		var text = tooltip.text ? tooltip.text : function(){return 'test';};
		var $tooltip = $('#tooltip');
		if($tooltip.length <= 0){
			$tooltip = $('<div class="fix" id="tooltip"></div>');
			$tooltip.appendTo($('body'));
		}
		var nodes = [];
		var flag = false;
		if(type == 'pie'){
			nodes = addEventForPie(root);
		}else{
			nodes = addEventForCart(root);
		}
		nodes.forEach(function(node, i){
			var ele = node.nodeCase;
			var d = node.data().origin_data;
			$(ele).mouseover(function(){
				flag = true;
				createTooltip($tooltip, text(d));
				$tooltip.show();
			});
			$(ele).mouseout(function(){
				flag = false;
				$tooltip.hide();
			});
			$(ele).mousemove(function(){
				var x = event.clientX;
				var y = event.clientY;
				$tooltip.css('left', x);
				$tooltip.css('top',y);
			});

			$(ele).hover(function(){
				$(this).attr('opacity', 0.8);
			}, function(){
				$(this).attr('opacity', 1);
			});
		});
	}
	return addEvent;
});