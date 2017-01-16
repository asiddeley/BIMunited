/////////////////////
//
// Andrew Siddeley
// 17-Dec-2016
//
// Main entry point of app

requirejs.config({
	
//default base URL is same as HTML 
//but needs to be the same as jquery for jquery to work
"baseUrl": "javascript/",

"paths": {
	"arch": "../Arch",
	"kernel": "../kernel",
	//"jq": "jquery",
	//"jq": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
	"sylvester": "sylvester/sylvesterXp",
	"jq":"../javascript/jquery",
	"babylon":"../babylon/babylonXP"
}

});


define(
// load dependencies...
[
'arch/archModel',
'jquery',
'babylon',
'kernel/dashboard',
'kernel/stage',
'kernel/eventAdmin',
'kernel/window'
],

// then do this...
function (Model, $, babylon, dashboard, stage, tea, win) {

//alert('BIMmain...');

var settings={
	//callback functions for when BIMsoup has a message 
	'blackboard':function(msg){alert(msg);},
	'canvas':null,
	'dbapi':null,
	'user':"defaultUser"
};
	
// construct library object for return
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
	'admin':function(user){
		$.extend(this.settings, {'user':user} );
		//alert("welcome "+settings.user+"\n");				
	},
			
	'blackboard':function(fn){
		if (fn instanceof Function){
			// a is a function so override blackboard setting thus
			$.extend(this.settings, {'blackboard':fn});
		};
		fn("Blackboard...<br>");
	},
	
	'canvas':function(canvas){
		$.extend(this.settings, {'canvas':canvas});
	},

	'database':function(dbapi){
		$.extend(this.settings, {'dbapi':dbapi});
	},
	
	'engage':function(usettings){
				
		// settings
		$.extend(this.settings, usettings);
		
		//alert('engage');
		this.model=Model.demo(1);
		
		// Set the stage, cameras, lights, materials
		this.stage=stage.demo(1);
		
		// sets the tools-event assoc 
		this.tea=tea;
		
		// prepare engine
		var c=this.settings.canvas;
		this.engine = new babylon.Engine(c, true);
		//why webgl dest rect smaller than viewport rect warning
		//try...
		//http://doc.babylonjs.com/classes/2.5/Engine
		//this.engine.setViewport(new babylon.Viewport(0,0,700,500));
		
		this.scene = new babylon.Scene(this.engine);
		var s=this.scene;
		
		// camera, lights
		this.stage.setScene(s, c);
		
		// visit all parts to set the babylon scene		
		this.model.handlers.setScene( this.model );
		//MSG('model.handlers.setScene:'+s); //ok
		
		// scene events
		//s.onPointerDown=this.kits.onPointerDown;
		this.tea.setScene(s, c);


		//s.debugLayer.show();
		
		// engage
		this.engine.runRenderLoop(function(){ s.render();} );	

	},
	
	// control
	'input':function(input){
		return this.tea.command(input, this.scene, this.settings.canvas);
	},
	
	// simple text message to blackboard
	'log':function(msg){this.settings.blackboard(msg, 'console');}
		
}; 		

win.BIM=BIM;
return BIM;

});





