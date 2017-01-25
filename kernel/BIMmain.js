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
'kernel/stage',
'kernel/interpreter',
'kernel/window'
],

// then do this...
function (Model, $, babylon, stage, interpreter, win) {

//alert('BIMmain...');

var settings={
	'blackboard':function(msg){alert(msg);},	 //basic callback function for BIM messages 
	'boards':{'blackboard':null, 'propertyboard':null},
	'canvas':null,
	'dbapi':null,
	'user':"defaultUser"
};
	
// construct library object for return
var BIM={
	// properties
	//'babylon':babylon,
	//'engine':null,
	'library':{},	// like a model but not displayed.  Has available parts & models
	'model':null, 	// main model - created inside engage()
	'scene':null,	// the scene - created inside engage()
	'settings':settings, //settings - extended in engage()
	'stage':{}, 	// lights and cameras - created in engage()
	//'tea':{}, 		// the event administrator - set in engage()
	'window':win,	// BIM references window and window ref's BIM
	
	// The a, b, c, d & e main API methods...
	'admin':function(user){
		$.extend(this.settings, {'user':user} );
		//alert("welcome "+settings.user+"\n");				
	},
			
	'blackboard':function(fn){
		if (fn instanceof Function){$.extend(this.settings, {'blackboard':fn}); };
		//fn("Blackboard...<br>");
	},
		
	'boards':function(el){
		$.extend(this.settings, {'boards':el});
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
		// To do, include this in model 
		this.stage=stage.demo(1);
		
		// prepare engine
		var c=this.settings.canvas;
		var engine = new babylon.Engine(c, true);
		// why webgl dest rect smaller than viewport rect warning, from
		// http://doc.babylonjs.com/classes/2.5/Engine, try this...
		// this.engine.setViewport(new babylon.Viewport(0,0,700,500));
		
		this.scene = new babylon.Scene(engine);
		var s=this.scene;
		
		// camera, lights
		this.stage.setScene(s, c);
		
		// visit all parts to set the babylon scene		
		this.model.handlers.setScene( this.model );
		// MSG('model.handlers.setScene:'+s); //ok
		
		// This is a cool Babylon feature
		// s.debugLayer.show();
		
		// engage
		engine.runRenderLoop(function(){ s.render();} );	

	},
	
	// function store 
	'fun':{
		'autoHeight':function(el){
			// grows textarea fit text - useful for typing in a small textarea 
			$(el).css('height','auto').css('height', el.scrollHeight+5);		
		},
		'uid':function(name){
			//Returns a simple unique id string based on a given name and
			//how many time that name is called.  If no name given then 'id' is the default name.
			//eg. 'cell1', 'line1', 'cell2', 'line2', 'line3', 'id1' ...
			name=(typeof name == 'undefined')?'id':name.toString();
			var count=this.uidstore[name];
			count=(typeof count == 'undefined')?1:count+1; //define or increment id number
			this.uidstore[name]=count; //save count
			//alert( name+count.toString());
			return name+count.toString();
		},
		'uidstore':{ }			
	},
	
	'get':{
		'canvas':function() {return this.setting.canvas;},
		'scene': function() {return this.scene;},
		'uid': function(name) {return BIM.fun.uid(name);}
	},

	
	// control
	'input':function(input){
		//return this.tea.command(input, this.scene, this.settings.canvas);
		//var result=this.tea.command(input);
		var result=interpreter.command(input);
		this.log(input); this.log(result);		
	},
	
	// simple text message to blackboard
	'log':function(msg){
		//this.settings.blackboard(msg, 'console');
		this.stage.ui.uiBlackboard.log(msg);
	},
	
}; 		

win.BIM=BIM;
return BIM;

});





