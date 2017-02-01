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
		
	module: 	widgetCellReal
	desc: 		Defines a part property widget in jquery.    
	Load this module before creating a part property widget.  It features the following:  
	Shows a property and allows its editing when the curser enters the edit field.
	Processes and commits changes when cursor leaves the edit field.
	Fields are name, edit and result.
	values in the edit field that begin with '=' are treated as expressions and processed similar
	to a cell in a spreadsheet.
	This work is a continuation of soup cell widget.
	
	usage:	$( DOMelement ).wCellReal({name:'radius', valu:2.1});
	
	
	by: 		Andrew Siddeley 
	started:	1-Feb-2017
**************************************************************/

define(

// Load dependencies...
['jquery', 'jquery-ui', 'kernel/widgetCell'],

// Then do...
function($, ui, wc) {

// wCellReal inherits wCell
$.widget ("bim.wCellreal", $.bim.wCell , {

_create:function() {
	this._super();
},

_contextmenu:function(event) {
	return false; //cancel other context menus
},

_destroy: function() {
	//this.element.removeClass( "savable" ).text( "" );
},

_highlight:function(event) {
	$("#"+this.options.idi).show();
	$("#"+this.options.idr).hide();	

},

_highlightoff:function(event) {
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
		this.options.callback(result.toString());
		//To do, commit to database...	
	}
	//cursor has left the cell so just show result field
	$("#"+this.options.idi).hide();
	$("#"+this.options.idr).show();	
},

render: function() {	
	var that=this;
	var title="<div id='"+ that.options.idn + "' class='BimCellName' >"+that.options.name +"</div>";
	var textarea="<textarea id='"+that.options.idi + "' class='BimCellInput' "+
		"style='z-index=10001;display:none;width:100%;height:auto;color=cyan'"+
		"onclick='BIM.fun.autoHeight(this)'"+
		"onkeyup='BIM.fun.autoHeight(this)'>"+
		that.options.valu.toString()+
		"</textarea>";		
	var result="<div id='"+	that.options.idr+"' class='BimCellResult'>"+
		this._process(that.options.valu)+"</div>";
	that.element.html(title + textarea + result);
	//this._trigger( "refreshed", null, { text: this.options.text } );
},

_setOption: function( key, valu ) { this._super( key, valu );},

_setOptions: function( options ) {this._super( options );},	

// API accessor functions
vnc:function(valu, name, callback){
	this._super(valu,name,callback);
}

}); //end of widget
}); //end of define

