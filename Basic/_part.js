//////////////////////
//
// BIMsoup/babyBIM module
// Why is this project called BIMsoup?
// Because Excalibur was taken!
//
// Basic part
//
// Andrew Siddeley 
// 27-Dec-2016

define(
// load dependencies...
['babylon','jquery'],

// then do...
function(babylon,$){
	
// return basic part
return {
	// properties
	'name':'unnamed',
	'mutable':true,
	'babyData':null,
	'parent':null,
	'position':new babylon.Vector3(0,0,0),
	'segment':16,
	'type':'part',
	'width':1,
	
	// methods
	'another':function(scene, canvas){
		var p=this.position;
		var baby=this.create(scene, canvas);
		baby.position=new babylon.Vector3(Math.random()*10, Math.random()*10, Math.random()*10);
		return baby;
	},
	
	//override this method to create 
	'create':function(scene, canvas){
		return new Babylon.CreateSphere(this.name, this.segment, this.width, scene);		
	},
	
	'setScene':function(scene, canvas){

		//do babylon object creation first
		//var baby=new Babylon.CreateSphere(this.name, this.segment, this.width, scene);
		//baby.rotation.x = Math.PI/4;	//rotate around x axis
		//baby.scaling = new BABYLON.Vector3(2,1,1);
		//baby.parent = otherPartObj; //all of parent's Tx will be applies to this
		
		//then link it to soup model
		var baby=this.create(scene, canvas);
		baby.position=this.position;
		baby.soupData=this;
		this.babyData=baby;
	}

}

});


