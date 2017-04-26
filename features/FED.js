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

var FeatureEditor=function(place, feature) {
	//Note to inheritors, don't forget to this.wigetize() after calling this constructor.
	this.form$=$('<form></form>');
	this.label$=$('<label></label>').addClass('ui-controlgroup-label');
	this.valu$=$('<label></label>').addClass('ui-controlgroup-label');
	this.valu='default';
	this.form$.append(this.label$, this.valu$);
	$(place).append(this.form$);
	return this;
};


var __=FeatureEditor.prototype;

__.form$=null;
__.label$=null;

__.remove=function(){
	/***
	// See jquery docs...use $.remove() when you want to remove the element itself, as well as everything inside it.
	// In addition to the elements themselves, all bound events and jQuery data associated with the elements are removed. 
	// To remove the elements without removing data and events, use .detach() instead.	
	***/
	this.label$.remove();
	this.valu$.remove();
	this.form$.remove();
};

__.start=function(mesh, feature){
	// turn into a jquery controgroup if not already
	if (!this.form$.is(':ui-controlgroup')){ this.wigetize();  }
	// reprogram the submit event in case feature editor is reused on a different feature - don't want to callback past features
	this.form$.off('submit');
	this.form$.on('submit', this, function(ev, valu) {
		ev.preventDefault();
		valu=(typeof valu != 'undefined')?valu:ev.data.valu;
		//valu=ev.data.text$.val();
		BIM.fun.log('FED submit triggered, revised value is:'+valu);
		feature.onFeatureChange(valu);
		//BIM.fun.trigger('bimFeatureChanged', [feature]);
	});
	BIM.fun.log('FED start:'+JSON.stringify(feature));
	this.label$.text(feature.label);
	this.valu$.text(feature.valu); //converted to text for display
	this.valu=feature.valu; //revised valu 
};

__.submit=function(){ this.form$.trigger('submit'); };

__.undo=function(){	};	
__.undolog=[];
__.undopush=function(that, valu){
	//add value to the undo stack but limit it to just 10 changes
	that.undolog.push(valu);		
	if (that.undolog.length > 10) {that.undolog.shift();}
};

__.wigetize=function(){
	this.form$.controlgroup({
		'direction':'horizontal',
		'items':{
			"button":"button, input[type=text], input[type=submit]",
			"controlgroupLabel": ".ui-controlgroup-label",
			"checkboxradio": "input[type='checkbox'], input[type='radio']",
			"selectmenu": "select",
			"menu":"ul, .dropdown-items",
			"spinner": ".ui-spinner-input"}
	});
};

return FeatureEditor;

}); //end of define

