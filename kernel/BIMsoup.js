/////////////////////
//
// Andrew Siddeley
// 17-Dec-2016
//
// Main entry point of app

requirejs.config({
	
//default base URL is same as HTML file ie. root or /BIMsoup,
//but needs to be the same as jquery for jquery to work
"baseUrl": "javascript/",

"paths": {
	"arch": "../Arch",
	"basic": "../Basic",
	"kernel": "../kernel",
	//"jq": "jquery",
	//"jq": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
	"sylvester": "sylvester/sylvesterXp",
	"jq":"../javascript/jquery",
	"babylon":"../webGL/babylonXp",
	//"BS":"../kernel/BIMsoup"
}
});


var settings = {
	'canvas':null,
	'cli':null, //command line input
	'console':null, //DOM element for BIMsoup messages and output 
	'dbapi':null,
	'user':"defaultUser"	
};

define(
// load dependencies...
['arch/archModels',
'jquery', 
'babylon',
'basic/_stagings',
'kernel/_toolEventAssoc',
'kernel/window'],

// then do this...
function (
models,
$, 
babylon, stagings, tea, win
) {
	
// return BIMsoup library object
return {
	
	// properties
	'babylon':babylon,
	'engine':null,
	'library':{}, 	//available parts
	'model':{}, 
	'scene':null,
	'settings':settings,
	'stage':{}, 	//lights and cameras
	'tea':{}, 		//tool-event associations (mapping)
	'window':win,	//BIMsoup references window and window ref's BIMsoup
	
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
		
		//make BIMsoup global
		win.BIMsoup=this;
		
		// Set model EXAMPLE 1
		//this.aModel.push(models.example(1));
		this.model=models.demo(1);
		
		// Set the stage, cameras, lights, materials
		this.stage=stagings.demo(1);
		
		// sets the tools-event association helper
		this.tea=tea;
		
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
		this.tea.setScene(s, c);

		//s.debugLayer.show();
		
		// engage
		this.engine.runRenderLoop(function(){s.render();});	

	},
	
	
	//control
	'instruction':function(input){
		return this.tea.command(input, this.scene, this.settings.canvas);
	}
	
	
}		
	
});





