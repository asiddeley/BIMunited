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
var TriAxis=require('handles/Triaxis');
var FC=require('features/FC');
var ChooserFC=require('features/ChooserFC');
//var voxelite=require('handlers/Voxelite'); //default

var PartsUI=function(board, title){
	// Inherit from UI
	UI.call(this, board, title); 

	var that=this;
	this.alias='Part';
	this.scene=null;
	this.fui=new FeaturesUI(null, 'Features of New Part', {ignoreInput:true});

	//CSS tip - container height must be explicitly set for content height to work
	this.canvas$=$('<canvas></canvas>').css(
		{'max-width':'49%', 'height':'100%', 'float':'right'}
	);
	
	this.ok$=$('<button>ADD (to Model)</button>').on('click', this, this.addPart);
	this.ok$.button().addClass('ui-controlgroup-label');
	this.btnrow$=$('<div></div>').addClass('bimFC1');
	this.btnrow$.append(this.ok$);
	
	this.column$=$('<span></span>').css({
		'display':'inline-block',
		'vertical-align':'top',
		'width':'50%'
	});
	this.column$.append(this.btnrow$);
	
	this.card$=$('<div></div>').addClass('bimFC1').height(125);
	this.card$.append(this.column$, this.canvas$);
	this.div$.append(this.card$, this.fui.div$);

	this.partChoices=Object.keys(BIM.parts); 
	this.partName=this.partChoices[0]; //1st item in list is default part
	this.partHandle=BIM.parts[this.partName];
	this.partDesc=this.partHandle.desc;
	this.resource=null; //{label:arch, url:''...}
	this.resourceChoices=Object.keys(BIM.resources);
	this.resourceName=this.resourceChoices[0];
	
	////////////////////////////////////////////////////
	this.partDescFC=new FC(this.column$, {
		//This feature should answer to restock event!!
		alias:null, //Description
		clan:'bimFC1', 
		control:FC,
		prop:this.partDesc, 
		propToBe:null,
		propUpdate:function(propToBe){ /*Read-only so don't do or return anything*/},
		setScene:function(scene, mesh){}
	});
	this.partDescFC.start();	
	
	/////////////////////////////////////
	this.partFC=new ChooserFC(this.column$, {
		alias:'part ',
		choices:that.partChoices,
		clan:'bimFC1',
		//control:ChooserFC,
		prop:that.partName,
		//prop.this.bimHandler,
		propToBe:'TBD from Choices',
		propUpdate:function(label){
			that.partHandle=BIM.parts[label]; //set to chosen part handler
			that.buildPart();
		}		
	});
	this.partFC.start();
	
	///////////////////////////////////
	this.resourceFC=new ChooserFC(this.column$,{
		alias:'library',
		clan:'bimFC1',
		control:ChooserFC,
		choices:that.resourceChoices,
		prop:that.resourceName,
		propToBe:'TBD from Choices',
		propUpdate:function(label){
			that.resource=BIM.resources[label];
			//TO DO
			//BIM.fun.trigger('change-parts', that.resourceName)
		}
	});
	this.resourceFC.start();
	
	//this.part and this.scene initialized when tab gets focus in tabsactivate(),
	//cannot do it earlier since this.scene needs this.canvas to be showing
	this.part=null;
	this.scene=null;
	
	return this;
};

// Inherit the UI prototype
PartsUI.prototype=Object.create(UI.prototype);
PartsUI.prototype.constructor=PartsUI;
var __=PartsUI.prototype;

__.addPart=function(ev){
	//BIM.scene.addMesh(ev.data.sample); //no effect, needs work
	//What about material and other dependencies?
	var newpart=ev.data.partHandle.setScene(BIM.scene);
	if (ev.data.part!=null){
		//match sample features to new part
		FeaturesUI.prototype.matchAll(ev.data.part, newpart);
	}
	//refresh sample part
	ev.data.buildPart();	
};

__.buildPart=function(){
	//var that=this;
	if (this.part !=null) {this.part.dispose();} //remake sample
	//that.bimHandler=BIM.parts[label]; //set to chosen part handler
	this.part=this.partHandle.setScene(this.scene);	
	//connect and show features of sample part
	this.fui.start(this.part);
};

