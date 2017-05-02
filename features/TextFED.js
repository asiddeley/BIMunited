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

// Define module with simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {
	
var $=require('jquery');
var FED=require('features/FED');

var textFED=function(place, feature) {
	//Inherits from FeatureEditor, call super constructor to initialize
	FED.call(this, place, feature);
	
	//this.valu$.hide(); //inherited but not used
	this.text$=$('<input type="text" placeholder=" " value=" "></input>');
	//feature arg is optional, may be undefined
	try{ this.text$.val(feature.valu); } catch(er) { BIM.fun.log(er.toString()) ;};
	this.ok$=$('<input type="submit" value="ok">');
	
	this.form$.append(this.text$, this.ok$);
	return this;
};

//inherit prototype...
textFED.prototype=Object.create(FED.prototype);
textFED.prototype.constructor=textFED;

var __=textFED.prototype;

//override - ok button pressed
__.onSubmit=function(ev) {
	//ok button triggers local form event
	FED.prototype.onSubmit.call(this, ev);
	BIM.fun.trigger('featureChange', [
		ev.data.feature, //feature
		ev.data.text$.val() //revised value
	]);
};

//override 
__.onFeatureChange=function(ev, feature, valuRev){
	//form submit event triggers this bim wide event
	//takes care of executing feature-callback function to update mesh
	FED.prototype.onFeatureChange.call(this, ev, feature, valuRev); 

};

//override start function
__.start=function(mesh, feature){
	//call super function
	//stores feature (2nd arg if defined) to this feature
	FED.prototype.start.call(this, mesh, feature);
	try{ this.text$.val(feature.valu); } catch(er) {BIM.fun.log(er.toString());}
};

return textFED;

}); //end of define

