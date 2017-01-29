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
	
	
	by: 			Andrew Siddeley 
	started:	16-Jan-2017
**************************************************************/

define(

// Load dependencies...
['jquery', 'jquery-ui', 'kernel/window'],

// Then do...
function($, ui, win) {

// define a widget for a versatile part property ui control
$.widget ("bim.wProperty", {

// option defaults
options: {
	callback:function(){}, //set by text, real, point3d, etc.
	editable:false,
	idi: 'input', //id of DOM element (field) that displays the input
	idr: 'result', //id of field that displays the result
	idn: 'name', //id of field that displays the name|title
	mode: 'text', //type of partProperty eg. text, point3d, real, cell etc
	name: 'unnamed',
	undo: [],
	valu: 'hello' //value
	//valx: 'default', //value backup
},

_create:function() {
	//this.element is a reference to the DOMelement|div the widget is bound
	//this.options.name=this.element.attr("id");
	//this.options.text=this.element.text();
	var id=win.BIM.get.uid('cell');
	this.options.idi=id+'input';
	this.options.idr=id+'result';
	this.options.idn=id+'name';	
	this.options.name=id;	
	this.element.addClass('BimProp');
	this._on( this.element, {
		//dragstop:'stylingStop',
		//resizestop:'stylingStop',
		mouseenter:'_highlight', 
		mouseleave:'_highlightoff',
		contextmenu:'_contextmenu'
		//click:'_contentEdit'
	});
	this.render();
},

_contextmenu:function(event) {
	return false; //cancel other context menus
},

_destroy: function() {
	//this.element.removeClass( "savable" ).text( "" );
},

_highlight:function(event) {
	if (this.options.editable){
		//$("#"+this.options.idi).show().css({'position':'relative', 'z-index':10000, 'background':'silver'});
		$("#"+this.options.idi).show();
		$("#"+this.options.idr).hide();	
	}
},

_highlightoff:function(event) {
	if (!this.options.editable) {return;} //leave if not editable
	var v=$("#" + this.options.idi).val();
	//check if value|text has changed 
	if( v != this.options.valu) {
		//text changed so save it to the undo stack before updating it
		this.options.undo.push(this.options.valu);
		//but limit the undo to just 10 changes
		if (this.options.undo.length > 10) {this.options.undo.shift();}
		//eliminate nulls
		v=(v=='')?'--':v;
		this.options.valu=v;
		//process ie. evaluate any expressions, and update the result field		
		var result=this._process(v);
		$("#"+this.options.idr).text(result);
		//callback and return the result
		switch (this.options.mode) {
			case 'label':break; //do nothing
			case 'material':break;
			case 'point3d':this.options.callback(result);break;
			//convert result from string to real 
			case 'real':this.options.callback(parseFloat(result));break;
			case 'text':this.options.callback(result.toString());break;
		}	
		//To do, commit to database...	
		//soup.dataSave(this.options);
	}
	//cursor has left the cell so just show result field
	$("#"+this.options.idi).hide();
	$("#"+this.options.idr).show();	
},

_process: function( v ) {
	//check for and evaluate any code found in cell
	v=v.toString(); //just in case v is a real
	if (v.substr(0,1) == '=') {
		try{valu=eval(v.substr(1));}
		catch(er){v=er.toString();}
	}
	return v;
},

render: function() {	
	var that=this;
	var title="<div id='"+ that.options.idn + "' class='BimPropName' >"+that.options.name +"</div>";
	var textarea="<textarea id='"+that.options.idi + "' class='BimPropInput' "+
		"style='z-index=10001;display:none;width:100%;height:auto;'"+
		"onclick='BIM.fun.autoHeight(this)'"+
		"onkeyup='BIM.fun.autoHeight(this)'>"+
		that.options.valu.toString()+
		"</textarea>";		
	var result="<div id='"+	that.options.idr+"' class='BimPropResult'>"+
		this._process(that.options.valu)+"</div>";
	var undev='<div class="BIMcell">property not supported</div>'
	var unknown='<div class="BIMcell">material in development</div>'	
	
	switch(this.options.mode){
		case 'label':that.element.html(title + textarea + result);break;
		case 'material':that.element.html(undev);break;
		case 'point3d':that.element.html(title + textarea + result);break;
		case 'real':that.element.html(title + textarea + result);break;
		case 'text':that.element.html(title + textarea + result);break;
		default:that.element.html(unknown);		
	}

	
	//this._trigger( "refreshed", null, { text: this.options.text } );
},

result: function(){
	//return this._process(this.options.text);
},

_setOption: function( key, valu ) {
   //if ( key === "valu" ) { valu = this._checkValu( valu );  }
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

// part accessor functions
label:function(title, label, callback){
	this.options.mode='label';
	this.options.callback=callback;
	this.options.editable=false;
	this.options.name=title;
	this.options.valu=label.toString();
	this.render();
},

point3d:function(title, point3d, callback){
	this.options.mode='point3d';
	this.options.callback=callback;
	this.options.editable=false;
	this.options.name=title;
	this.options.valu=point3d.toString();
	this.render();
},

real:function(title, real, callback){
	this.options.mode='real';
	this.options.callback=callback;
	this.options.editable=true;
	this.options.name=title;
	this.options.valu=real.toString();
	this.render();
},

text:function(title, text, callback){
	this.options.mode='text';
	this.options.callback=callback;
	this.options.editable=true;
	this.options.name=title;
	this.options.valu=text;
	this.render();
}


}); //end of widget
}); //end of define

