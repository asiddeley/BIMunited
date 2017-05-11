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
	module:		SelectFED
	desc:		
	by: 		Andrew Siddeley 
	date:		29-Apr-2017
**************************************************************/

define(

// Load dependencies...
['jquery', 'features/FC', 'babylon'],

// Then do...
function($, FC, babylon) {

var ChooserFC=function(place$, mesh, feature) {
	// place$ - jquery wrapped DOM container element
	// mesh - owner of feature
	// feature - {... choices:[choice, choice1...]... }
	// choice - {label:'label', onSelect:function(ev){}, onSubmit:function(ev){}}

	// Inherit from FED by calling it's constructor...
	// It sets up label$ and text$. Inherit to set up ok$ or more$, then wigetize
	FED.call(this, place$, feature);

	this.form$.on('submit', this, function(ev){ ev.preventDefault(); return false;});
	
	// override - FED defines valu$ as <label></label>
	this.prop$.remove();
	this.prop$=$('<select></select>');

	//this.ok$=$('<input type="submit" value="ok">');
	//this.valu$.on('mouseenter', this, function(ev){
	//	var that=ev.data;
	//	that.menu$.show().position({my:"left bottom", at:"left top+2", of:that.valu$, collision:"flipfit"});
	//});
	// prevent lingering menu 
	//this.form$.on('mouseleave', this, function(ev){ ev.data.menu$.hide();});
	
	this.form$.append(this.prop$);
	this.initChoices(feature.choices);
	this.form$.append(this.ok$);
	return this;
};

// Inherit from FED, prototype and constructor...
SelectFC.prototype=Object.create(FC.prototype);
SelectFC.prototype.constructor=SelectFC;
// SelectFED.prototype shortcut is __
var __=SelectFC.prototype;

__.initChoices=function(choices){

	// choices - [{label:'label', onChoose:function(ev){}, onSubmit:function(ev){}}]
	var fn, i, li$, that=this;
	//this.menu$=$('<ul></ul>').on('mouseleave',this, function(ev){ev.data.menu$.hide();});

	for (i in choices){
		li$=$('<option></option>').text(choices[i].label));
		this.menu$.append(li$);
		// click menu item to call the onChoose function
		li$.on('click', this, choices[i].onChoose);
		// then hides menu
		//li$.on('click', this, function(ev){ev.data.menu$.hide();});
	}
	
	this.form$.append(this.valu$);
	//this.menu$.css("position","absolute").hide();
};

// override remove function
__.remove=function(){
	FC.prototype.remove.call(this);
	//this.menu$.remove();
	//this.ok$.remove();
}

// override start function
__.start=function(mesh, feature){
	
	// call super function - takes care of <form>, <label>, undo...
	FC.prototype.start.call(this, mesh, feature);
	
	/***********
	// respond to bimFeatureOK event (triggered by OK button)...
	this.form$.on('submit', this, function(ev){
		ev.preventDefault();
		//ev.data = 'this' as passed above
		var result=ev.data.text$.val();
		//ensure result is a babylon.Vector3;
		
		//BIM.fun.log('positionFeature is:'+result.toString() );
		//feature.onFeatureChange(result);
		//BIM.fun.trigger('bimFeatureChanged', [feature]);
	});
	**********/
};


return ChooserFC;

}); //end of define

