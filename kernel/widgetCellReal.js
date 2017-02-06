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

// wCellReal widget based on (extends, inherits from...) wCell widget
$.widget ("bim.wCellreal", $.bim.wCell , {

_create:function() {
	this._super(); //calls wCell create 
	this._off( this.element, 'mouseenter mouseleave'); 	//remove wCell behavior
	this._on( this.element, {contextmenu:'_contextmenu',	click:'reveal',	});
},

cancel:function(){this._super();},
commit:function(){this._super();},

//cancel other context menus
contextmenu:function(event) {return false;},

option:function(key, valu){ 
	if(typeof valu == 'undefined'){
		return this._super(key); 
	} else {
		return this._super(key,valu);
	}
},

//called from ok button - see render()
ok:function() {
	this.revealoff;
	alert('commit');
},

reveal:function(){this._super(); },

revealoff:function(){this._super(); },

render: function() {	
	//window.BIM.fun.log(this.option('idn'));

	var title="<div id='"+ this.option('idn') + "' class='BimCellName' >"+this.option('name') +"</div>";
	var input="<textarea id='"+this.option('idi') + "' class='BimCellinput' "+
		"style='z-index=10001;display:none;width:100%;height:auto;'  "+
		"onclick='BIM.fun.autoHeight(this)'"+
		"onkeyup='BIM.fun.autoHeight(this)'>"+
		this.option('valu').toString()+
		"</textarea>";
	var result="<div id='"+	this.option('idr')+"'  class='BimCellResult'>"+this.option('valu')+"</div>";
	this.element.html(title + input + result);

	var that=this;
	var btn=$('<button>ok</button>').button().on('click', function(){ that.ok();  } );
	this.element.append(btn);
	
	//this._trigger( "refreshed", null, { text: this.options.text } );
},


_setOption: function( key, valu ) { this._super( key, valu );},

_setOptions: function( options ) {this._super( options );},	

// API accessor functions
//access methods in wCellreal widget thus: $(#uid).wCellreal('methodname', 'arg1', 'arg2')

vnc:function(valu, name, callback){	this._super(valu,name,callback); }


}); //end of widget
}); //end of define

