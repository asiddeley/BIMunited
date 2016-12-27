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

var cylinder={
	'setScene':function(scene, canvas){
		BABYLON.Mesh.CreateCylinder(
		"cylinder",
		3,
		3,
		3,
		6,
		1,
		scene,
		false,
		BABYLON.Mesh.DEFAULTSIDE);
	);},
	'type':'cylinder',

};

define(
// load dependencies...
['babylon','jquery','basic/_part'], 

// then return makers...
function(BABYLON, $, part){

// makers...
return {	
	'basic':function(){return $.extend(part, cylinder); },	
	'unit':function(){return $.extend(part, cylinder, {'width':1}); }

}

});


