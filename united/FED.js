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
	//Note to inheritors, don't forget to this.wigetize() after calling this constructor.
	this.form$=$('<form></form>');	
	this.label$=$('<label></label>').addClass('ui-controlgroup-label');
	this.form$.append(this.label$);
	$(place).append(this.form$);
	return this;
};


var __=FeatureEditor.prototype;

__.form$=null;
__.label$=null;

__.remove=function(){
	this.label$.remove();
	this.form$.remove();
};

__.start=function(mesh, feature){

	this.label$.text(feature.label); 
};

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

