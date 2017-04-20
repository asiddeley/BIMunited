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
	module:		uiFeatureText
	desc:		field for editing a text feature
	by: 		Andrew Siddeley 
	started:	26-Mar-2017
**************************************************************/

define(

// Load dependencies...
['jquery', 'editors/editor'],

// Then do...
function($, Editor) {

var textEditor=function(place) {
	// Inherits from FeatureEditor, so call super function (the constructor in this case) to initialize fields
	Editor.call(this, place);
	
	// TODO - add properties or change inherited fields as required here
	// Important - prevent page from refreshing when form submitted
	this.form$.on('submit', this, function(ev){ ev.preventDefault();	});
	this.text$=$('<input type="text" placeholder="name"></input>').addClass('ui-controlgroup-label');
	this.ok$=$('<input type="submit" value="ok">');
	this.form$.append(this.text$, this.ok$);
	this.wigetize();
	return this;
};

// inherit prototype...
textEditor.prototype=Object.create(Editor.prototype);
textEditor.prototype.constructor=textEditor;

var __=textEditor.prototype;

// override start function
__.start=function(mesh, feature){
	
	// call super function - takes care of <form>, <label>, undo functionality etc.
	FeatureEditor.prototype.start.call(this, mesh, feature);

	this.text$.val(feature.valu);

	// reset and configure event since it's a new feature
	this.form$.off('submit');
	
	// respond to bimFeatureOK event (triggered by OK button)...
	this.form$.on('submit', this, function(ev){
		ev.preventDefault();
		//ev.data = 'this' as passed above
		var result=ev.data.text$.val();
		BIM.fun.log('submit triggered, revised text is:'+result);
		feature.onFeatureChange(result);
		BIM.fun.trigger('bimFeatureChanged', [feature]);
	});

};


return textEditor;

}); //end of define

