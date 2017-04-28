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
	module: 	PartsUI
	by: 		Andrew Siddeley 
	started:	16-Feb-2017
	
*/


define(
// load dependencies...
['jquery', 'jquery-ui', 'babylon', 'united/UI', 'united/FeaturesUI', 'parts/Triad' ],

// then do...
function($, $$, babylon, UI, FeaturesUI, triad ){

var MakerUI=function(board, title){
	// Inherit from UI, call super constructor
	UI.call(this, board, title); 

	//options for controlgroup() jquery-ui widget 
	var that=this;
	this.cg$options={		
		'items':{
		"button":"button, input[type=text], input[type=submit]",
		"controlgroupLabel": ".ui-controlgroup-label",
		"checkboxradio": "input[type='checkbox'], input[type='radio']",
		"selectmenu": "select",
		"menu":".dropdown-items",
		"spinner": ".ui-spinner-input"},
		'direction':'vertical',
		'select':function(ev, ui) { that.onChoosePart(ev, ui, that);}
	};

	//options for selectmenu() jquery-ui widget

	this.scene=null;
	this.fui=new FeaturesUI(null, 'Features of New Part', false);
	this.canvas$=$('<canvas></canvas>').css({'width':'100px', 'height':'100px'});
	this.ok$=$('<button>Make</button>').on('click', function(ev){
		BIM.fun.log('Part to be made and added to scene');
		//get chosen part handler
		//eval creater function fn, and set cMesh to is (current Mesh).
		////BIM.get.cMesh(fn());
		//message to uiFeatures to expose new mesh features
		////BIM.input('_meshAdded');
	});
	this.cg$=$('<div></div>').css({'display':'inline-block', 'vertical-align':'top', 'width':'200px'});
	this.desc$=$('<div></div>').addClass('ui-controlgroup-label'); 
	
	//var that=this;
	this.sm$=$('<select></select>'); 
	//this.sm$.on('select', function(ev, ui) { this.onChoosePart(ev, ui, that);} );
	this.cg$.append(this.sm$, this.desc$, this.ok$);
	this.cg$.controlgroup(this.cg$options);
	//this.sm$.selectmenu({'select':function(ev, ui) { this.onChoosePart(ev, ui, that);}});

	this.desc$.text('Choose a part, edit and add to model.');
	this.div$.append(this.canvas$, this.cg$,  this.fui.div$);

	//For setup of sample canvas/scene, see onTabsactivate below.
	
	BIM.fun.trigger('bimRestock', [BIM.partsLib]);

	return this;
};

// Inherit the UI prototype
MakerUI.prototype=Object.create(UI.prototype);
MakerUI.prototype.constructor=MakerUI;
var __=MakerUI.prototype;

__.getEvents=function(){
	return {
		bimInput:{name:'bimInput', data:this, handler:this.onInput },
		bimRestock:{name:'bimRestock', data:this, handler:this.onRestock },
		tabsactivate:{name:'tabsactivate', data:this, handler:this.onTabsactivate }
	};
};

__.onChoosePart=function(ev, ui, that){
	//that - makerUI
	//this - <select></select> 
	//ev - event
	//ui - selected item or one of <option></option> tags, see jauery-ui docs
	//ui.item - {element:{value:'somestring', label:'somestring', }}

	//BIM.fun.log(JSON.stringify(ui.item));
	BIM.fun.log('To make:'+ui.item.label);
	if (typeof that.sample !='undefined') that.sample.dispose(); //remake sample
	var bimHandler=that.partsLib[ui.item.label];
	that.sample=bimHandler.setScene(that.scene);	
	that.desc$.text(that.sample.bimHandler.desc);	
	//connect and show features of sample
	that.fui.start(that.sample);
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
	case 'restock':BIM.fun.trigger('bimRestock', [BIM.partsLib]); break;

	}		
};
	
__.onRestock=function(ev, lib){
	var op$;
	var that=ev.data; // AKA this
	that.partsLib=lib;
	//ev.data.sm$.selectmenu('destroy');
	ev.data.cg$.controlgroup('destroy');
	ev.data.sm$.empty();
	
	for (var key in lib){ 
		//ev.data.addItem( key, lib[key] );
		op$=$('<option></option>').text(key).val(key);
		ev.data.sm$.append(op$);
	}		
	//ev.data.sm$.selectmenu(	{'direction':'vertical', 'select':function(ev, ui) { that.onChoosePart(ev, ui, that);}	});
	that.cg$.controlgroup(that.cg$options);
	that.sm$.selectmenu({'select':function(ev, ui) { that.onChoosePart(ev, ui, that);}});
};

__.onTabsactivate=function(ev, ui){
	// ev - event
	// ev.data - 'this' passed from MakerUI
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
			//mui.scene.activeCamera.alpha += .01;
			mui.scene.render();
		});	
		//this.scene.debugLayer.show();
	}
};
	
__.setScene=function(scene, canvas){

	var light = new babylon.HemisphericLight(
		'hemiTop', 
		new babylon.Vector3(10,10,10),
		scene);
	var cam = new babylon.ArcRotateCamera(
		"ArcRotateCamera", //name
		1, //alpha
		0.8, //beta
		10, //radius
		new babylon.Vector3(0, 0, 0), //target
		scene);
	//cam.setTarget(new BABYLON.Vector3.Zero());
    cam.attachControl(canvas, false);
	//this.sample=babylon.Mesh.CreateBox('sample', 5, scene);
	
	this.triad=triad.setScene(scene);
	

	//this.sample.position=new babylon.Vector3(5,5,5);
};
	
return MakerUI;

});

