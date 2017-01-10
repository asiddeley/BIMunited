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
}
});


define(
// load dependencies...
[ 'arch/archModel',
'jquery', 
'babylon',
'kernel/stage',
'kernel/toolEventAdmin',
'kernel/window'],

// then do this...
function (model, $,  babylon, stage, tea, win) {

var settings = {
	'canvas':null,
	'console':function(msg){ alert(msg); }, //callback for when BIMsoup has a message 
	'dbapi':null,
	'user':"defaultUser"	
};
	
// return BIMsoup library object
BIM={
	
	// properties
	'babylon':babylon,
	'engine':null,
	'library':{}, 	// available parts
	'model':{}, 
	'scene':null,
	'settings':settings,
	'stage':{}, 	// lights and cameras
	'tea':{}, 		// tool event admin 
	'window':win,	// BIMsoup references window and window ref's BIMsoup
	
	// API methods
	'allo':function(user){
		$.extend(this.settings, {'user':user});
		//alert("welcome "+settings.user+"\n");				
	},

	'board':function(canvas){
		$.extend(this.settings, {'canvas':canvas});
	},	
			
	'console':function(callback){
		// command line input and output
		if (callback instanceof Function){
			$.extend(this.settings, { 'console':callback});
		}
	},

	'database':function(dbapi){
		$.extend(this.settings, {'dbapi':dbapi});
	},
	
	'engage':function(usettings){
				
		// settings
		$.extend(this.settings, usettings);
		
		// Set model EXAMPLE 1
		//this.aModel.push(models.example(1));
		this.model=model.demo(1);
		
		// Set the stage, cameras, lights, materials
		this.stage=stage.demo(1);
		
		// sets the tools-event assoc 
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
	'input':function(input){
		return this.tea.command(input, this.scene, this.settings.canvas);
	}
	
	
}		
	
win.BIM=BIM;
return BIM;
});





