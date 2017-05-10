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
	module:	positionFED
	desc:		position Feature Editor 
	by: 			Andrew Siddeley 
	date:		21-Apr-2017
**************************************************************/

define(

// Load dependencies...
['jquery', 'features/FED', 'babylon'],

// Then do...
function($, FED, babylon) {

var PositionFED=function(place) {
	// Inherit from FED by calling it's constructor...
	FED.call(this, place);
	
	this.init();
	this.form$.on('submit', this, function(ev){ ev.preventDefault();	});
	this.text$=$('<input type="text" placeholder="name"></input>').addClass('ui-controlgroup-label');
	// this.ok$=$('<input type="submit" value="ok">');
	this.more$=$('<button>...</button>');
	this.more$.on('mouseenter', this, function(ev){
		var that=ev.data;
		//BIM.fun.log(JSON.stringify(that.ddmenu$));
		that.menu$.show().position({my:"left bottom", at:"left top", of:that.more$});
	});
	this.form$.append(this.text$, this.more$, this.menu$);
	
	this.wigetize(); //inherited from FED
	this.menu$.css("position","absolute").hide();
	return this;
};

// Inherit from FED, prototype and constructor...
PositionFED.prototype=Object.create(FED.prototype);
PositionFED.prototype.constructor=PositionFED;

var __=PositionFED.prototype;

__.init=function(){	
	var that=this;
	this.menu$=$('<ul></ul>').append(
		$('<li><div>randomized</div></li>').on('click',that, function(ev){
			var v=new babylon.Vector3(
				10*Math.floor(Math.random()*100), 
				10*Math.floor(Math.random()*100), 
				10*Math.floor(Math.random()*100)
			); 
			ev.data.text$.val(v.toString());
			ev.data.menu$.hide();
		}),
		$('<li><div>snaped</div></li>').on('click',that, function(ev){
			ev.data.text$.val('{to match snapped}');
			ev.data.menu$.hide();
		}),
		$('<li><div>picked</div></li>').on('click',that, function(ev){
			ev.data.text$.val('{to match picked}');
			ev.data.menu$.hide();
		}),
		$('<li><div>zero</div></li>').on('click',that, function(ev){
			var v=new babylon.Vector3(0,0,0); 
			ev.data.text$.val(v.toString());
			ev.data.menu$.hide();
		}),
		//$('<li>--</li>')
	).on('mouseleave',this, function(ev){ev.data.menu$.hide();});
};

__.initSelect=function(){
	this.select$=$('<select></select>');
	this.op1$=$('<option value="1">R10</option>');
	this.op2$=$('<option value="2">R100</option>');
	this.select$.append(this.op1$, this.op2$);
	// TODO after wigetize()...
	// var that=this;
	// this.select$.selectmenu({'select':function(ev, ui) { that.onSelect(ev, ui, that);}});
};


// override start function
__.start=function(mesh, feature){
	
	// call super function - takes care of <form>, <label>, undo functionality etc.
	FED.prototype.start.call(this, mesh, feature);

	// TODO - take care of <select>, submit functionality
	this.text$.val(feature.prop);

	// reset and configure event since it's a new feature
	// Ie. callback in submit event no longer applicable, 
	this.form$.off('submit');
	
	// respond to bimFeatureOK event (triggered by OK button)...
	this.form$.on('submit', this, function(ev){
		ev.preventDefault();
		//ev.data = 'this' as passed above
		var propToBe=ev.data.text$.val();
		//ensure result is a babylon.Vector3;
		
		BIM.fun.log('positionFeature is:'+propToBe.toString() );
		//feature.onFeatureChange(result);
		//BIM.fun.trigger('bimFeatureChanged', [feature]);
	});

};


return PositionFED;

}); //end of define

