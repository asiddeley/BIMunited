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
	module: 	PokerUI
	desc: 
	author:		Andrew Siddeley 
	started:	6-May-2017
	
*/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

var $=require('jquery');
var babylon=require('babylon');
var UI=require('united/UI');
var ChooserFED=require('features/chooserFED');
var TextFED=require('features/textFED');

var PokerUI=function(board, title){
	//inherit UI constructor
	UI.call(this, board, title); 
		
	this.alias='Poke';

	//pokemode - which reaction to call when a mesh is picked	
	this.pokeMode="show reactions";
	this.pokeModeFED=new ChooserFED(this.div$, {
		label:'pick mode',
		valu:this.pokeMode,
		choices:[
			{label:'do-1st-reaction', 
			onChoose:function(ev){ return 'do-1st-reaction';}},
			{label:'do-2nd-reaction', 
			onChoose:function(ev){ return'do-2nd-reaction';}},
			{label:'choose-reaction', 
			onChoose:function(ev){ return'choose-reaction';}}			
		],
		onValuChange:function(ev, rv){}
	});
	this.pokeModeFED.start();

	//this.div$.append(this.pokeModeFED.div$);

	return this;
}
//inherit UI prototype
PokerUI.prototype=Object.create(UI.prototype);
PokerUI.prototype.constructor=PokerUI;
var __=PokerUI.prototype; //define __ as shortcut

	
//called by UI when ui's created to register events and callbacks
__.getEvents=function(){
	return [
		//{name:'bimFeatureOK', data:this, handler:this.onFeatureOK },
		{name:'bimInput', data:this, handler:this.onInput },
		//{name:'tabsactivate', data:this, handler:this.onTabsactivate }
	];
}
	
//called by BIM.board when ui's created, may be used for input autocomplete
//called by onInput() below
__.getKeywords=function(){
	//this.keywords defined here because it can't be defined until BIM.ui.picker is
	if (this.keywords==null){ this.keywords=[
		{keywords:['poke','pk'], 
			handler:function(){
				//BIM.fun.log('Poke function TBD');
				this.toggle();
			},
			help:'show/hide the poke dialog'}, 
		{keywords:['close','pokex'], 
			handler:function(){
				//BIM.ui.uiPicker.div$.dialog('close');
				BIM.fun.log('close poke WIP');
			},
			help:'close poke TBD'
		}
	];}
	return this.keywords;
}
	
//called by ui.blackboard when there is BIM user input
__.onInput=function(ev, input){ 
	//beware of using 'this' inside an eventhandler function!
	//because 'this' will refer to the event caller's context, not uiPicker
	switch (input) {
		case 'pick':
		case 'pp':  
			//BIM.ui.uiPicker.toggle(); 
			ev.data.start();
			break;
		case 'ppw': BIM.ui.picker.wipe(); break;
		case 'ppx':	BIM.ui.picker.div$.dialog('close');
	};		
}


//override
__.toggle=function(){
	UI.prototype.toggle.call(this);	
};


__.wipe=function(){
	this.picks=[];
	this.stickerRegen();
	//for chaining
	return this; 
}	

return PokerUI;

});

