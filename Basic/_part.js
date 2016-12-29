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
['babylon'],

// then do...
function(babylon){
	
// return basic part
return {
	// properties
	'name':'unnamed',
	'mutable':false,
	'partobj':null,
	'position':new babylon.Vector3(0,0,0),
	'segment':16,
	'type':'part',
	'width':1,
	
	// methods
	'setScene':function(scene, canvas){
		this.partobj=new Babylon.CreateSphere(this.name, this.segment, this.width, scene);
		this.partobj.position=this.position;	
		//this.partobj.rotation.x = Math.PI/4;	//rotate around x axis
		//this.partobj.scaling = new BABYLON.Vector3(2,1,1);
		//this.partobj.parent = otherPartObj; //all of parent's Tx will be applies to this
	}

}

});


