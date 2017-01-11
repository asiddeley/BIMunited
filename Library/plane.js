//////////////////////
//
// BIMsoup/babyBIM module
// Why is this project called BIMsoup?
// Because Excalibur was taken!
//
// Basic sphere object
//
// Andrew Siddeley 
// 27-Dec-2016

var plane={
	'setScene':function(scene){ BABYLON.Mesh.CreatePlane(
		this.name,
		this.segment,
		scene, 
		this.mutable,
		BABYLON.Mesh.DEFAULTSIDE
	);},
	'type':'plane',
};

define(
// load dependencies...
['babylon','jquery','basic/_part'], 
// then do this...
function(BABYLON, $, part){

// plane makers
return {
	'basic':function(){return $.extend({}, part, plane); },	
	'unit':function(){return $.extend({}, part, plane, {'width':1}); }
	
}

});


