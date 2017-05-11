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
	module: 	MakerUI
	by: 		Andrew Siddeley 
	started:	16-Feb-2017
	
*/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){
	
var $=require('jquery');
var $$=require('jquery-ui');
var babylon=require('babylon');
var UI=require('united/UI');
var FeaturesUI=require('united/FeaturesUI');
var triad=require('parts/Triad');

var PartsUI=function(board, title){
	// Inherit from UI, call super constructor
	UI.call(this, board, title); 

	this.alias='Part';
	this.parts={}; //set onRestock
	this.sample=null; //babylon mesh set onChoosePart
	this.bimHandler={}; //set onChoosePart

	this.scene=null;
	this.fui=new FeaturesUI(null, 'Features of New Part');
	this.canvas$=$('<canvas></canvas>').css({'width':'100px', 'height':'100px'});
	this.ok$=$('<button>ADD (to Model)</button>').on('click', this, function(ev){
		//BIM.fun.log('Make');
		//BIM.scene.addMesh(ev.data.sample); //no effect, needs work and what about
		//material and other dependencies?
		var newpart=ev.data.bimHandler.setScene(BIM.scene);
		//match sample features to new part
		FeaturesUI.prototype.matchFeatures(ev.data.sample, newpart);

	});
	this.cg$=$('<div></div>').css({'display':'inline-block', 'vertical-align':'top', 'width':'200px'});
	this.desc$=$('<div></div>').addClass('ui-controlgroup-label'); 
	
	this.part$=$('<select></select>'); 
	this.resource$=$('<select></select>'); 

	this.cg$.append(this.ok$, this.resource$, this.part$, this.desc$ );
	this.wigetize(this);

	this.desc$.text('Choose a part, edit and add to model.');
	this.div$.append(this.cg$, this.canvas$, this.fui.div$);

	//For setup of sample canvas & scene, see onTabsactivate below.
	BIM.fun.trigger('restock', [BIM.parts]);
	BIM.fun.trigger('resourcesupdate', [[
		{name:'Arch Lib', url:'...'},
		{name:'Elec Lib', url:'...'},
		{name:'Mech Lib', url:'...'}
	]]);

	return this;
};

// Inherit the UI prototype
PartsUI.prototype=Object.create(UI.prototype);
PartsUI.prototype.constructor=PartsUI;
var __=PartsUI.prototype;

__.getEvents=function(){
	return [
		{name:'bimInput', data:this, handler:this.onInput },
		{name:'restock', data:this, handler:this.onRestock },
		{name:'resourcesupdate', data:this, handler:this.onResourcesUpdate },
		{name:'tabsactivate', data:this, handler:this.onTabsactivate }
	];
};

__.onChoosePart=function(ev, ui, that){
	//that - makerUI
	//this - <select></select> 
	//ev - event
	//ui - selected item or one of <option></option> tags, see jauery-ui docs
	//ui.item - {element:{value:'somestring', label:'somestring', }}

	//BIM.fun.log(JSON.stringify(ui.item));
	//BIM.fun.log('To make:'+ui.item.label);
	if (that.sample !=null) {that.sample.dispose();} //remake sample
	that.bimHandler=that.partsLib[ui.item.label];
	that.sample=that.bimHandler.setScene(that.scene);	
	that.desc$.text(that.sample.bimHandler.desc);	
	//connect and show features of sample
	that.fui.start(that.sample);
};

__.onChooseResource=function(ev, ui, that){
	//TO DO
};

//inherited from UI but overriden
__.onInput=function(ev, input){ 
	//don't use keyword 'this' here as it will refer to the event caller's context, not uiPicker
	switch(input){
	case 'ap':
	case 'parts': ev.data.toggle(); break;
	case 'events':
		//keys - Array of event names
		var keys=Object.keys(ev.data.getEvents()); 
		BIM.fun.log(ev.data.alias.toUpperCase()+'\n' + keys.join("\n"));
		break;	
	case 'keywords':
		var keys=['ap', 'parts', 'events', 'keywords', 'restock'];
		BIM.fun.log(ev.data.alias.toUpperCase()+'\n' + keys.join("\n"));
		break;		
	case 'restock':BIM.fun.trigger('bimRestock', [BIM.parts]); break;

	}		
};

	
__.onResourcesUpdate=function(ev, resources){

	if (typeof resources!='undefined'){
		var op$, i;
		var that=ev.data; 
		that.resources=resources;
		ev.data.cg$.controlgroup('destroy');
		ev.data.resource$.empty();
		for (i in resources){ 
			op$=$('<option></option>').text(resources[i].name).val(resources[i].url);
			ev.data.resource$.append(op$);
		}
		ev.data.wigetize(ev.data);
	}
};


	
__.onRestock=function(ev, lib, resources){
	var op$;
	var that=ev.data; 
	that.partsLib=lib;
	ev.data.cg$.controlgroup('destroy');
	ev.data.part$.empty();
	for (var key in lib){ 
		//ev.data.addItem( key, lib[key] );
		op$=$('<option></option>').text(key).val(key);
		ev.data.part$.append(op$);
	}
	ev.data.wigetize(ev.data);
};

__.onTabsactivate=function(ev, ui){
	// ev - event
	// ev.data - 'this' as passed from MakerUI
	// ui - div of tab that was just activated (got focus) in the jquery-ui tabs widget
	// ui - {}
	var myTabsGotFocus=(ui.newPanel.find('div')[0]==ev.data.div$[0]);
	//BIM.fun.log('myTabsGotFocus '+ myTabsGotFocus.toString());

	// Cannot seem to initialize babylon engine and scene without canvas visible
	// So,if MakerUI tab in focus and scene not yet initialized then do it...
	if (myTabsGotFocus && ev.data.scene==null){
		//set up mini scene for making new part
		var mui=ev.data;
		mui.engine=new babylon.Engine(mui.canvas$[0],  true);
		mui.scene=new babylon.Scene(mui.engine);
		mui.setScene(mui.scene, mui.canvas$[0]);
		mui.engine.runRenderLoop(function(){
			//give camera a little spin
			mui.scene.activeCamera.alpha += .01;
			mui.light.position=mui.cam.position;
			mui.scene.render();
		});	
		//this.scene.debugLayer.show();
	}
	
	
};
	
__.setScene=function(scene, canvas){
	this.light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 0, 0), scene);
	//var light = new babylon.HemisphericLight('hemiTop',new babylon.Vector3(20,20,20),scene);
	this.cam = new babylon.ArcRotateCamera(
		"ArcRotateCamera", //name
		1, //alpha
		0.8, //beta
		50, //radius
		new babylon.Vector3(0, 0, 0), //target
		scene);
	//cam.setTarget(new BABYLON.Vector3.Zero());
    this.cam.attachControl(canvas, false);
	//this.sample=babylon.Mesh.CreateBox('sample', 5, scene);
	
	this.triad=triad.setScene(scene);
	

	//this.sample.position=new babylon.Vector3(5,5,5);
};

__.wigetize=function(that){
	that.cg$.controlgroup({		
		'items':{
		"button":"button, input[type=text], input[type=submit]",
		"controlgroupLabel": ".ui-controlgroup-label",
		"checkboxradio": "input[type='checkbox'], input[type='radio']",
		"selectmenu": "select",
		"menu":".dropdown-items",
		"spinner": ".ui-spinner-input"},
		'direction':'vertical',
		//not effective, see last line instead
		//'select':function(ev, ui) { that.onChoosePart(ev, ui, that);}
	});
	that.part$.selectmenu({'select':function(ev, ui) {
		//BIM.fun.log('part selected');
		that.onChoosePart(ev, ui, that);
	}});
	that.resource$.selectmenu({'select':function(ev, ui) {
		that.onChooseResource(ev, ui, that);
	}});

}


	
return PartsUI;

});

