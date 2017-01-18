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
		
	module: 	uiCell
	desc: 		Defines a cell widget in jquery.  Load this module before create a cell widget.  
	A cell shows a text and allows its editing when the curser enters it and commits changes when cursor leaves.

	usage:	$( DOMelement ).cell(); // To create a cell widget on the provided DOM element

	by: 			Andrew Siddeley 
	started:	16-Jan-2017
	
*/

define(

// Load dependencies...
['jquery', 'jquery-ui'],

// Then do...
function($, ui) {

$.widget ("bim.dashboard", {
	
    options: {
		name: 'unnamed',
		text: 'default',
		xtxt: 'default', //existing text
		undo: [],
		idi: 'default',
		idr: 'default',
		idn: 'default'
	},
	
	_create:function() {
		this.options.name=this.element.attr("id");
		this.options.text=this.element.text();
		this._on( this.element, {
			//dragstop:'stylingStop',
			//resizestop:'stylingStop',
			//mouseenter:'_highlight', 
			//mouseleave:'_highlightoff' ,
			//contextmenu:'_contextmenu'
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
	
	render: function() {		
		//wrap text so it can be saved & edited
		//console.log('cell foreachItem:'+this.element.foreachItem); //undefined
		this.element.html(
			"<p id='"+ this.options.idn + "' style='display:none;' >"+ this.options.name +"</p>"+
			"<textarea id='"+this.options.idi+"' type='text' style='z-index=10001; "+
			"display:none;width:100%;height:auto;'"+
			"onclick='BIM.uiAutoHeight(this)' onkeyup='BIM.uiAutoHeight(this)' >"+
			this.options.text+
			"</textarea>"+
			"<p id='"+this.options.idr+"' class='cellresult'>"+
			this._process(this.options.text)+
			"</p>"	
		);
		//this._trigger( "refreshed", null, { text: this.options.text } );
    },
	
	result: function(){
		//return this._process(this.options.text);
	},
	
    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) {
        this._super( options );
    },	
	
	
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
	}

});

});

