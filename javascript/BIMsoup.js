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
		"kits": "../kits",
		//"jq": "jquery",
		//"jq": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
		"sylvester": "sylvester/sylvesterXp",
		"jq":"jquery",
		"babylon":"../webGL/babylonXp",
		"BIMsoup":"BIMsoup"
    }
});


var settings = {
	'canvas':null,
	'cli':null, //command line input
	'console':null, //command line output
	'dbapi':null,
	'user':"defaultUser"	
};

define(
// load dependencies...
['arch/archModels','jquery', 'babylon', 'basic/_stagings', 'kits/_kits'],

// then do this...
function (models, $, BABYLON, stagings, kits) {
	
// return BIMsoup object
return {
	
	// properties
	'engine':null,
	'kit':{}, 		//tool-event manager
	'library':{}, 	//available parts
	'model':{}, 
	'scene':null,
	'settings':settings,
	'stage':{}, 	//lights and cameras
	
	// API methods
	'allo':function(user){
		
		$.extend(this.settings, {'user':user});
		//alert("welcome "+settings.user+"\n");				
	},

	'board':function(canvas){
		$.extend(this.settings, {'canvas':canvas});
	},	
			
	'console':function(output){
		// command line input and output
		$.extend(this.settings, { 'console':output});
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
		//this.aModel.push(models.example(1));
		this.model=models.example(1);
		
		// Set the stage, cameras, lights, materials
		this.stage=stagings.example(1);
		
		// sets the kit which manages tools-events
		this.kit=kits.pickToDump();

		
		// prepare engine
		var c=this.settings.canvas;
		this.engine = new BABYLON.Engine(c, true);
		this.scene = new BABYLON.Scene(this.engine);
		var s=this.scene;
		
		// camera, lights
		this.stage.setScene(s, c);
		
		// visit all parts to set the babylon scene		
		this.model.setScene(s, c);
		
		// scene events
		//s.onPointerDown=this.kits.onPointerDown;
		this.kit.setScene(s, c);

		//s.debugLayer.show();
		
		// engage
		this.engine.runRenderLoop(function(){s.render();});	

	}
	
	
};		
	
});





