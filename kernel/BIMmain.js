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
	"babylon":"../babylon/babylonXp"
}

});


define(
// load dependencies...
[ 'arch/archModel',
'jquery', 
'babylon',
'kernel/dashboard',
'kernel/stage',
'kernel/toolEventAdmin',
'kernel/window' ],

// then do this...
function (model, $,  babylon, dashboard, stage, tea, win) {

//alert('BIMmain...');

var settings={
	'canvas':null,
	'console':function(msg){ alert(msg); }, //callback for when BIMsoup has a message 
	'dbapi':null,
	'dashboard':null, //dashboard.create(), //used to display and edit a part's propertes
	'user':"defaultUser"
};

	
// return BIMsoup library object
var BIM={
	// properties
	'babylon':babylon,
	'engine':null,
	'library':{},	// like a model but not displayed.  Has available parts & models
	'model':null, 	// main model - created inside engage()
	'scene':null,	// the scene - created inside engage()
	'settings':settings,
	'stage':{}, 	// lights and cameras - created inside engage
	'tea':{}, 		// tool event admin 
	'window':win,	// BIM references window and window ref's BIM
	
	// API methods
	'allo':function(user){
		$.extend(this.settings, {'user':user} );
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
		//alert('engage');
		// Set model EXAMPLE 1
		// this.aModel.push(models.example(1));
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
		this.model.handlers.setScene( this.model );
		
		// scene events
		//s.onPointerDown=this.kits.onPointerDown;
		this.tea.setScene(s, c);

		//s.debugLayer.show();
		
		// engage
		this.engine.runRenderLoop(function(){ s.render();} );	

	},
	
	//control
	'input':function(input){
		return this.tea.command(input, this.scene, this.settings.canvas);
	}
		
}; // var BIM		

//alert('BIMmain...'+BIM);
//win.BIM=BIM;
return BIM;

});





