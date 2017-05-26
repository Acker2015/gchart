define(['gchart/util', 'gchart/sprites/sprite'], function(util, Sprite){
	var Text = function(data){
		Sprite.call(this, data);
		this.type = 'text';
		this.tag = 'text';
		this.setAttribute({
			'font-family': 'Arial, Helvetica, sans-serif',
			'font-style': 'normal',
			'font-size': '14px',
			'fill': '#404040',
			'text' : 'Hello World'
		});
	}

	Text.prototype = new Sprite();
	Text.prototype.createNodeCase = function(){
		var text = this.properties.text;
		this.nodeCase = util.makeSVG(this.type, this.tag, this.properties);
		this.nodeCase.innerHTML = text;
		return this.nodeCase;
	};
	Text.prototype.getBBox = function(text, font){
		if(text == null) text = this.attribute('text');
		if(font == null){
			font = {
				weight: this.attribute('font-weight'),
				style : this.attribute('font-style'),
				size: this.attribute('font-size'),
				family: this.attribute('font-family')
			}
		}
		return util.measureText(text, font);
	}
	return Text;
});