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
		
	module: 	widgetCelltext
	desc: 		
	
	
	by: 		Andrew Siddeley 
	started:	4-Feb-2017
**************************************************************/

define(

// Load dependencies...
['jquery', 'jquery-ui', 'widgetCell'],

// Then do...
function($, ui, wc) {

// define a widget for a versatile part property ui control
$.widget ("bim.wCelltext", $.bim.wCell, {
_create:function() {

	this._super();
	
	var $text=$('<textarea></textarea>').addClass('BimCelltextarea');

	var autoheight=function(ev){
		//element $input is passed as ev.data
		ev.data.css('height','auto');
		var h=ev.data[0].scrollHeight+5;
		ev.data.css('height', h);
		//BIM.fun.log('autoheight'+h);
	};
	
	$text.on("click keyup", $text, autoheight);
	this.option('$edit').append($text);
	this.option('$text', $text);

},

//cancel DOM default context menu Ie. right click floating menu
contextmenu:function(event) {return false; },

cancel:function(){this.reviseoff();},

commit:function() {this._super();},

ok:function(){this._super();},

option:function(key, valu){ 
	if(typeof valu == 'undefined'){
		return this._super(key); 
	} else {
		return this._super(key,valu);
	}
},

revise:function(event) { this._super(event);},
	
reviseoff:function(event){ this._super(event);},

revisedvalu:function(){ 
	var that=this;
	var rv=this.option('$text').val();
	if (rv.substr(0,1) == '=') {
		try{rv=eval(rv.substr(1)).toString();}
		catch(er){
			BIM.fun.log('expression error: ' + er.toString());
			rv=that.option('valu');
		}
	}
	return rv;
},

_setOption: function( key, valu ) { this._super( key, valu );},

_setOptions: function( options ) { this._super( options );},	

undo:function(){ this._super();},

undopush:function(valu){this._super();},

vnc:function(valu, name, callback){this._super();},


}); //end of widget
}); //end of define

