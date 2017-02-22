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

	
	project:	BIMunited
	module: 	stage
	author:	Andrew Siddeley 
	started:	27-Jan-2017
	
****************************************************************/
define(
// load dependencies...
['babylon', 'jquery'],

// then do this...
function(BABYLON, $){

// view handler methods...
var View={
	
	create:function(udata){
		return $.extend({}, view, udata);
		},

	demo:function(num){
		var that=this;
		switch(num){
			case 1: return that.create({name:'free'}); break;
			default: return that.create({name:'free'});					
		}
	},
		
	setScene:function(view){
		// bim view - babylon camera
		view.baby=new BABYLON.FreeCamera('free', view.position , window.BIM.scene);
        view.baby.setTarget(view.target);
        view.baby.attachControl(canvas, false);	
		view.baby.bim=view;
	},
	
	type:'viewFree'	
}

// view properties
var view = {
	baby:null, //babylon entity
	handler:View,
	position:new BABYLON.Vector3(0, 10,-10),
	target:new BABYLON.Vector3.Zero()
};

return View;
});