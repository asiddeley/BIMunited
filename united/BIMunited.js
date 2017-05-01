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
	"editors":"../editors",
	"features":"../features",
	"handlers":"../handlers",
	"kernel": "../kernel",
	"lights": "../lights",
	"parts":"../parts",
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
[
'jquery',
'babylon',
'united/TabbedUI',
'united/BlackboardUI',
'united/MakerUI',
'united/PickerUI',
'united/FeaturesUI',
'lights/hemi',
'cameras/arcRotateCamera',
'textures/TMCstdLib',
'parts/partsLibrary'],

// then do this...
function (
$, 
babylon, 
TabbedUI,
BlackboardUI, 
MakerUI, 
PickerUI, 
FeaturesUI, 
Light, 
arcRotateCamera, 
TMC, 
partsLibrary) {

var BIM={};

// The a, b, c, d & e main API methods...
BIM.admin=function(user, options){
	user=(typeof user=='undefined')?'admin':user;
	options=(typeof options == 'undefined')?{}:options;
	$.extend(this.options, {admin:user}, options);
};
	
BIM.board=function(div, options){
	if (typeof div == 'undefined'){div=$('<div></div>').appendTo(window.document.body);}
	if (typeof options == 'undefined'){options={};}
	//wrap div with jquery if not already
	if (div instanceof window.Element){div=$(div);}
	
	$.extend( this.options, {board$:div}, options );	
	
	var tui=new TabbedUI(div, "Main");
	this.ui.blackboard=new BlackboardUI(null, "Log");
	tui.addTab( 
		this.ui.blackboard, 
		new MakerUI(null, 'Make'),
		new PickerUI(null, 'Pick')
	); 
}

BIM.canvas=function(canvas){ $.extend(this.options, {'canvas':canvas}); }

BIM.database=function(udata){	$.extend(this.options, {database:udata}); }
	
BIM.engage=function(){

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
	//this.model.handler.setScene(this.model);
	
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
	// s.debugLayer.show();
	
	// engage the engine!
	engine.runRenderLoop(function(){ s.render();} );
	
	// announce it
	this.options.board$.trigger('bimEngage');
};
	
// function collection 
BIM.fun={
	//depricated
	addEventHandlers:function(eh){
		BIM.ui.blackboard.addEventHandlers(eh);			
	},
	
	autoHeight:function(el){
		// grows textarea fit text - useful for typing in a small textarea 
		$(el).css('height','auto').css('height', el.scrollHeight+5);		
	},
	
	dump:function(txt){
		BIM.ui.blackboard.divDump$.show().text(txt);
	},		

	log:function(message) {
		//this.trigger('bimMsg', message);
		BIM.ui.blackboard.log(message);
	},
	
	on:function(eventHandlers){
		//eventHandler eg. {name:'bimInput', data:this, handler:this.onInput }
		var ee=eventHandlers, n, b$=BIM.options.board$;
		//add event handlers to board, the acting event manager
		for (n in ee){b$.on(ee[n].name, ee[n].data, ee[n].handler);}	
	},

	off:function(eventHandlers){
		var ee=eventHandlers;
		//add event handlers to board, the acting event manager
		var n, b$=$(this.options.board);
		for (n in ee){b$.off(ee[n], ee[n].data, ee[n].handler);}	
	},

	randomPosition:function() {
		var s=100;//BIM.model.worldBox.size;
		var v=new babylon.Vector3(Math.random()*s,  Math.random()*s, Math.random()*s); 
		return v;
	},
	
	trigger:function(ev, arg1, arg2){
		//BIM.ui.uiBlackboard.div$.trigger(ev, arg1);
		//BIM.fun.log('BIM.trigger:'+ev);
		BIM.options.board$.trigger(ev, arg1, arg2);
	},
			
	uid:function(name){
		//Returns a simple unique id string based on a given name and
		//how many time that name is called.  If no name given then 'id' is the default name.
		//eg. 'cell1', 'line1', 'cell2', 'line2', 'line3', 'id1' ...
		name=(typeof name == 'undefined')?'id':name.toString();
		var count=this.uidstore[name];
		count=(typeof count == 'undefined')?1:count+1; //define or increment id number
		this.uidstore[name]=count; //save count
		return name+count.toString();
	},
	uidstore:{ },
	unique:function(name){return this.uid(name);}
};
	
//getters
BIM.get={
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
};

BIM.help=function(input){
	this.fun.log('help on '+input);
}
	
//main method for user interaction
BIM.input=function(input){return this.fun.trigger('bimInput', input);}
	
//list of commands, 
BIM.keywords={};
	
// main light
BIM.light=Light.demo(1);
	
// Extended by user in a, b, c, d & e API functions
BIM.options={
	admin:{user:"unnamed", disc:'arch'},
	board:null,
	canvas:null,
	database:null,
	engine:null		
};	
	
//parts library 
BIM.parts=partsLibrary;
	
//Libaray of models not rendered unless called/referenced from model	
BIM.referenceLib={};
	
//Babylon scene, analog to BIM.model, initialized by engage()
BIM.scene=null;
	
//Texture colour material library 
BIM.textures=TMC.stdLib();
	
//User interfaces, initialized by this.board()
BIM.ui={};
	
//View library, A view is the BIM analog to babylon camera
BIM.views={ main:arcRotateCamera };
	
//Worldbox Library.  
//A worldbox contains information about a model's bounds, units, and yonder ie sky box and ground
BIM.worldBoxes={};

window.BIM=BIM;
return BIM;

}); //end of define





