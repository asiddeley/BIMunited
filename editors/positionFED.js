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
['jquery', 'editors/FED', 'babylon'],

// Then do...
function($, FED, babylon) {

var PositionFED=function(place) {
	// Inherits from FeatureEditor, so call super function (the constructor in this case) to initialize fields
	FED.call(this, place);
	
	// TODO - add properties or change inherited fields as required here
	var that=this;
	// Important - prevent page from refreshing when form submitted
	this.form$.on('submit', this, function(ev){ ev.preventDefault();	});
	this.select$=$('<select></select>');
	this.op1$=$('<option value="10">random (10)</option>');
	this.op2$=$('<option value="100">random (100)</option>');
	this.select$.append(this.op1$, this.op2$);
	this.text$=$('<input type="text" placeholder="name"></input>').addClass('ui-controlgroup-label');
	this.ok$=$('<input type="submit" value="ok">');
	this.form$.append(this.select$, this.text$, this.ok$);
	this.wigetize();
	this.select$.selectmenu({'select':function(ev, ui) { that.onSelect(ev, ui, that);}});
	return this;
};

// inherit prototype...
PositionFED.prototype=Object.create(FED.prototype);
PositionFED.prototype.constructor=PositionFED;

var __=PositionFED.prototype;

__.onSelect=function(ev, ui, that){
	//that - positionFED
	//this - <select></select> 
	//ev - event
	//ui - selected item or one of <option></option> tags, see jauery-ui docs
	//ui.item - {element:{value:'somestring', label:'somestring', }} //as discovered using JSON.stringify()
	
	BIM.fun.log(JSON.stringify(ui.item));
	var v, i=ui.item.value;
	switch(i){
		case '10':
			v=new babylon.Vector3(
				Math.floor(Math.random()*10), 
				Math.floor(Math.random()*10), 
				Math.floor(Math.random()*10)
			); 
		break;
		
		case '100':
			v=new babylon.Vector3(
				Math.floor(Math.random()*100), 
				Math.floor(Math.random()*100), 
				Math.floor(Math.random()*100)
			); 
		break;
		default:v=new babylon.Vector3(0,0,0);
		
	};
	that.text$.val(v );

};

// override start function
__.start=function(mesh, feature){
	
	// call super function - takes care of <form>, <label>, undo functionality etc.
	FED.prototype.start.call(this, mesh, feature);

	// TODO - take care of <select>, submit functionality
	this.text$.val(feature.valu);

	// reset and configure event since it's a new feature
	// Ie. callback in submit event no longer applicable, 
	this.form$.off('submit');
	
	// respond to bimFeatureOK event (triggered by OK button)...
	this.form$.on('submit', this, function(ev){
		ev.preventDefault();
		//ev.data = 'this' as passed above
		var result=ev.data.text$.val();
		//ensure result is a babylon.Vector3;
		
		
		BIM.fun.log('positionFeature is:'+result.toString() );
		//feature.onFeatureChange(result);
		//BIM.fun.trigger('bimFeatureChanged', [feature]);
	});

};


return PositionFED;

}); //end of define

