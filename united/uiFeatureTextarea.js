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

	
	project:	BIM united FC
	module:		uiFeatureTextarea
	desc:		field for editing a text feature
	by: 		Andrew Siddeley 
	started:	26-Mar-2017
**************************************************************/

define(

// Load dependencies...
['jquery'],

// Then do...
function($) {

var uiFeatureTextarea={

	create:function(place) {
		//make a copy of the hash with $.extend
		var ui=$.extend({}, uiFeatureTextarea);
		ui.div$=$('<div></div>').addClass('ui-widget-header');		
		ui.divLabel$=$('<span></span>').addClass('ui-widget-content');
		ui.divText$=$('<textarea></textarea>').addClass('ui-widget-content');
		ui.divText$.on("click keyup", ui.divText$, function(ev){
			//input is passed as ev.data
			ev.data.css('height','auto');
			var h=ev.data[0].scrollHeight+5;
			ev.data.css('height', h);
			//BIM.fun.log('autoheight'+h);
		});		
		ui.divOK$=$('<button></button>').addClass('ui-icon ui-icon-check');
		ui.divOK$.on('click', ui, function(ev){
			//note how ui (or keyword 'this') is passed to event handler via ev.data...
			//trigger event and pass revised text as argument
			ev.data.div$.trigger('bimFeatureOK',[ev.data.divText$.val()]);
		});
		
		ui.div$.append(ui.divLabel$, ui.divText$, ui.divOK$);
		
		$(place).append(ui.div$);
		return ui;
	},
	

	div$:null, //set in create
	divLabel$:null,
	divText$:null,
	divOK$:null,
	
	remove:function(){
		this.divLabel$.remove();
		this.divText$.remove();
		this.divOK$.remove();
		this.div$.remove();
	},

	// API function to set value, label, callback and argument1 (part)
	start:function(mesh, feature){
		
		this.divLabel$.text(feature.label); 
		this.divText$.val(feature.valu);
	
		//reset and configure events to be triggered when OK pressed
		this.div$.off('bimFeatureOK');
		
		//ok button triggers bimFeatureOK event that fires function below...
		this.div$.on('bimFeatureOK', function(ev, result){
			BIM.fun.log('OK triggered, revised text is:'+result);
			feature.onFeatureChange(result);
		});
		//ok button then triggers the anouncement bimFeatureChanged...
		this.div$.on('bimFeatureOK', function(ev){ 
			//trigger(event, [arg1, arg2...]) 
			//event handler like: function(ev, arg1, arg2){...}
			BIM.fun.trigger('bimFeatureChanged', [feature]);
		});
	},	

	undo:function(){
		//reserved
	},
	
	undolog:[],

	undopush:function(that, valu){
		//add value to the undo stack but limit it to just 10 changes
		that.undolog.push(valu);		
		if (that.undolog.length > 10) {that.undolog.shift();}
	}
	

}; 

return uiFeatureTextarea;

}); //end of define

