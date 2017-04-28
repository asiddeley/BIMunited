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
//'kernel/Model',
'jquery',
'babylon',
'united/TabbedUI',
'united/BlackboardUI',
'united/MakerUI',
//'united/uiPicker',
'united/FeaturesUI',
'lights/hemi',
'cameras/arcRotateCamera',
'textures/TMCstdLib',
'parts/partsLibrary'],

// then do this...
function (
//Model, 
$, 
babylon, 
TabbedUI,
BlackboardUI, 
MakerUI, 
//uiPicker, 
FeaturesUI, 
Light, 
arcRotateCamera, 
TMC, 
partsLibrary) {

var Bim=function(){};
var __=Bim.prototype;

	// The a, b, c, d & e main API methods...
__.admin=function(user, options){
	user=(typeof user=='undefined')?'admin':user;
	options=(typeof options == 'undefined')?{}:options;
	$.extend(this.options, {admin:user}, options);
};
	
__.board=function(div, options){
	if (typeof div == 'undefined'){div=$('<div></div>').appendTo(window.document.body);}
	if (typeof options == 'undefined'){options={};}
	//wrap div with jquery if not already
	if (div instanceof window.Element){div=$(div);}
	
	$.extend( this.options, {board$:div}, options );	
	
	var tui=new TabbedUI(div, "Main");
	this.ui.blackboard=new BlackboardUI(null, "Log");
	tui.addTab( 
		this.ui.blackboard, 
		new MakerUI(null, 'Make')
		//new FeaturesUI(null, 'Features')
	); 
}

__.canvas=function(canvas){ $.extend(this.options, {'canvas':canvas}); }

__.database=function(udata){	$.extend(this.options, {database:udata}); }
	
__.engage=function(){

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
__.fun={
	addEventHandlers:function(eh){
		BIM.ui.uiBlackboard.addEventHandlers(eh);			
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
		var ee=eventHandlers, n, b$=BIM.options.board$;
		//add event handlers to board, the acting event manager
		for (n in ee){b$.on(n, ee[n].data, ee[n].handler);}	
	},
	
	off:function(eventHandlers){
		var ee=eventHandlers;
		//add event handlers to board, the acting event manager
		var n, b$=$(this.options.board);
		for (n in ee){b$.of(n, ee[n].data, ee[n].handler);}	
	},
	
	randomPosition:function() {
		var s=100;//BIM.model.worldBox.size;
		var v=new babylon.Vector3(Math.random()*s,  Math.random()*s, Math.random()*s); 
		return v;
	},
	
	trigger:function(ev, arg1){
		//BIM.ui.uiBlackboard.div$.trigger(ev, arg1);
		BIM.options.board$.trigger(ev, arg1);
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
};
	
//shortcuts
__.get={
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

__.help=function(input){
	this.fun.log('help on '+input);
}
	
	//main method for user interaction
__.input=function(input){return this.fun.trigger('bimInput', input);}
	
	//list of commands, 
__.keywords={};
	
	// main light
__.light=Light.demo(1);
	
	// Extended by user in a, b, c, d & e API functions
__.options={
	admin:{user:"unnamed", disc:'arch'},
	board:null,
	canvas:null,
	database:null,
	engine:null		
};	
	
//parts library 
__.partsLib=partsLibrary;
	
//Libaray of models not rendered unless called/referenced from model	
__.referenceLib={};
	
//Babylon scene, analog to BIM.model, initialized by engage()
__.scene=null;
	
//Texture colour material library 
__.textures=TMC.stdLib();
	
//User interfaces, initialized by this.board()
__.ui={};
	
//View library, A view is the BIM analog to babylon camera
__.views={ main:arcRotateCamera };
	
//Worldbox Library.  
//A worldbox contains information about a model's bounds, units, and yonder ie sky box and ground
__.worldBoxLib={};

BIM=new Bim();
window.BIM=BIM;
return BIM;

}); //end of define





