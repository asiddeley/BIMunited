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

// Define module with simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {
	
var $=require('jquery');
var FED=require('features/FED');
var babylon=require('babylon');

var ChooserFED=function(place$, feature) {
	// place$ - jquery wrapped DOM container element
	// feature - {... choices:[choice, choice1...]... }
	// choice - {label:'label', onSelect:function(ev){}, onSubmit:function(ev){}}

	// Inherit from FED by calling it's constructor...
	// It sets up label$ and valu$. Inherit to set up ok$ or more$, then wigetize
	FED.call(this, place$, feature);
	
	this.text$=$('<input type="text" placeholder="name"></input>').addClass('ui-controlgroup-label');
	this.ok$=$('<input type="submit" value="ok">');
	this.text$.on('mouseenter', this, function(ev){
		var that=ev.data;
		that.menu$.show().position({my:"left bottom", at:"left top+2", of:that.valu$, collision:"flipfit"});
	});
	// prevent lingering menu 
	this.form$.on('mouseleave', this, function(ev){ ev.data.menu$.hide();});
	
	this.form$.append(this.text$);
	this.initMenu(feature.choices);
	this.form$.append(this.ok$);
	return this;
};

// Inherit from FED, prototype and constructor...
ChooserFED.prototype=Object.create(FED.prototype);
ChooserFED.prototype.constructor=ChooserFED;
var __=ChooserFED.prototype;  //shortcut to prototype

__.initMenu=function(choices){

	// choices - [{label:'label', onChoose:function(ev){}, onSubmit:function(ev){}}]
	var i, li$, that=this;
	this.menu$=$('<ul></ul>').on('mouseleave',this, function(ev){ev.data.menu$.hide();});

	for (i in choices){
		li$=$('<li></li>').append($('<div></div>').text(choices[i].label));
		this.menu$.append(li$);

		BIM.fun.log('chooserFED:' + choices[i].onChoose.toString() );		

		// click menu item to call the onChoose function
		li$.on('click', //event
			{that:this, onChoose:choices[i].onChoose}, //event data
			function(ev){ //event callback
				BIM.fun.log('onChoose')
				try {
					//execute the onChoose function passed in ev.data...
					var v=ev.data.onChoose();
					ev.data.that.valu$.text(v);
				} catch(er) { BIM.fun.log(er.toString()); }
			}
		);

		// then hides menu
		li$.on('click', this, function(ev){ev.data.menu$.hide();});
	}
	
	this.form$.append(this.menu$);
	this.menu$.css("position","absolute").hide();
};

// override 
__.onSubmit=function(ev){
	//Important to pass (event, feature, revisedValu)
	FED.prototype.onSubmit.call(ev.data, ev, ev.data.feature, ev.data.text$.val());
	
}

// override
__.onFeatureChange=function(ev, feature, valuRev){
	FED.prototype.onFeatureChange.call(ev.data, ev, feature, valuRev);
	
}

// override 
__.remove=function(){
	FED.prototype.remove.call(this);
	this.menu$.remove();
	this.ok$.remove();
}

// override start function
__.start=function(){
	
	// call super function - takes care of <form>, <label>, undo...
	FED.prototype.start.call(this);
	
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

