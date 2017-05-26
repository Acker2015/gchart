/*
 * define modules
 */
var test = (function(){
	var modules = {};
	var define = function(name, deps, oper){
		for (var i = 0; i < deps.length; i++) {
			deps[i] = modules[deps[i]];
		}
		modules[name] = oper.apply(oper, deps);
	}
	var get = function(dep){
		return modules[dep];
	}
	return {
		define: define,
		get: get
	}
})();



test.define('foo', [], function(){

});

test.define('bar', ['foo'], function(foo){

})