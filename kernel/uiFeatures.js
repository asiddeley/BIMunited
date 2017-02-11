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

	project:	BIM
	module: 	uiPartProperties
	desc: 
	usage:
	by: 		Andrew Siddeley 
	started:	19-Jan-2017
	
*/


define(
// load dependencies...
// loading widgetCell defines wCell widget in jquery.
['jquery', 'kernel/widgetCell'],

// then do...
function($, wc){

var UiFeatures={
	
	display:function(part){
		//reset counters and hide cells
		this.xCell=0;
		this.wCell.forEach(function(item){item.hide();});
		this.xCellreal=0;
		this.wCellreal.forEach(function(item){item.hide();});
		this.xCellxyz=0;
		this.wCellxyz.forEach(function(item){item.hide();});
	
		//call each of the part's feature accessor functions, each will call
		//this propertyBoard via functions below, info, real, text, xyz, etc
		var pp=part.handler.getFeatures();
		//BIM.fun.log('properties...');
		for (var k in pp){pp[k](part, this);}
	},
		
	element:null,
	
	featureShow:function(part){
		//reset counters and hide widgets
		this.wCellreset();
		
		//var feature={name:'n', valu:this.x, type:'t', onChange:function(part, revisedvalu){}};
		var ff=part.handler.getFeatures();
		var f, i;
		for (i in ff){
			f=ff[i];
			
			switch(f.type){
				case('point3d'):
					wCellinit(f.name, f.valu, f.onChange);
					break;
				case('real'):
					wCellinit(f.name, f.valu, f.onChange);
					break;
				case('text'):
					wCellinit(f.name, f.valu, f.onChange);
					break;
				default:
					wCellinit(f.name, f.valu, f.onChange);
			}		
		}		
	},
	
	wCellGet:function(){},
	
	init:function(element){
		this.element=element;
		return this; //to allow chaining
	},
	
	/////////////////
	//API functions
	

	point3d:function(name, valu, callback){
		//var p=this.aProperty[this.count++];
		//$(p).wProperty('point3d', title, point3d.toString(), callback).show();
	},
	
	

	real:function(name, valu, callback){
		//var p=this.aProperty[this.count++];
		//$(p).wProperty('text', title, real.toString(), callback).show();
		if (this.xCellreal>=this.wCellreal.length){
			var $div=$('<div></div>');
			$(this.element).append($div);
			$div.wCell().hide();
			this.wCellreal.push($div); 
		}
		$(this.wCellreal[this.xCellreal++]).wCell('vnc', valu, name, callback).show();			
	},
		
	text:function(name, valu, callback){	
		//var p=this.aProperty[this.count++];
		//$(p).wProperty('text', title, text, callback).show();
		if (this.xCell>=this.wCell.length){
			var div=$('<div></div>');
			$(this.element).append(div);
			div.wCell( ).hide();
			this.wCell.push(div); 
		}
		//Call widget method 'vnc', passing valu, name & callback to set and show the cell 
		//see jquery-ui widget factory documentation
		$(this.wCell[this.xCell++]).wCell('vnc', valu, name, callback).show();			
	},
	
	xyz:function(name, valu, callback){
		//var p=this.aProperty[this.count++];
		//$(p).wProperty('point3d', title, point3d.toString(), callback).show();
	},
	
	////////////////////////
	//widgets for feature editing
	
	//text editor
	wCell:[], //storage
	wCelli:0, //index
	wCellinit:function(name, valu, onChange){
		if (this.wCelli>=this.wCell.length){
			var div=$('<div></div>');
			$(this.element).append(div);
			div.wCell( ).hide();
			this.wCell.push(div);
		};
		$(this.wCell[this.wCelli++]).wCell('vnc', valu, name, onChange).show();	
	},
	wCellreset:function(){
		this.wCelli=0;
		this.wCell.forEach(function(item){item.hide();});
	},
	
	//float editor
	
	wCellreal:[], //float
	wCellxyz:[], //x,y,z coordinate

	
	//indexers
	xCell:0,
	xCellreal:0,
	xCellxyz:0 //x,y,z coordinate


};

return UiFeatures;

});


