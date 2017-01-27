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
'kernel/uiBlackboard',
'kernel/uiPropertyBoard',
'kernel/lightHemi',
'kernel/viewFree'
],

// then do this...
function (Model, $, babylon, stage, interpreter, uibb, uipb, Light, View) {

// construct library object for return
var BIM={
	
	// The a, b, c, d & e main API methods...
	admin:function(username){
		$.extend(this.options, { user:username} );
	},
		
	board:function(el){
		$.extend(this.options, {'board':el});		
		var bb=$('<div class="BIMblackboard">blackboard</div>'); 
		$(el).append(bb);
		this.ui.blackboard=uibb.create(bb);
		var pb=$('<div class="BIMpropboard">properties</div>');
		$(el).append(pb);
		this.ui.propertyboard=uipb.create(pb);
	},
	
	canvas:function(canvas){
		$.extend(this.options, {'canvas':canvas});
	},

	database:function(dbapi){
		$.extend(this.options, {'dbapi':dbapi});
	},
	
	engage:function(uOptions){
				
		// settings
		$.extend(this.options, uOptions);
		
		// prepare engine
		var c=this.options.canvas;
		var engine = new babylon.Engine(c,  true);
		// why warning re. webgl dest rect smaller than viewport rect?
		// See, http://doc.babylonjs.com/classes/2.5/Engine, try this...
		// this.engine.setViewport(new babylon.Viewport(0,0,700,500));
		
		// initialize the scene
		this.scene = new babylon.Scene(engine);
		var s=this.scene;
		
		// set light in scene
		this.light.handler.setScene( this.light );
		
		// visit all parts to set the babylon scene		
		this.model.handler.setScene( this.model );
		
		// set view in scene
		this.view.handler.setScene(this.view);
		
		// This is a cool Babylon feature
		// s.debugLayer.show();
		
		// engage the engine!
		engine.runRenderLoop(function(){ s.render();} );	

	},
	
	// function store 
	fun:{
		autoHeight:function(el){
			// grows textarea fit text - useful for typing in a small textarea 
			$(el).css('height','auto').css('height', el.scrollHeight+5);		
		},
		log:function(message) {BIM.ui.blackboard.log(message);},
		uid:function(name){
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
		uidstore:{ }			
	},
	
	//shortcuts
	get:{
		canvas:function() {return BIM.options.canvas;},
		scene: function() {return BIM.scene;},
		uid: function(name) {return BIM.fun.uid(name);},
		uipb:function() {return BIM.ui.propertyboard;}
	},
	
	// control
	input:function(input){
		//return this.tea.command(input, this.scene, this.settings.canvas);
		//var result=this.tea.command(input);
		var result=interpreter.command(input);
		this.fun.log(input); this.fun.log(result);		
	},
	
	juliet:null,
	
	kilo:null,
	
	// main light
	light:Light.demo(1),
	
	// main model 
	model:Model.demo(1),
	
	// Extended by user in a,b,c,d&e API functions
	options:{
		blackboard:function(msg){alert(msg);},	 //basic callback function for BIM messages 
		boards:{blackboard:null, propertyboard:null},
		canvas:null,
		dbapi:null,
		user:"defaultUser"
	},	
	
	parts:{},
	
	project:{
		//partInfo
		//non graphic element
		discpline:'arch',	
		location:'unknown',
		name:'unnamed',
		projectNumber:'xxxx'
	},
	
	// collections of items not part of scene unless called/referenced from mainModel
	// all items must have setScene function - sceneable
	referenceModel:{		
		//arrangers:{},
		//colours:{},
		//lights:{},
		//models:{},
		//robots:{}, // populators, defaults, tests etc
		//texmat:{}, // babylon materals and textures
		//views:{} // babylon cameras
	},
	
	scene:null,	// the scene - created inside engage()
	
	stage:{}, 	// lights and cameras - created in engage()
	
	textures:{},
	
	// Various user interfaces.  Initialized by this.board()
	ui:{
		blackboard:{}, 
		propertyboard:{} 
	},
	
	view:View.demo(),
	
	//'window':win	// BIM references window and window ref's BIM
	
	
}; 		

window.BIM=BIM;
return BIM;

});





