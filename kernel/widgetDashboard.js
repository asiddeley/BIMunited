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
	module: 	dashboard
	desc: 
	usage:
	by: 		Andrew Siddeley 
	started:	12-Jan-2017
	
*/


define(
// load dependencies...
['jquery', 'jquery-ui'],

// then do...
function($, $ui){
	

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
		this.options.idi=this.options.name+'input';
		this.options.idr=this.options.name+'result';
		this.options.idn=this.options.name+'name';
		//this.options=$.extend(this.options, soup.dataLoad(this.options));
		//this.styleRestore();		
		this._on( this.element, {
			dragstop:'stylingStop',
			resizestop:'stylingStop',
			mouseenter:'_highlight', 
			mouseleave:'_highlightoff' ,
			contextmenu:'_contextmenu'
			//click:'_contentEdit'
		});
		this.render();
    },
	

	_contextmenu:function(event) {
		//var c=window.getComputedStyle(this.element[0],null);
		//var c=this.element.data("ui-draggable"); //long running script
		//$("#dialog").dialog('open').html(soup.anything(c));
		//return false;
		//alert('Cell context menu');
		return false; //cancel other context menus
	},
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
	_highlight:function(event) {
		//this.element.css('background-color','silver'); 
		this.options.xtxt=$("#" + this.options.idi).val();
		//$("#"+this.options.idn).show();
		$("#"+this.options.idi).show().css({'position':'relative', 'z-index':10000, 'background':'silver'});
		$("#"+this.options.idr).hide();	
	},
	
	_highlightoff:function(event) {
		//this.element.css('background-color','white'); 
		var ntxt=$("#" + this.options.idi).val();
		//text has changed so 
		if( ntxt != this.options.xtxt) {
			//text changed so save
			ntxt=(ntxt=='')?'--':ntxt;
			this.options.undo.push(this.options.xtxt);
			if (this.options.undo.length > 10) {this.options.undo.shift();}
			this.options.text=ntxt;
			$("#"+this.options.idr).text(this._process(ntxt));	
			//soup.dataSave(this.options);
		}
		//$("#"+this.options.idn).hide();
		$("#"+this.options.idi).hide();
		$("#"+this.options.idr).show();	
	},
	
	
	_process: function( valu ) {
		//check for and evaluate expression in cell content if it is prefixed with equal sign
		if (valu.substr(0,1) == '=') {
			try{valu=eval(valu.substr(1));}
			catch(er){valu=er.toString();}
		}
        return valu;
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
		return this._process(this.options.text);
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
		//console.log (soup.anything(this.options));
		//soup.dataSave(this.options);
		//return false;
	}

});
	

var dashboard={
	
	'create':function(el){
		$(el).dashboard({'name':'Properties'});
		
	},
	
	'rows':['<div><div>'],	
	

	'label':function(title, label, callback){
		//TODO
		//Set up control with callback and pass to blackboard
		//Create undo operation
		
		var label1=$(el).cell({'name':title});
	
	
		window.BIM.blackboard(message, 'control');
	},

	'point3d':function(title, point3d, callback){
		//callback(point3d);
	},

	'real':function(title, real, callback){
		//TODO
		//Set up control with callback and pass to blackboard
		//Create undo operation
		
		/*
		// this code not very good, stack will just grow.  No easy way to manage. Consider jqueryUI widgets instead
		window.BIM.stack.push(callback); //array of callback functions
		var num=window.BIM.stack.length;
		control='<div class="BIMcontrol">'+title + ' : ' real.toString()+
		'<button class="BIMcontrol" action="BIM.stack(" '+callbackNum+")>OK </button></div>"
		window.BIM.blackboard(control, 'control');
		*/
		
		
		
		//callback(real);  //called by control to update BIM part and related babylon element(s) 
	},
	

	
	'text':function(title, text, callback){
	
		//callback(text);
	},	

};

return dashboard;
});


