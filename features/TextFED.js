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
['jquery', 'features/FED'],

// Then do...
function($, FED) {

var textFED=function(place) {
	// Inherits from FeatureEditor, so call super function (the constructor in this case) to initialize fields
	FED.call(this, place);
	
	// TODO - add properties or change inherited fields as required here
	// Important - prevent page from refreshing when form submitted
	this.form$.on('submit', this, function(ev){ ev.preventDefault();	});

	// override valu$
	this.valu$.remove(); //needs to be removed() before redefining 
	this.valu$=$('<input type="text" placeholder="name" value="TextFED cons"></input>').addClass('ui-controlgroup-label');

	this.ok$=$('<input type="submit" value="ok">');
	this.form$.append(this.valu$, this.ok$);
	//this.wigetize();
	return this;
};

// inherit prototype...
textFED.prototype=Object.create(FED.prototype);
textFED.prototype.constructor=textFED;

var __=textFED.prototype;

// override start function
__.start=function(mesh, feature){
	
	// call super function - takes care of <form>, <label>, undo functionality etc.
	FED.prototype.start.call(this, mesh, feature);

	BIM.fun.log('TextFED start:'+JSON.stringify(feature));
	// value converted to string for display
	this.valu$.val(feature.valu);
	// the value stored for user to revise
	this.valu=feature.valu;
	
	// reset and configure event since it's a new feature
	//this.form$.off('submit');
	
	/***
	// respond to bimFeatureOK event (triggered by OK button)...
	this.form$.on('submit', this, function(ev){
		ev.preventDefault();
		//ev.data = 'this' as passed above
		var result=ev.data.text$.val();
		BIM.fun.log('submit triggered, revised text is:'+result);
		feature.onFeatureChange(result);
		BIM.fun.trigger('bimFeatureChanged', [feature]);
	});
	****/
	
};


return textFED;

}); //end of define

