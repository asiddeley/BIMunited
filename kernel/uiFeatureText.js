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
		
	module: 	widgetCell
	desc: 		Defines a cell widget in jquery. A cell widget has 3 fields, name, input and result. 
	Normally, the name and result fields are shown while the input is hiden. In edit mode, 
	the result field is hidden and input or field is shown to allow text editing.
	values in the edit field that begin with '=' are treated as expressions and processed similar
	to a cell in a spreadsheet.
	
	usage:	$( DOMelement ).wCell({name:'radius', valu:2.1, onCommit:function(valuRevised){});
	
	
	by: 		Andrew Siddeley 
	started:	20-Feb-2017
**************************************************************/

define(

// Load dependencies...
['jquery'],

// Then do...
function($) {

var uiFeatureText={

	create:function(host) {
		var ui=$.extend({}, uiFeatureText);
		ui.div$=$('<div></div>'); 
		
		ui.div$.addClass('bimCell');
		ui.labl$=$('<div></div>').addClass('bimCellname').text('label'); //default
		ui.edit$=$('<div></div>').addClass('bimCelledit');
		ui.valu$=$('<div></div>').addClass('bimCellvalu').text('valu');
		ui.text$=$('<textarea></textarea>').addClass('bimCelltextarea').val('valu');
		ui.text$.on("click keyup", ui.text$, function(ev){
			//input is passed as ev.data
			ev.data.css('height','auto');
			var h=ev.data[0].scrollHeight+5;
			ev.data.css('height', h);
			//BIM.fun.log('autoheight'+h);
		});		
		ui.editok$=$('<button>ok</button>').addClass('bimButton').on('click', ui, function(ev){
			//note how ui (or keyword 'this') is passed to event handler via ev.data...
			ev.data.div$.trigger('bimEditOk');
		});
		ui.edit$.append(ui.text$).append(ui.editok$);
		
		ui.div$.append(ui.labl$, ui.edit$, ui.valu$);
		
		//custom events
 		ui.div$.on('bimEditOk', ui, ui.editok);
		ui.div$.on('bimEditOff', ui, ui.editoff);
		ui.div$.on('bimEdit', ui, ui.edit);
		
		//jquery events
		ui.div$.on( 'click', ui, ui.edit);
		//supress DOM default context menu Ie. right click floating menu
		ui.div$.on( 'contextmenu', ui, function(ev){ return false; });
		//ui.div$.on( 'mouseenter', ui, ui.bimEdit);
		//ui.div$.on( 'mouseleave', ui, ui.bimEditOff);
		
		$(host).append(ui.div$);
		return ui;
	},
	
	//cancel:function(that){that.editordn();},
	
	div$:null, //set in create

	edit:function(ev) {
		var that=ev.data;
		ev.data.labl$.show();
		ev.data.edit$.show();	
		ev.data.valu$.hide();	
	},
	
	edit$:null, //set in create

	editoff:function(ev){
		var that=ev.data;
		that.labl$.show();
		that.valu$.show();
		that.edit$.hide();
	},
	
	editok:function(ev) {
		//BIM.ui.log('ok'+that.options.valu)
		var that=ev.data;
		var rv=that.editResult(that);
		var rt=typeof rv;
		//var valu=that.option('valu');
		//var type=that.option('type');
		
		if (rt != that.valuType) {
			//return type is different from input type so try to fix
			var er='warning, undefined or wrong type';
			if (rt=='undefined' || rt==null){BIM.fun.log(er); return;}
			switch(that.valuType){
				case 'string': rv=rv.toString(); break;
				case 'number': rv=parseFloat(rv.toString()); break;
				case 'boolean': rv=Boolean(rv.toString()); break;		
				default: BIM.fun.log(er);return;
			};
			if (isNaN(rv)){BIM.fun.log(er);return;}
		};
		
		if(rv != that.valu) {
			//valu has changed so do following... 
			that.undopush(that, that.valu); //update undo stack
			that.valu=rv; //update value
			
			//execute callback to inform caller of revised value
			//this.option('onChange')(null, part, rv); 
			that.div$.trigger('bimFeature', [that.featuresPart, rv]);
		};
	},
	
	editResult:function(that){
		var rv=that.text$.val();
		if (rv.substr(0,1) == '=') {
			try{rv=eval(rv.substr(1));}
			catch(er){
				BIM.ui.blackboard.log('expression error: ' + er.toString());
				rv=that.valu$.text();
			}
		}
		return rv;
	},
	
	featuresPart:null, //set in start()
		
	labl$:null, //set by create
	
	// API function to set value, label, callback and argument1 (part)
	start:function(valu, labl, onFeature, onFeatureArg1){
		//BIM.fun.log('valu, type:'+ valu + ',' + typeof(valu));
		
		//change text of following jquery wrapped DOM elements
		this.labl$.text(labl); 
		this.valu$.text(valu);
		this.text$.val(valu);
		
		this.featuresPart=onFeatureArg1;
		this.valu=valu;
		this.valuType=typeof(valu);
		
		this.div$.show();
		this.div$.trigger('bimEditOff');
		
		//reset and configure events to be triggered when feature editing done
		this.div$.off('bimFeature');
		this.div$.on('bimFeature', BIM.ui.picker.onFeature );
		this.div$.on('bimFeature', onFeature)
		
	},	

	text$:null,
	
	undo:function(){
		//reserved
	},
	
	undolog:[],

	undopush:function(that, valu){
		//add value to the undo stack but limit it to just 10 changes
		that.undolog.push(valu);		
		if (that.undolog.length > 10) {that.undolog.shift();}
	},
	
	valu:null,
	valu$:null, //set in create and start;
	valuType:null
}; 

return uiFeatureText;

}); //end of define

