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

	
	project:	BIMsoup
	desc:		(B)uilding (I)nformation (M)odel (s)cript (o)riented (u)tility (p)ackage 
		
	module: 	TCM texture colour material
	desc: 
	usage:

	by: 		Andrew Siddeley 
	started:	28-Jan-2016
	
****************************************************************/
define(
// load dependencies...
['babylon','jquery'],

// then do this...
function(BABYLON, $){

// handlers...
var TCM={
	
	//creater - returns a single tcm element
	create:function(udata){return $.extend({}, tcm, udata);},
	
	creaters:{		
	
	},
	
	colour:{
		black:{nameColour:'black', cr:0, cg:0, cb:0},
		white:{nameColour:'white', cr:255, cg:255, cb:255},
		red:{nameColour:'red', cr:255, cg:0, cb:0},
		lime:{nameColour:'lime', cr:0, cg:255, cb:0},
		blue:{nameColour:'blue', cr:0, cg:0, cb:255},
		yellow:{nameColour:'yellow', cr:255, cg:255, cb:0},
		cyan:{nameColour:'cyan', cr:0, cg:255, cb:255},
		magenta:{nameColour:'magenta', cr:255, cg:0, cb:255},
		sivler:{nameColour:'silver', cr:192, cg:192, cb:192},
		gray:{nameColour:'gray', cr:128, cg:128, cb:128},
		maroon:{nameColour:'maroon', cr:128, cg:0, cb:0},
		olive:{nameColour:'olive', cr:128, cg:128, cb:0},
		green:{nameColour:'green', cr:0, cg:128, cb:0},
		purple:{nameColour:'purple', cr:128, cg:0, cb:128},
		teal:{nameColour:'teal', cr:0, cg:128, cb:128},
		//// fancy rgb colours
		darkRed:{nameColour:'darkRed', cr:139, cg:0, cb:0},
		brown:{nameColour:'brown', cr:165, cg:42, cb:42},
		fireBrick:{nameColour:'fireBrick', cr:178, cg:34, cb:34},
		crimson:{nameColour:'crimson', cr:220, cg:20, cb:60},
		tomato:{nameColour:'tomato', cr:255, cg:99, cb:71},	
		coral:{nameColour:'coral', cr:255, cg:127, cb:80}	
	},
	
	//demonstrators
	demo:function(num){
		var that=this;
		switch(num){
			//returns a tcm with a random colour
			case 1: 
				var r=Math.round(Math.random()*255);
				var g=Math.round(Math.random()*255);
				var b=Math.round(Math.random()*255);
				var n='colour'+r.toString()+g.toString()+b.toString();
				return that.create({cb:b, cg:g, cr:r, name:n});
			break;
			default:return that.demo1();					
		}
	},
		
	//babylon scene setter
	setScene:function(tcm){
		var name=(tcm.name==null)?tcm.nameofColour+nameofTexture:tcm.name;
		tcm.baby=new BABYLON.StandardMaterial(name, BIM.scene);
		tcm.baby.diffuseColor=new BABYLON.Color3(tcm.cr, tcm.cg, tcm.cb);
	},
	
	//standard library
	//returns a hash of preset tcm texture/colour/material elements
	stdLib:function(){var that=this; return {
		//// BIM functional colours
		maincolour:that.create({name:'maincolour', cr:255, cg:127, cb:0}), //coral
		background:that.create({name:'background', cr:0, cg:0, cb:128}), //navy
		poked:that.create({name:'poked', cr:255, cg:255, cb:0}), //yellow
		pokedoff:that.create({name:'pokedoff', cr:128, cg:128, cb:128}), //gray
		//// basic rgb colours
		black:that.create({name:'black', cr:0, cg:0, cb:0}),
		white:that.create({name:'white', cr:255, cg:255, cb:255}),
		red:that.create({name:'red', cr:255, cg:0, cb:0}),
		lime:that.create({name:'lime', cr:0, cg:255, cb:0}),
		blue:that.create({name:'blue', cr:0, cg:0, cb:255}),
		yellow:that.create({name:'yellow', cr:255, cg:255, cb:0}),
		cyan:that.create({name:'cyan', cr:0, cg:255, cb:255}),
		magenta:that.create({name:'magenta', cr:255, cg:0, cb:255}),
		sivler:that.create({name:'silver', cr:192, cg:192, cb:192}),
		gray:that.create({name:'gray', cr:128, cg:128, cb:128}),
		maroon:that.create({name:'maroon', cr:128, cg:0, cb:0}),
		olive:that.create({name:'olive', cr:128, cg:128, cb:0}),
		green:that.create({name:'green', cr:0, cg:128, cb:0}),
		purple:that.create({name:'purple', cr:128, cg:0, cb:128}),
		teal:that.create({name:'teal', cr:0, cg:128, cb:128}),
		//// fancy rgb colours
		darkRed:that.create({name:'darkRed', cr:139, cg:0, cb:0}),
		brown:that.create({name:'brown', cr:165, cg:42, cb:42}),
		fireBrick:that.create({name:'fireBrick', cr:178, cg:34, cb:34}),
		crimson:that.create({name:'crimson', cr:220, cg:20, cb:60}),
		tomato:that.create({name:'tomato', cr:255, cg:99, cb:71}),	
		coral:that.create({name:'coral', cr:255, cg:127, cb:80})	
	};},
	
	type:'tcm'
}

// properties...
var tcm={
	baby:null,
	cb:0,
	cg:0,
	cr:0,
	handler:TCM,
	name:null, //if null then the material name is the sum of colour + texture
	nameColour:'uncoloured',
	nameTexture:'untextured',
	texturefile:'',
	type:'material'	
};

return TCM;
});