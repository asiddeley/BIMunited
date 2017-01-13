
//stage items
//babylon lights and camera



/*
var basicLight={
	'name':'unnamed',
	'type':'basicStage',
	'setScene':function(scene, canvas){}
};
*/

define(
// load dependencies...
['babylon','jquery'],

// then do this...
function(BABYLON, $){

var basicStage = {
	'cameras':{},
	'lights':{},
	'matLib':{},
	'name':'unnamed',
	'setScene':function(scene, canvas){ },
	'type':'basicStage'
};


// stage factories...
return {

	'demo':function(num){
		var that=this;
		switch(num){
			case 1:	return that.simple(); break;
			default:return that.simple();					
		}

	},

	'simple':function(){
		// basic stage with one hemi light and a free camera
		var r=$.extend({}, basicStage);
		// override setScene method
		r.setScene=function(scene, canvas){
			// Cameras
			this.cameras.free=new BABYLON.FreeCamera('free', new BABYLON.Vector3(0, 5,-10), scene);
            this.cameras.free.setTarget(BABYLON.Vector3.Zero());
            this.cameras.free.attachControl(canvas, false);	
			
			// Lights
			this.lights.hemi=new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0,1,0), scene);
			
			// Materials
			this.matLib.picked=new BABYLON.StandardMaterial('picked', scene);
			this.matLib.picked.diffuseColor = new BABYLON.Color3(255, 215, 0);
			this.matLib.unpicked=new BABYLON.StandardMaterial('unpicked', scene);
			this.matLib.unpicked.diffuseColor = new BABYLON.Color3(100, 100, 100);

			//this.matLib.picked.alpha=0.5;
			
		};		
		return r;
	}
	
	
}

});