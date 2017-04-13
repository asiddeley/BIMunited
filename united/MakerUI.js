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
['jquery', 'jquery-ui', 'babylon', 'united/UI', 'united/FeaturesUI' ],

// then do...
function($, $$, babylon, UI, FeaturesUI ){

var MakerUI=function(board, title){
	// Inherit from UI, call super constructor
	UI.call(this, board, title); 
	this.radioo={
		'items':{
		"button":"button, input[type=text], input[type=submit]",
		"controlgroupLabel": ".ui-controlgroup-label",
		"checkboxradio": "input[type='checkbox'], input[type='radio']",
		"selectmenu": "select",
		"menu":".dropdown-items",
		"spinner": ".ui-spinner-input"},
		'direction':'vertical'		
	};
	
	this.fui=new FeaturesUI(null, 'Features of New Part', false);
	this.head$=$('<div></div>');
	this.canvas$=$('<canvas></canvas>').css({'width':'150px', 'height':'100px', 'float':'right'});
	this.make$=$('<button>Add to model</button>').on('click', function(ev){
		BIM.fun.log('_Part made and added to scene');
		//get chosen part handler
		//eval creater function fn, and set cMesh to is (current Mesh).
		////BIM.get.cMesh(fn());
		//message to uiFeatures to expose new mesh features
		////BIM.input('_meshAdded');
	});
	this.radio$=$('<div></div>');
	this.radio$.append(this.make$);
	this.radio$.controlgroup(this.radioo);
	this.head$.append(this.radio$, this.canvas$);
	this.div$.append(this.head$, this.fui.div$);

	//set up mini scene for making new part
	this.engine=new babylon.Engine(this.canvas$[0],  true);
	this.scene=new babylon.Scene(this.engine);
	this.setScene(this.scene);	
	this.engine.runRenderLoop(function(){ this.scene.render();} );	
	
	
	//BIM.input('_restock'); 
	BIM.fun.trigger('bimRestock', [BIM.partsLib]);

	return this;
};

// Inherit the UI prototype
MakerUI.prototype=Object.create(UI.prototype);
MakerUI.prototype.constructor=MakerUI;

var PP=MakerUI.prototype;
/*
PP.addControlgroup=function(partHandler){
	var cg$=$('<div></div>').addClass('ui-widget-content');
	this.div$.append(cg$);
	//main creater
	this.addPartCreaterButton(cg$, partHandler.bimType, partHandler.create);
	//alternate creaters
	for (var n in partHandler.creaters){this.addPartCreaterButton(cg$, n, partHandler.creaters[n]);};
	//wigetize cg$, google jquery-ui controlgroup for documentation
	//items indicates what widgets to apply
	cg$.controlgroup({items:{button:'button'}});
};
	
PP.addPartCreaterButton=function(cg$, n, fn){
	//n - name of part
	//fn - creater function of part
	//cg$ - jquery wrapped element to contain buttons
	var onClick=function(ev){ 
		//eval creater function fn, and set cMesh to is (current Mesh).
		BIM.get.cMesh(fn());
		//message to uiFeatures to expose new mesh features
		BIM.input('_meshAdded');
	};
	var b$=$('<button></button>').addClass('ui-widget-content').text(n);
	b$.on('click', onClick);
	cg$.prepend(b$);
};
*/

PP.addRadioButton=function( key, partHandler ){
/*
<div class="controlgroup">
	<label for="transmission-standard">Standard</label>
	<input type="radio" name="transmission" id="transmission-standard">
	...
*/
	var that=this;
	//var n=partHandler.bimType;	
	var n=key;
	var lab$=$('<label></label>').attr({'for':key}).text(n);
	var inp$=$('<input type="radio">').attr({'name':n, 'id':key});
	inp$.on('click', this, function(ev){ 
		//BIM.fun.log( 'radio clicked - '+$(this).attr('id') );
		//refresh canvas and feature
		//makerUI.scene();
		//eval creater function fn, and set cMesh to is (current Mesh).
		////BIM.get.cMesh(fn());
		//message to uiFeatures to expose new mesh features
		////BIM.input('_meshAdded');
	});
	this.radio$.append(lab$, inp$);
};
	
// override UI
PP.getEvents=function(){
	return { 
		bimInput:{name:'bimInput',  data:this, handler:this.onInput },
		bimRestock:{name:'bimRestock', data:this, handler:this.onRestock }
	};
};

//inherited from UI but overriden
PP.onInput=function(ev, input){ 
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
		var keys=['ap', 'parts', 'events', 'keywords', '_restock'];
		BIM.fun.log(ev.data.alias.toUpperCase()+'\n' + keys.join("\n"));
		break;		
	case '_restock':	BIM.fun.trigger('bimRestock', [BIM.partsLib]); break;
	}		
};
	
PP.onRestock=function(ev, lib){
	//for (var i in lib){ev.data.addControlgroup(lib[i]);}		
	ev.data.radio$.controlgroup('destroy');
	for (var key in lib){ ev.data.addRadioButton( key, lib[key] );}		
	ev.data.radio$.controlgroup(ev.data.radioo);
};
	
PP.setScene=function(scene){
	var light=new BABYLON.HemisphericLight('hemiTop', new BABYLON.Vector3(0,0,0), scene);
	var cam = new BABYLON.ArcRotateCamera(
		"ArcRotateCamera", //name
		1, //alpha
		0.8, //beta
		100, //radius
		new BABYLON.Vector3(0, 0, 0), //target
		scene
	);
	
	
}	
	
	
	
return MakerUI;

});

