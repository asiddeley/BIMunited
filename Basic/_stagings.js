
//stage items
//babylon lights and camera

var basicStage = {
	'cameras':{},
	'lights':{},
	'matLib':{},
	'name':'unnamed',
	'setScene':function(scene, canvas){ },
	'type':'basicStage'
};

/*
var basicLight={
	'name':'unnamed',
	'type':'basicStage',
	'setScene':function(scene, canvas){}
};
*/

define(
// dependencies
['babylon','jquery'],
// constructor
function(BABYLON, $){

// stage factories...
return {

	'basic':function(){
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