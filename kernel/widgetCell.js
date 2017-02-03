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

_create:function() {

	this.option({
		callback:function(){}, 
		name: 'unnamed',
		undo:[],
		valu: 'hello',
	});

	var $name=$('<div></div>').addClass('BimCellName').show();
	var $input=$('<textarea></textarea>').addClass('BimCellinput').hide();
	var $result=$('<div></div>').addClass('BimCellResult').text(this.option('valu')).show();
	var ah=function(el){el.css('height','auto').css('height', el.scrollHeight+5);}
	$input.on("onkeyup", $input, ah);
	
	this.element.addClass('BimCell');
	this.element.append($name, $input, $result);
	
	this.option('$name', $name);
	this.option('$input', $input);
	this.option('$result', $result);
	
	this._on( this.element, {
		mouseenter:'reveal', 
		mouseleave:'commit',
		contextmenu:'contextmenu'
		//click:'reveal',
	});
	

},

//cancel DOM default context menu Ie. right click floating menu
contextmenu:function(event) {return false; },

cancel:function(){this.revealoff();},

commit:function(event) {
	var v=this.option('$input').val();
	//BIM.fun.log('commit:'+this.options.valu);
	//check if input is different from result ie. has been edited 
	if(v != this.option('valu')) {
		//text changed so save it to the undo stack before updating it
		this.option('undo').push(this.option('valu'));
		//but limit the undo to just 10 changes
		if (this.option('undo').length > 10) {this.option('undo').shift();}
		//eliminate nulls
		v=(v=='')?'--':v;
		this.option('valu',v);
		//process ie. evaluate any expressions, and update the result field		
		var result=this.process(v);
		//update result field
		this.option('$result').text(result);
		
		//callback and return the result
		this.option('callback')(result.toString());
		//To do, commit to database...	
		//soup.dataSave(this.options);
	};
	this.revealoff();
},

option:function(key, valu){ 
	if(typeof valu == 'undefined'){
		return this._super(key); 
	} else {
		return this._super(key,valu);
	}
},

process:function( v ) {
	//check for and evaluate any code found in cell
	v=v.toString(); //just in case v is a real
	if (v.substr(0,1) == '=') {
		try{v=eval(v.substr(1));}
		catch(er){v=er.toString();}
	}
	return v;
},

reveal:function(event) {
	this.option('$name').show();
	this.option('$input').show();
	this.option('$result').hide();
},
	
revealoff:function(event){
	this.option('$name').show();
	this.option('$input').hide();
	this.option('$result').show();
},


_setOption: function( key, valu ) {
   //if ( key === "valu" ) {valu = this._checkValu( valu );}
   this._super( key, valu );
},

_setOptions: function( options ) {this._super( options );},	


// API function to set value, name, callback and show
vnc:function(valu, name, callback){
	//BIM.fun.log('valu, name:'+ valu + ',' + name);
	this.option({'callback':callback,'name':name, 'valu':valu});
	this.option('$name').text(name.toString()).show();
	this.option('$input').text(valu).hide();
	this.option('$result').text(this.process(valu)).show();	
	this.element.show();
}


}); //end of widget
}); //end of define

