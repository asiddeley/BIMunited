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
var FC=require('features/FC');

var TextFC=function(place, feature) {
	//Inherits from FeatureEditor, call super constructor to initialize
	FC.call(this, place, feature);
	
	//this.prop$.hide(); //inherited but not used
	this.text$=$('<input type="text" placeholder=" " value="--"></input>');
	try{ this.text$.val(feature.prop); } catch(er) { BIM.fun.log(er.toString()) ;};
	this.ok$=$('<input type="submit" value="ok">');
	this.form$.append(this.text$, this.ok$);
	return this;
};

//inherit prototype...
TextFC.prototype=Object.create(FC.prototype);
TextFC.prototype.constructor=TextFC;

var __=TextFC.prototype;

//override 
__.onSubmit=function(ev) {
	//ev - submit event triggered by ok button inside <form></form> inside textFC
	//ev.data - textFC
	//note how new property value is passed for base class to process
	ev.data.feature.propToBe=ev.data.text$.val(); 
	//call prototype method (super method in OOP) which triggers propertychanged event...
	FC.prototype.onSubmit.call(ev.data, ev);
};


//override start function
__.start=function(){
	//call super function - mainly to wigetize the form 
	FC.prototype.start.call(this);
	//try{ this.text$.val(feature.valu); } catch(er) {BIM.fun.log(er.toString());}
};

return TextFC;

}); //end of define

