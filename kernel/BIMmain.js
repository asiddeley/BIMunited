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
	"arch":"../Arch",
	"cameras": "../cameras",
	"handlers":"../handlers",
	"kernel": "../kernel",
	"lights": "../lights",
	"textures": "../textures",
	"united": "../united",
	//"jq": "jquery",
	//"jq": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
	"sylvester": "sylvester/sylvesterXp",
	"jq":"../javascript/jquery",
	"babylon":"../babylon/babylon.required",
	"babylon2D":"../babylon/babylon.canvas2d.required"
}

});


define(
// load dependencies...
['kernel/Model',
'jquery',
'babylon',
'united/uiBlackboard',
'united/uiParts',
'united/uiPicker',
'united/uiFeatures',
'united/uiDashboard',
'lights/hemi',
'cameras/arcRotateCamera',
'textures/TMCstdLib',
'united/uiPartsLibrary'],

// then do this...
function (Model, 
$, 
babylon, 
uiBlackboard, 
uiParts, 
uiPicker, 
uiFeatures, 
uiDashboard,
Light, 
arcRotateCamera, 
TMC, 
partsLibrary) {

// construct library object for return
var BIM={
	
	// The a, b, c, d & e main API methods...
	admin:function(user, options){
		user=(typeof user=='undefined')?'admin':user;
		options=(typeof options == 'undefined')?{}:options;
		
		$.extend(this.options, {admin:user}, options);
	},
		
	board:function(div, options){
		if (typeof div == 'undefined'){div=$('<div></div>').appendTo(window.document.body);}
		if (typeof options == 'undefined'){options={};}
		
		$.extend( this.options, {board:div}, options );	
		
		uiBlackboard.create(div, BIM.ui, [
			//note that the create functions below are not called ie. no brackets(),
			//uiBlackboard will call them only after uiBlackboard is created
			uiParts,			
			uiFeatures,	
			uiPicker						
		]);
		
	},
	
	canvas:function(canvas){
		
		$.extend(this.options, {'canvas':canvas});
	},

	database:function(udata){
		$.extend(this.options, {database:udata});
	},
	
	engage:function(){
		
		var that=this;	
		
		// prepare engine
		var c=this.options.canvas;
		var engine = new babylon.Engine(c,  true);
		this.options.engine=engine;
		// why warning re. webgl dest rect smaller than viewport rect?
		// See, http://doc.babylonjs.com/classes/2.5/Engine, try this...
		// this.engine.setViewport(new babylon.Viewport(0,0,700,500));
		
		// initialize the scene
		this.scene=new babylon.Scene(engine);
		var s=this.scene;
		
		// set light in scene
		this.light.handler.setScene(this.light);
		
		// visit all parts to set the babylon scene		
		this.model.handler.setScene(this.model);
		
		// initialize scene materials
		//this.fun.log('initializing tcm');
		for (var key in this.tcmLib) {
			var m=this.tcmLib[key];
			m.handler.setScene(m);
			//that.fun.log(key);that.fun.log(m.handler.type);
		}
		
		// initialize view-camera in scene
		//this.viewLib.main.handler.setScene(this.viewLib.main);
		this.views.main.create();
		
		// This is a cool Babylon feature
		//s.debugLayer.show();
		
		// engage the engine!
		engine.runRenderLoop(function(){ s.render();} );	

	},
	
	// function store 
	fun:{
		addEventHandlers:function(eh){
			BIM.ui.uiBlackboard.addEventHandlers(eh);			
		},
		autoHeight:function(el){
			// grows textarea fit text - useful for typing in a small textarea 
			$(el).css('height','auto').css('height', el.scrollHeight+5);		
		},
		log:function(message) {BIM.ui.uiBlackboard.log(message);},
		randomPosition:function() {
			var s=100;//BIM.model.worldBox.size;
			var v=new babylon.Vector3(Math.random()*s,  Math.random()*s, Math.random()*s); 
			return v;
		},
		trigger:function(ev, data){
			BIM.ui.uiBlackboard.div$.trigger(ev, data);
		},
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
		uidstore:{ },
		unique:function(name){return this.uid(name);}
	},
	
	//shortcuts
	get:{
		activeModel:function(am) {
			if(typeof am!='undefined') {this.activeModelObj=am;}
			if(this.activeModelObj==null) {this.activeModelObj=BIM.model;}
			return this.activeModelObj;	
		},
		activeModelObj:null,
		
		//gets or sets current mesh - newly created or picked
		cMesh:function(cm){
			if(typeof cm!='undefined') {this.cMeshObj=cm;}
			else {return this.cMeshObj};	
		},
		cMeshObj:null,
		
		bb:function(){ return BIM.ui.blackboard;},
		canvas:function() {return BIM.options.canvas;},	
		scene: function() {return BIM.scene;},
		uid: function(name) {return BIM.fun.uid(name);}
	},

	help:function(input){
		this.fun.log('help on '+input);
	},
	
	//main method for user interaction
	input:function(input){return this.ui.uiBlackboard.trigger('bimInput', input);},
	
	//Reserved
	j:null,
	
	//list of commands, 
	keywords:{},
	
	// main light
	light:Light.demo(1),
	
	// DEPRICATED, use scene instead
	// main model - this is the entry point for the scene 
	model:Model.creaters.demo(),
	
	// Reserved
	n:null,
	
	// Extended by user in a, b, c, d & e API functions
	options:{
		admin:{user:"unnamed", disc:'arch'},
		board:null,
		canvas:null,
		database:null,
		engine:null,
		
	},	
	
	/*****
	For things below, Lib appendix means library or hash of vailable items for importatrion into the model.  
	Each library has a correspoding ui to control imporation into the model.  
	All items must have setScene function ie. sceneable with the babylon engine
	******/
	//parts library 
	partsLib:partsLibrary,
	
	//Reserved
	q:null,

	//Libaray of models not rendered unless called/referenced from model	
	referenceLib:{},
	
	//Babylon scene, analog to BIM.model, initialized by engage()
	scene:null,	
	
	//Texture colour material library 
	textures:TMC.stdLib(),
	
	//User interfaces, initialized by this.board()
	ui:{},
	
	//View library, A view is the BIM analog to babylon camera
	views:{main:arcRotateCamera},
	
	//Worldbox Library.  
	//A worldbox contains information about a model's bounds, units, and yonder ie sky box and ground
	worldBoxLib:{},

	//Reserved
	x:null, y:null, z:null 
	
}; 		

window.BIM=BIM;
return BIM;

});





