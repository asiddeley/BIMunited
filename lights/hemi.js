/************************************************************ license:

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

	
	project:	BIMsoup
	module: 	lightHemi
	author:	Andrew Siddeley 
	started:	27-Jan-2017
	
****************************************************************/
define(
// load dependencies...
['babylon', 'jquery'],

// then do this...
function(BABYLON, $){

// Light methods...
var Light={
	
	create:function(udata){
		return $.extend({}, light, udata);
		},

	demo:function(num){
		var that=this;
		switch(num){
			case 1: return that.create({name:'hemi'}); break;
			default: return that.create({name:'hemi'});					
		}
	},

	setScene:function(light){
		light.baby=new BABYLON.HemisphericLight('hemiTop', light.position, BIM.scene);
		light.baby.bim=light;
		new BABYLON.HemisphericLight('hemiBottom', new BABYLON.Vector3(10,10,10), BIM.scene);
	},
	
	type:'lightHemi'	
}

// light properties
var light = {
	baby:null, //babylon entity
	handler:Light,
	position:new BABYLON.Vector3(0,0,0)
};

return Light;
});