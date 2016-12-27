
//stage items
//babylon lights and camera

var basicStage = {
	// API
	'addCamera':function(camera){this.aCamera.push(camera);},	
	'addLight':function(light){this.aLights.push(light);},	
	// storage
	'aCamera':[],
	'aLight':[],
	'name':'unnamed',
	'setScene':function(scene, canvas){
		for (var i=0; i<this.aCamera.length; i++){
			this.aCamera[i].setScene(scene);
			//this.aCamera[i].attachControl(canvas, false);
		}
		for (var i=0; i<this.aLight.length; i++){
			this.aLight[i].setScene(scene, canvas);
		}
	},
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
		var r=$.extend(basicStage, {'type':'basicS'});
		// override setScene method
		r.setScene=function(scene, canvas){
			//alert('canvas '+ canvas);
			var cam=new BABYLON.FreeCamera('freeCam1', new BABYLON.Vector3(0, 5,-10), scene);
            // target the camera to scene origin
            cam.setTarget(BABYLON.Vector3.Zero());
            // attach the camera to the canvas
            cam.attachControl(canvas, false);	
			//alert('cam '+ cam);
			var light=new BABYLON.HemisphericLight('hemi1', new BABYLON.Vector3(0,1,0), scene);
			
		};		
		return r;
	}
	
	
}

});