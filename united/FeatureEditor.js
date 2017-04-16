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
	module:		FeatureEditor
	desc:		field for editing a text feature
	by: 		Andrew Siddeley 
	started:	16-Apr-2017
**************************************************************/

define(

// Load dependencies...
['jquery'],

// Then do...
function($) {

var FeatureEditor=function(place) {

	this.div$=$('<form></form>');	
	//Important - prevent page from refreshing when form submitted
	this.div$.on('submit', function(ev){ev.preventDefault();});
	
	this.divLabel$=$('<span></span>').addClass('ui-controlgroup-label');
	this.divText$=$('<input type="text" placeholder="name"></input>').addClass('ui-controlgroup-label');
	this.divOK$=$('<span>ok</span>').button();//.addClass('ui-icon ui-icon-check');
	this.divOK$.on('click', this, function(ev){
		//note how 'this' is passed to event handler via ev.data...
		//trigger event and pass revised text as argument
		ev.data.div$.trigger('bimFeatureOK',[ev.data.divText$.val()]);
	});
	
	this.div$.append(this.divLabel$, this.divText$, this.divOK$);

	//Note to inheritors, don't forget to this.wigetize() after calling this constructor.
	$(place).append(this.div$);
	return this;
};


var __=FeatureEditor.prototype;

__.div$=null;
__.divLabel$=null;
__.divText$=null;
__.divOK$=null;	
__.remove=function(){
	this.divLabel$.remove();
	this.divText$.remove();
	this.divOK$.remove();
	this.div$.remove();
};

__.wigetize=function(){
	var options={
	'direction':'horizontal',
	'items':{
		"button":"button, input[type=text], input[type=submit]",
		"controlgroupLabel": ".ui-controlgroup-label",
		"checkboxradio": "input[type='checkbox'], input[type='radio']",
		"selectmenu": "select",
		"menu":".dropdown-items",
		"spinner": ".ui-spinner-input"}
	};
	this.div$.controlgroup(options);
};


// TODO - undo funcitonality for inheritors of this class
__.undo=function(){	};	
__.undolog=[];
__.undopush=function(that, valu){
	//add value to the undo stack but limit it to just 10 changes
	that.undolog.push(valu);		
	if (that.undolog.length > 10) {that.undolog.shift();}
};


// API function to set value, label, callback and argument1 (part)
__.start=function(mesh, feature){
		
	this.divLabel$.text(feature.label); 
	this.divText$.val(feature.valu);

	// reset and configure events to be triggered when OK pressed
	this.div$.off('bimFeatureOK');
	
	// respond to bimFeatureOK event (triggered by OK button)...
	this.div$.on('bimFeatureOK', function(ev, result){
		BIM.fun.log('OK triggered, revised text is:'+result);
		feature.onFeatureChange(result);
	});
	// then trigger bimFeatureChanged.
	this.div$.on('bimFeatureOK', function(ev){ 
		//trigger(event, [arg1, arg2...]) 
		//event handler like: function(ev, arg1, arg2){...}
		BIM.fun.trigger('bimFeatureChanged', [feature]);
	});
};

return FeatureEditor;

}); //end of define

