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

var disc={
	'setScene':function(scene, canvas){
		BABYLON.Mesh.CreateDisc(
		this.name, 
		this.width*0.5, //radius
		this.tessellation,
		scene,
		this.mutable, 
		BABYLON.Mesh.DEFAULTSIDE);
		//Parameters are: name, radius, tessellation, scene, updatable and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
	},
	'tessellation':30,
	'type':'disc',
	'width':5
};

define(
// load dependencies...
['babylon','jquery','basic/_part'], 

// then do this...
function(BABYLON, $, part){

// return makers...
return {	
	'basic':function(userStuff){return $.extend({}, part, disc, userStuff); },	
	'unit':function(){return $.extend({}, part, disc, {'width':1}); }

}

});


