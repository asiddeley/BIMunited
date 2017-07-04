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
	module:		FeatureEditor
	desc:		field for editing a text feature
	by: 		Andrew Siddeley 
	started:	16-Apr-2017
**************************************************************/

// Define module with simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {
	
var $=require('jquery');

var FeatureControl=function(place, feature) {
	//place - DOM container
	//feature - {label:'name', valu:mesh.variable, onFC:fn(ev,mesh,res){...}, FED:featureEditor}
	//var that=this;
	var clan=(typeof feature.clan=='undefined')?'bimFC':feature.clan;
	this.form$=$('<form></form>').on('submit', this, this.onSubmit);
	this.label$=$('<span></span>').addClass('ui-controlgroup-label');
	this.prop$=$('<span></span>').addClass('ui-controlgroup-label');
	this.form$.append(this.label$, this.prop$).addClass(clan);
	$(place).append(this.form$);
	
	//register this guy's events - unregistered by remove() 	
	BIM.func.on(this.getEvents());

	this.feature=feature;
	if (feature.alias==null) {this.label$.hide();} 
	else {this.label$.text(feature.alias);} //hide label if empty string
	
	//if (typeof feature.prop == 'string') { 
	//display the property
	this.prop$.text(feature.prop.toString()); 
	//} else  { /*this.prop$.text(feature.prop.toString());*/}
	
	return this;
};


var __=FeatureControl.prototype;

__.getEvents=function(){
	return [
		//{name:'featurechanged', data:this, handler:this.onFeatureChanged},
		{name:'propertychange', data:this, handler:this.onPropertyChange}
	];
};

__.onSubmit=function(ev){ 
	/***********
	This base class has a text box and submits after a keystroke (I think)
	inheritors to override/implement submit with an ok button (or such)
	this.form$=$('<form></form>').on('submit', this, this.onSubmit);
	that triggers the form submit event.
	submit event => onSubmit evaluates feature.propUpdate() and triggers propertychange => 
	ev - submit event triggered from FC or inheritor such as TextFC
	ev.data - FC or FC or inheritor such as TextFC
	******/
	
	ev.preventDefault(); //prevent page refresh
	try {
		//console.log('propUpdate...', ev.data.feature.propUpdate);
		//ev.data.feature.propUpdate(ev.data.feature.prop, ev.data.feature.propToBe);
		ev.data.feature.propUpdate(ev.data.feature.propToBe);
		//console.log('propertychange trigger...', ev.data.feature.propToBe);
		BIM.fun.trigger('propertychange', [ev.data.feature.prop]);
	} catch(er) {console.log(er);}
};

__.onPropertyChange=function(ev, prop){
	//meant to be overriden
	//prop - property that has changed
	if (ev.data.feature.prop === prop){
		//console.log('propertychange handled by', ev.data.feature.mesh.name);
		//the property was changed so update the display of it
		ev.data.prop$.text(ev.data.feature.propToBe.toString());
	}
};

__.remove=function(){
	/*** 
	See jquery docs...use $.remove() when you want to remove the element itself, 
	as well as everything inside it. In addition to the elements themselves, 
	all bound events and jQuery data associated with the elements are removed. 
	To remove the elements without removing data and events, use .detach() instead.	
	***/
	this.label$.remove();
	this.prop$.remove();
	this.form$.remove();
	//unregister events!
	BIM.fun.off(this.getEvents() );
};

__.start=function(){
	/*
	Turn form into a jquery controgroup if not already.
	Why not do this in constructor? to allow inheritors to 
	add items for inclusion in the controlgroup in their constructor
	inheritor must call start() to wigetize
	*/
	if (!this.form$.is(':ui-controlgroup')){ 
		this.form$.controlgroup({
			'direction':'horizontal',
			'items':{
				"button":"button, input[type=text], input[type=submit]",
				"controlgroupLabel": ".ui-controlgroup-label",
				"checkboxradio": "input[type='checkbox'], input[type='radio']",
				"selectmenu": "select",
				"menu":"ul, .dropdown-items",
				"spinner": ".ui-spinner-input"
			}
		});
	}

};

__.undo=function(){	};	
__.undolog=[];
__.undopush=function(that, valu){
	//add value to the undo stack but limit it to just 10 changes
	that.undolog.push(valu);		
	if (that.undolog.length > 10) {that.undolog.shift();}
};

return FeatureControl;

}); //end of define

