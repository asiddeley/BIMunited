//////////////////////
//
// babyBIM module
//
// basic sphere object
//
// Andrew Siddeley 
// 27-Dec-2016


var sphere={
	'setScene':function(scene, canvas){
		var baby=BABYLON.Mesh.CreateSphere(this.name, this.segment, this.width, scene);
		baby.position=this.position;
	},
	'type':'sphere'
};

define(['babylon','jquery','basic/_part'], function(BABYLON, $, part){

//alert('babylon vector '+ new BABYLON.Vector3(-20,0,0));
return {
	//sphere factories
	
	'basic':function(userStuff){
		//Note - To create a new object first argument of jquery.extend must be
		//an empty object {}, otherwise the first object is modified, not copied.
		return $.extend({}, part, sphere, userStuff);
	},	
	'baseball':function(){return $.extend({}, part, sphere, {'width':0.25}); },	
	'beachball':function(){return $.extend({}, part, sphere, {'width':2}); },
	'oddball':function(){return $,extend({}, part, sphere, {'width':Math.random()}); },
	'unit':function(){return $.extend({}, part, sphere, {'width':1}); }
	
}

});