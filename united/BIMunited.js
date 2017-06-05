/************************************************************

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

	project:	BIM united FC
	module: 	BIM united
	desc: 		Main entry point of app
	by: 		Andrew Siddeley 
	started:	17-Dec-2017
	
*/	

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

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

// Dependencies...
var $=require('jquery');
var babylon=require('babylon');
var TabbedUI=require('united/TabbedUI');
var BlackboardUI=require('united/BlackboardUI');
var PartsUI=require('united/PartsUI');
var PickerUI=require('united/PickerUI');
var PeekerUI=require('united/PeekerUI');
var PokerUI=require('united/PokerUI');
var FeaturesUI=require('united/FeaturesUI');
//var Lights=require('lights/lights');
var arcRotateCamera=require('cameras/arcRotateCamera');
var TMC=require('textures/TMCstdLib');
//var partsLibrary=require('parts/partsLibrary');
var partsLibrary=require('handlers/handlers__elements');
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
		new PartsUI(null, 'Part'),
		new PeekerUI(null, 'Peek'),
		new PickerUI(null, 'Pick'),
		new PokerUI(null, 'Poke')
	); 
}

BIM.canvas=function(canvas){ $.extend(this.options, {canvas:canvas}); }

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
	this.lights.main.setScene(this.scene);
	
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
BIM.func={
	//Depricated
	addEventHandlers:function(eh){BIM.ui.blackboard.addEventHandlers(eh);},

	// grows textarea fit text - useful for typing in a small textarea 
	autoHeight:function(el){$(el).css('height','auto').css('height', el.scrollHeight+5);},
	
	//Depricated - stopped working and not necessary
	cameraPause:function(eventName){
		if (typeof eventName=='undefined') {eventName='unpause';}
		//detach camera
		setTimeout(
			function(){BIM.scene.activeCamera.detachControl(BIM.options.canvas);},
			0
		);
		
		//and setup one-time event to restore or attach camera
		BIM.fun.one([{
			name:eventName,
			data:{},
			handler:function(){
				BIM.scene.activeCamera.attachControl(BIM.options.canvas,false);
			}
		}]);		
	},

	//returns a BABYLON.Vector3 representing the closest axis to the argument vector
	//thanks to http://stackoverflow.com/questions/25825464/get-closest-cartesian-axis-aligned-vector-in-javascript
	closestAxis:function(vector3){
		var r=new BABYLON.Vector3(0,0,0); //result
		var x=vector3.x, y=vector3.y, z=vector3.z;
		// absolute values for direction cosines, bigger value equals closer to basis axis
		var xn=Math.abs(x), yn=Math.abs(y), zn=Math.abs(z);
		if ((xn>=yn)&&(xn>=zn)) {(x>0) ? r.copyFromFloats(1,0,0):r.copyFromFloats(-1,0,0);
		} else if ((yn>xn)&&(yn>=zn)) {(y>0) ? r.copyFromFloats(0,1,0):r.copyFromFloats(0,-1,0);
		} else if ((zn>xn)&&(zn>yn)) {(z>0) ? r.copyFromFloats(0,0,1):r.copyFromFloats(0,0,-1);
		} else {r.copyFromFloats(1,0,0);}
		return r;
	},
	
	dump:function(txt){	BIM.ui.blackboard.divDump$.show().text(txt);},
	
	//this.trigger('bimMsg', message);
	log:function() {for (var a in arguments) BIM.ui.blackboard.log(arguments[a].toString());},

	matchAll:function(sourceMesh, targetMesh) {
		FeaturesUI.prototype.matchAll(sourceMesh, targetMesh);
	},
	
	on:function(eventHandlers){
		//eventHandler eg. {name:'bimInput', data:this, handler:this.onInput }
		var ee=eventHandlers, n, b$=BIM.options.board$;
		//add event handlers to board, the acting event manager
		for (n in ee){b$.on(ee[n].name, ee[n].data, ee[n].handler);}	
	},
	
	one:function(eventHandlers){
		//eventHandlers - [{name:'bimInput', data:this, handler:this.onInput }...]
		var ee=eventHandlers, n, b$=BIM.options.board$;		
		for (n in ee){b$.one(ee[n].name, ee[n].data, ee[n].handler);}	
	},

	off:function(eventHandlers){
		//eventHandler eg. {name:'bimInput', data:this, handler:this.onInput }
		var ee=eventHandlers, n, b$=BIM.options.board$;
		//add event handlers to board, the acting event manager
		for (n in ee){b$.off(ee[n], ee[n].data, ee[n].handler);}	
	},

	randomInt:function(s) {
		s=(typeof s=='undefined')?100:s; //default is 100
		return (Math.floor(Math.random()*s)); 
	},
	
	randomV3:function(s) {
		s=(typeof s=='undefined')?100:s; //default is 100
		return (new babylon.Vector3(Math.random()*s,  Math.random()*s, Math.random()*s)); 
	},
	
	randomV3I:function(s) {
		//random vertex of 3 integers
		s=(typeof s=='undefined')?100:s; //default is 100
		return (new babylon.Vector3(
			Math.floor(Math.random()*s), 
			Math.floor(Math.random()*s),
			Math.floor(Math.random()*s)
		)); 
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
// alias
BIM.fun=BIM.func;
	
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
	////////////////////////////////////
	featurize:function(obj, feature1, feature2, etc){
		//adds features {} and getFeatures function to obj
		
	},
	scene: function() {return BIM.scene;},
	uid: function(name) {return BIM.fun.uid(name);},
	//global variable storage
	val:function(key, valu){
		//TO DO...
		//usage - store 'hello world' as 'msg'
		//BIM.get.val('msg','hello world'); 
		//usage - retrieve 'msg'
		//BIM.get.val('msg');
		console.log(key.toString() + '='+ valu.toString());
	},
	valstore:{}
};

BIM.help=function(input){
	this.fun.log('help on '+input);
}
	
//main method for user interaction
BIM.input=function(input){return this.fun.trigger('bimInput', input);}
	
//list of commands, 
BIM.keywords={};
	
// main light
BIM.lights=require('lights/lights');
	
// Extended by user in API functions above
BIM.options={
	admin:{user:"unnamed", disc:'arch'},
	board:null,
	canvas:null,
	database:null,
	engine:null		
};	
	
//parts library 
BIM.parts=partsLibrary;
	
//Library of element/part libraries 	
BIM.resources={
	Arch:{alias:'Arch', url:'arch'},
	Geology:{alias:'Geo', url:'geology'},
	Elec:{alias:'Elec', url:'elec'},
	Elements:{alias:'Elements', url:'handlers'},
	Mech:{alias:'Mech', url:'Mech'},
	OpsMan:{alias:'O & M', url:'OpsMaint'},
	QSCA:{alias:'QS & CA', url:'QSCA'}
};
	
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





