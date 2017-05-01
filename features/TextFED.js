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

var textFED=function(place, feature) {
	//Inherits from FeatureEditor, call super constructor to initialize
	FED.call(this, place, feature);
	
	//this.valu$.hide(); //inherited but not used
	this.text$=$('<input type="text" placeholder=" " value=" "></input>');

	this.ok$=$('<input type="submit" value="ok">');
	
	//modify inherited form submit function
	this.form$.on('submit', function(){
		
	});
	//.click(function(ev){
	//	BIM.fun.trigger('bimFeatureChange', ev.data.text$.text());
		//ev.data.submit(ev.data.text$.text());		
	//});
	this.form$.append(this.text$, this.ok$);
	return this;
};

//inherit prototype...
textFED.prototype=Object.create(FED.prototype);
textFED.prototype.constructor=textFED;

//override onSubmit - OK pressed
var __.onSubmit=function(ev){
	BIM.fun.trigger('bimFeatureChange', [
		ev.data.feature, //feature
		ev.data.text$.val() //revised value
	]);
}

var __=textFED.prototype;

//override start function
__.start=function(mesh, feature){

	//call super function
	//stores feature (2nd arg if defined) to this feature
	FED.prototype.start.call(this, mesh, feature);

	//BIM.fun.log('TextFED start:'+JSON.stringify(feature));
	//value converted to string for display
	this.text$.val(this.feature.valu);
	/**********
	// reprogram the submit event in case feature editor is reused on
	// a different feature - wouldn't want to callback past features
	this.form$.off('submit');
	this.form$.on('submit', this, function(ev) {
		//BIM.fun.log('submit');
		ev.preventDefault();
		BIM.fun.trigger('bimFeatureChange', [
		ev.data.feature, //feature
		ev.data.text$.val() //revised value
		]);
	});
	*****/
	
};

return textFED;

}); //end of define

