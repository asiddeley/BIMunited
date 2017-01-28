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
		
	module: 	Attribute
	desc: 
	usage:

	by: 		Andrew Siddeley 
	started:	28-Jan-2017
	
****************************************************************/
define(

// load dependencies...
['babylon', 'jquery', 'kernel/part'],

// then do...
function(babylon, $, Part){
	
// Construct info handler - extends Part handler
var Attribute = $.extend( {}, Part, {
	
	//creater - constructs and returns a new attribute inherits from part 
	create:function(userData){ return $.extend( {}, Part.create(), attribute, userData ); },
 	
	//demonstrators
	demo:function(num){ 
		var that=this;
		switch(num){
			case 1: return that.projectInfo(); break;
			default: return that.projectInfo();			
		}
	},	
	
	projectInfo:function(){
		this.create({
			address:'unknown',
			discpline:'arch',	
			name:'unnamed',
			projectNumber:'xxxx',
			radius:1;
		});		
	},

	getProperties:function(attribute){
		var that=this;
		//todo find properties in attribute return to expose them for editing...
		return $.extend(Part.getProperties(),{
			'radius':that.radius
		});
	},

	// babylon scene constructor
	setScene:function(attribute){
		attribute.baby = babylon.Mesh.CreateSphere(	
			attribute.name, 
			attribute.segment,
			attribute.radius*2,
			win.BIM.scene,
			attribute.updatable,
			attribute.faceMode);
			
		// note two way relation between BIM part and babylon element 
		attribute.baby.bim=attribute;
		//set position
		attribute.baby.position=attribute.position;
	},
	
	type:'attribute'

}); 

//attribute properties
var attribute={
	handler:Attribute
};

return Attribute;

});