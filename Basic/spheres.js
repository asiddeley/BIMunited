//////////////////////
//
// babyBIM module
//
// basic sphere object
//
// Andrew Siddeley 
// 27-Dec-2016

/*
var sphere={
	'setScene':function(scene, canvas){
		baby=BABYLON.Mesh.CreateSphere(	
			this.name, 
			this.segment,
			this.width,
			scene,
			this.mutable,
			BABYLON.Mesh.DEFAULTSIDE
			);
		baby.position=this.position;
		baby.soupData=this;
		this.babyData=baby;
		},
	'type':'sphere'
};
*/
var sphere={
	'create':function(scene, canvas){
		return BABYLON.Mesh.CreateSphere(	
			this.name, 
			this.segment,
			this.width,
			scene,
			this.mutable,
			BABYLON.Mesh.DEFAULTSIDE
			);
		},
	'type':'sphere'
};

define(['babylon','jquery','basic/_part'], function(BABYLON, $, part){

//var r=$.extend({}, partMethods, object below...


return {
	//sphere factories
	
	'simple':function(userStuff){
		//Note - To create a new object first argument of jquery.extend must be
		//an empty object {}, otherwise the first object is modified, not copied.
		return $.extend({}, part, sphere, userStuff);
	},	
	'baseball':function(){return $.extend({}, part, sphere, {'width':0.25}); },	
	'beachball':function(){return $.extend({}, part, sphere, {'width':2}); },
	'oddball':function(){return $,extend({}, part, sphere, {'width':Math.random()}); },
	'one':function(){return $.extend({}, part, sphere, {'width':1}); }
	
}

});