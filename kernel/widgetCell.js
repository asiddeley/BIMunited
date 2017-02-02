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
	desc:		
		
	module: 	widgetPartProperty
	desc: 		Defines a part property widget in jquery.    
	Load this module before creating a part property widget.  It features the following:  
	Shows a property and allows its editing when the curser enters the edit field.
	Processes and commits changes when cursor leaves the edit field.
	Fields are name, edit and result.
	values in the edit field that begin with '=' are treated as expressions and processed similar
	to a cell in a spreadsheet.
	This work is a continuation of soup cell widget.
	
	usage:	$( DOMelement ).wProperty({name:'radius', valu:2.1});
	
	
	by: 		Andrew Siddeley 
	started:	29-Jan-2017
**************************************************************/

define(

// Load dependencies...
['jquery', 'jquery-ui'],

// Then do...
function($, ui) {

// define a cell widget 
$.widget ("bim.wCell", {

/* 
// option defaults
options: {
	callback:function(){}, //set by text, real, point3d, etc.
	editable:false,
	idi: 'input', //id of DOM element (field) that displays the input
	idn: 'name', //id of field that displays the name|title
	idr: 'result', //id of field that displays the result
	name: 'unnamed',
	undo: [],
	valu: 'hello' //value
},
*/
_create:function() {
	//this.options.name=this.element.attr("id");
	//this.options.text=this.element.text();
	
	//this.options.idi=uid+'input';
	//this.options.idr=uid+'result';	
	//this.options.idn=uid+'name';	
	//this.options.name=uid;	
	var uid=BIM.fun.unique('cell');
	this.option({
		callback:function(){}, //set by text, real, point3d, etc.
		id:uid,
		idi:uid+'input',
		idr:uid+'result',
		idn:uid+'name',
		name: 'unnamed',
		undo: [],
		valu: 'hello' //value
	});
	
	this.element.addClass('BimCell');
	$(this.element).attr('id', uid);
	
	this._on( this.element, {
		mouseenter:'reveal', 
		mouseleave:'commit',
		contextmenu:'_contextmenu'
		//click:'reveal',
		//dragstop:'stylingStop',
		//resizestop:'stylingStop'
	});
	this.render();
},

//cancel DOM default context menu Ie. right click floating menu
_contextmenu:function(event) {return false; },

cancel:function(){this.revealoff();},

commit:function(event) {
	//if (!this.options.editable) {return;} //leave if not editable
	var v=$("#" + this.options.idi).val();
	//check if value|text has changed 
	if(v != this.options.valu) {
		//text changed so save it to the undo stack before updating it
		this.options.undo.push(this.options.valu);
		//but limit the undo to just 10 changes
		if (this.options.undo.length > 10) {this.options.undo.shift();}
		//eliminate nulls
		v=(v=='')?'--':v;
		this.options.valu=v;
		//process ie. evaluate any expressions, and update the result field		
		var result=this.process(v);
		$("#"+this.options.idr).text(result);
		//callback and return the result
		this.options.callback(result.toString());
		//To do, commit to database...	
		//soup.dataSave(this.options);
	};
	this.revealoff();
},

option:function(arg1){ return this._super(arg1); },

process:function( v ) {
	//check for and evaluate any code found in cell
	v=v.toString(); //just in case v is a real
	if (v.substr(0,1) == '=') {
		try{valu=eval(v.substr(1));}
		catch(er){v=er.toString();}
	}
	return v;
},

render: function() {
	var title="<div id='"+ this.options.idn + "' class='BimCellName' >"+this.options.name +"</div>";
	var textarea="<textarea id='"+this.options.idi + "' class='BimCellinput' "+
		"style='z-index=10001;display:none;width:100%;height:auto;'"+
		"onclick='BIM.fun.autoHeight(this)'"+
		"onkeyup='BIM.fun.autoHeight(this)'>"+
		this.options.valu.toString()+
		"</textarea>";		
	var result="<div id='"+	this.options.idr+"' class='BimCellResult'>"+
		this.process(this.options.valu)+"</div>";
		
	this.element.html(title + textarea + result);
	//this._trigger( "refreshed", null, { text: this.options.text } );
},

//reveals the edit field and hides the result
reveal:function(event) {	$("#"+this.options.idi).show();	$("#"+this.options.idr).hide();	},
revealoff:function(event){	$("#"+this.options.idi).hide();	$("#"+this.options.idr).show();	},

_setOption: function( key, valu ) {
   //if ( key === "valu" ) {valu = this._checkValu( valu );}
   this._super( key, valu );
},

_setOptions: function( options ) {this._super( options );},	


styleGet:function(c){
	//return an object with only drag properties from a given object
	return	$.extend( { }, 
		{ 'position': c['position'] },
		{ 'left': c['left'] },
		//{ 'right': c['right'] },
		{ 'top': c['top'] },
		//{ 'bottom': c['bottom'] },
		{ 'height': c['height'] },
		{ 'width': c['width'] }
	);	
},

styleRestore:function(c){
	this.element.css(this.styleGet(this.options));
},			
	
stylingStop:function(event, ui){
	//save position
	var c=window.getComputedStyle(this.element[0],null);
	this.options=$.extend(this.options, this.styleGet(c));
},

// API function to set value, name, callback and show
vnc:function(valu, name, callback){
	this.option({callback:callback, name:name,	valu:valu});
	this.render();
	this.element.show();
}


}); //end of widget
}); //end of define

