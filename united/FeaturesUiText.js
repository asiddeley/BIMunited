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
['jquery', 'united/FeatureEditor'],

// Then do...
function($, FeatureEditor) {

var FeaturesUItext=function(place) {
	// inherits FeatureEditor - initialize fields
	FeatureEditor.call(this, place);
	
	// TODO - add,change inherited fields as required here
	
	
	// wigetize fields
	this.wigetize();
	return this;
};


// inherit prototype...
FeaturesUItext.prototype=Object.create(FeatureEditor.prototype);
FeaturesUItext.prototype.constructor=FeaturesUItext;


return FeaturesUItext;

}); //end of define

