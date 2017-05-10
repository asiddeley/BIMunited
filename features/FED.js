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

var FeatureEditor=function(place, feature) {
	//place - DOM container
	//feature - {label:'name', valu:mesh.variable, onFC:fn(ev,mesh,res){...}, FED:featureEditor}
	var that=this;
	this.form$=$('<form></form>').on('submit', this, this.onSubmit);
	this.label$=$('<span></span>').addClass('ui-controlgroup-label');
	this.prop$=$('<span></span>').addClass('ui-controlgroup-label');
	this.form$.append(this.label$, this.prop$);
	$(place).append(this.form$);
		
	BIM.fun.on( this.getEvents() );

	this.feature=feature;
	this.label$.text(feature.label);
	this.prop$.text(feature.prop); //converted to text for display

	return this;
};


var __=FeatureEditor.prototype;

__.getEvents=function(){
	return [ {name:'featurechange', data:this, handler:this.onFeatureChange} ];
};

__.onSubmit=function(ev){ 
	//this base class has no way of submitting, that's for inheritors to implement
	//with an ok button (or such) that would trigger the form submit event.
	ev.preventDefault(); 
	var feature=ev.data.feature;
	var revisedValu=ev.data.feature.propToBe;
	//BIM.fun.log('FED onSubmit:' + arguments.length);
	if (typeof feature != 'undefined' && typeof revisedValu != 'undefined') {
		BIM.fun.trigger('featurechange', [feature]);
	}
	
};

__.onFeatureChange=function(ev, feature){
	//triggered by form submit
	var that=ev.data; 	
	//all FEDs called, but only update applicable FED/feature
	//BIM.fun.log('FED onFeatureChange');

	if (feature === that.feature){
		//BIM.fun.log('the one to update: ' + feature.propToBe);
		try{
			//update valu field with revised value
			that.prop$.text( feature.propToBe );
			//execute the feature callback function that applies the changed valu to the mesh object
			//if (typeof feature.onFeatureChange =='function'){feature.onFeatureChange( feature.propToBe);} //DEPRICATED
			//if (typeof feature.onValuChange =='function'){feature.onValuChange( feature.propToBe);} //DEPRICATED
			if (typeof feature.propUpdater =='function'){feature.propUpdater( feature.propToBe);}
		} catch(er) {
			BIM.fun.log( er.toString() );
		}
	}
};



__.remove=function(){
	/*** 
	See jquery docs...use $.remove() when you want to remove the element itself, as well as everything inside it. In addition to the elements themselves, all bound events and jQuery data associated with the elements are removed. To remove the elements without removing data and events, use .detach() instead.	
	***/
	this.label$.remove();
	this.valu$.remove();
	this.form$.remove();
	BIM.fun.off(this.getEvents() );
};

__.start=function(){
	/*
	Turn form into a jquery controgroup if not already.
	Why not do this in constructor? to allow inheritors to 
	add items for inclusion in the controlgroup in their constructor
	inheritor must call start to wigetize
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
				"spinner": ".ui-spinner-input"}
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

return FeatureEditor;

}); //end of define