//override
__.getEvents=function(){
	//get inherited eventHandlers, events such as 'input'
	var eh=UI.prototype.getEvents.call(this);

	return eh.concat([
		{name:'featurechange', data:this, handler:this.onFeatureChange },
		{name:'restock', data:this, handler:this.onRestock },
		{name:'resourcesupdate', data:this, handler:this.onResourcesUpdate },
		//{name:'tabsactivate', data:this, handler:this.onTabsactivate }
	]);
};

//override
__.getInputHandlers=function(){
	//get inherited inputHandlers, commands such as 'events' & 'keywords'
	var ih=UI.prototype.getInputHandlers.call(this);
	
	//commands or inputHandlers for partsUI...
	return ih.concat([{
		inputs:['parts-add', 'pa'], 
		desc:'Adds new part to the scene',
		handler:function(ev){ev.data.addPart(ev);}
	},{
		inputs:['parts-ui', 'pu'], 
		desc:'Brings up/down the parts dialog box and tab',
		handler:function(ev){ev.data.toggle(); return false;}
	},{
		inputs:['restock'],
		desc:'Refreshes the parts library',
		handler:function(){BIM.fun.trigger('restock', [BIM.parts]);}
	}]);
};


__.onChooseResource=function(ev, ui, that){
	//TO DO
};

__.onFeatureChange=function(ev, feature){


};

//override not necessary. Code for input handlers is in getKeywords()
//__.onInput=function(ev, input){ };

	
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

//override
__.onActiveUI=function(ev, activeUI){
	
	//call prototype even though it does nothing
	UI.prototype.onActiveUI.call(this, ev, activeUI); 
	
	if (ev.data==activeUI){
		//this ui has got focus
		if (ev.data.scene==null){
			//set up mini scene for making new part
			var mui=ev.data;
			mui.engine=new babylon.Engine(mui.canvas$[0],  true);
			mui.scene=new babylon.Scene(mui.engine);
			//initialize sample part
			mui.part=mui.partHandle.setScene(mui.scene);
			mui.fui.start(mui.part);
			
			mui.setScene(mui.scene, mui.canvas$[0]);
			mui.engine.runRenderLoop(function(){
				//give camera a little spin
				mui.scene.activeCamera.alpha += .01;
				mui.light.position=mui.cam.position;
				mui.scene.render();
			});	
			//this.scene.debugLayer.show();		
		}
		
		//attach mouse handlers
		//console.log(ui.alias +' got control');
	} else {
		//detach mouse handlers
		//console.log(ui.alias +' lost control');
	}

};


/*
//override
__.onTabsactivate=function(ev, ui){
	// ev - event
	// ev.data - 'this' as passed from PartsUI
	// ui - div of tab that was just activated (got focus) in the jquery-ui tabs widget
	// ui - {}
	
	//call prototype first.  executes all other onTabsactivateother
	UI.prototype.onTabsactivate.call(this, ev, ui);

	var myTabsGotFocus=(ui.newPanel.find('div')[0]==ev.data.div$[0]);
	//BIM.fun.log('myTabsGotFocus '+ myTabsGotFocus.toString());

	// Cannot seem to initialize babylon engine and scene without canvas visible
	// So if PartsUI tab in focus and scene not yet initialized then do it...
	if (myTabsGotFocus && ev.data.scene==null){
		//set up mini scene for making new part
		var mui=ev.data;
		mui.engine=new babylon.Engine(mui.canvas$[0],  true);
		mui.scene=new babylon.Scene(mui.engine);
		//initialize sample part
		mui.part=mui.partHandle.setScene(mui.scene);
		mui.fui.start(mui.part);
		
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
*/
	
__.setScene=function(scene, canvas){

	//meant to be run the first time onTabsactivate to initiate the sample scene

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
	
	this.triAxis=new TriAxis();
	this.triAxis.setScene(scene);

	//this.sample.position=new babylon.Vector3(5,5,5);
};
	
return PartsUI;

});

