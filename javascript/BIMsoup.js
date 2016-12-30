/////////////////////
//
// Andrew Siddeley
// 17-Dec-2016
//
// Main entry point of app

requirejs.config({
 "baseUrl": "javascript/",
 //default base URL is same as HTML file
 "paths": {
        "arch": "../Arch",
		"basic": "../Basic",
		//"jq": "jquery",
		//"jq":"//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
		"sylvester": "sylvester/sylvesterExp",
		"jq":"jquery",
		"babylon":"../webGL/babylonXP"
    }
});


var settings = {
	'canvas':null,
	'cli':null,
	'dbapi':null,
	'user':"defaultUser"	
};

define(
// load dependencies...
['arch/archModels','jquery', 'babylon', 'basic/_stagings'],

// then do this...
function (models, $, BABYLON, stagings) {
	
// return BIMsoup object
return {
	
	// properties
	'aModel':[],	
	'engine':null,
	'scene':null,
	'settings':settings,
	'stage':{},
	
	// API methods
	'allo':function(user){
		
		$.extend(this.settings, {'user':user});
		//alert("welcome "+settings.user+"\n");				
	},

	'board':function(canvas){
		$.extend(this.settings, {'canvas':canvas});
	},	
			
	'command':function(input, output){
		// command line input and output
		$.extend(this.settings, {'cli':input, 'clo':output});
	},

	'database':function(dbapi){
		$.extend(this.settings, {'dbapi':dbapi});
	},
	
	'engage':function(usettings){
				
		// settings
		$.extend(this.settings, usettings);
		
		// checking
		if (typeof this.settings.window =='undefined') {
			throw 'Missing window setting, please specify in API';	
		}
		
		// set context	
		this.settings.window.BIMsoup=this;
		
		// Set model EXAMPLE 1
		this.aModel.push(models.example(1));
		// Set the stage, cameras, lights, materials
		this.stage=stagings.basic();
		
		// prepare engine
		var c=this.settings.canvas;
		this.engine = new BABYLON.Engine(c, true);
		this.scene = new BABYLON.Scene(this.engine);
		var s=this.scene;
		
		// camera, lights
		this.stage.setScene(this.scene, c);
		
		// visit all parts to set the babylon scene		
		for (var i=0; i<this.aModel.length;i++){this.aModel[i].setScene(this.scene, c);}
		
		// scene events
		s.onPointerDown=this.onPointerDown;
		
		//this.settings.window.addEventListener("click", function () {
			// We try to pick an object
			//var pickResult=s.pick(s.pointerX, s.pointerY);
		//});
		
		// engage
		this.engine.runRenderLoop(function(){s.render();});	
	},
	
	
	// private methods
	

    'onPointerDown' : function (evt, pickResult) {
		// var matLib=this.stage.matLib.picked;
        // if the click hits the ground object, we change the impact position
        if (pickResult.hit) {
			//alert('pickResult = '+pickResult.pickedPoint.x);
            //impact.position.x = pickResult.pickedPoint.x;
            //impact.position.y = pickResult.pickedPoint.y;
			if (pickResult.pickedMesh != null) {
				//highlight
				var picked=BIMsoup.stage.matLib.picked;
				var unpicked=BIMsoup.stage.matLib.unpicked;
				//alert('picked:'+picked+' / unpicked ' +unpicked)				
				if (typeof pickResult.pickedMesh.matBackup == 'undefinded'){
					pickResult.pickedMesh.matBackup=false;
				}
				if (pickResult.pickedMesh.matBackup==true) {
					// apply indicator material to picked mesh
					//alert(pickResult.pickedMesh.material.toString());
					pickResult.pickedMesh.matBackup=false;
					pickResult.pickedMesh.material=unpicked;					
				} else {
					//alert('matBackup'+pickResult.pickedMesh.matBackup);
					// restore original material to unpicked mesh
					pickResult.pickedMesh.material=picked;
					pickResult.pickedMesh.matBackup=true;	
				}
			}
        }
    }
	
	
		

	
};		
	
});





