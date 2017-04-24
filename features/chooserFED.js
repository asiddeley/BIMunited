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
	module:		chooseFED
	desc:		position Feature Editor 
	by: 			Andrew Siddeley 
	date:		21-Apr-2017
**************************************************************/

define(

// Load dependencies...
['jquery', 'features/FED', 'babylon'],

// Then do...
function($, FED, babylon) {

var ChooserFED=function(place$) {
	// place$ - jquery wrapped DOM container element
	// choices - array of choices [choice1, choice2...]
	// choice - {label:'label', onSelect:function(ev){}, onSubmit:function(ev){}}

	// Inherit from FED by calling it's constructor...
	// It sets up label$ and text$. Inherit to set up ok$ or more$, then wigetize
	FED.call(this, place$);
	//BIM.fun.log('chooser');
	//this.initMenu(choices);
	this.form$.on('submit', this, function(ev){ ev.preventDefault(); return false;});
	this.text$=$('<input type="text" placeholder="name"></input>').addClass('ui-controlgroup-label');
	// this.ok$=$('<input type="submit" value="ok">');
	this.more$=$('<button>...</button>');
	this.more$.on('mouseenter', this, function(ev){
		var that=ev.data;
		//BIM.fun.log(JSON.stringify(that.ddmenu$));
		that.menu$.show().position({
			my:"left bottom", at:"right bottom", of:that.more$, collision:"flipfit"
		});
	});
	this.more$.on('click', this, function(ev){ ev.preventDefault(); return false;});
	//this.form$.append(this.text$, this.more$, this.menu$);
	//this.wigetize(); //inherited from FED
	//this.menu$.css("position","absolute").hide();
	this.form$.append(this.text$, this.more$);
	return this;
};

// Inherit from FED, prototype and constructor...
ChooserFED.prototype=Object.create(FED.prototype);
ChooserFED.prototype.constructor=ChooserFED;
// prototype short-form __
var __=ChooserFED.prototype;

__.initMenu=function(choices){
	// choices - [{label:'label', onChoose:function(ev){}, onSubmit:function(ev){}}]
	var fn, i, li$, that=this;
	this.menu$=$('<ul></ul>').on('mouseleave',this, function(ev){ev.data.menu$.hide();});

	for (i in choices){
		//BIM.fun.log('onChoose->'+choices[i].onChoose.toString());
		li$=$('<li></li>').append($('<div></div>').text(choices[i].label));
		this.menu$.append(li$);
		// click menu item to call the onChoose function
		li$.on('click', this, choices[i].onChoose);
		// then hides menu
		li$.on('click', this, function(ev){ev.data.menu$.hide();});
	}
	
	this.form$.append(this.menu$);
	this.wigetize(); //inherited from FED
	this.menu$.css("position","absolute").hide();

};

// override start function
__.start=function(mesh, feature){
	
	// call super function - takes care of <form>, <label>, undo...
	FED.prototype.start.call(this, mesh, feature);
	
	BIM.fun.log(JSON.stringify(feature));
	this.initMenu(feature.choices);
	

	// TODO - take care of <select>, submit functionality
	//this.text$.val(feature.valu);

	// reset and configure event since it's a new feature
	// Ie. callback in submit event no longer applicable, 
	this.form$.off('submit');
	
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


return ChooserFED;

}); //end of define

