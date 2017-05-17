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
var FC=require('features/FC');
var babylon=require('babylon');

var ChooserFC=function(place$, feature) {
	// place$ - jquery wrapped DOM container element
	// feature - {... choices:[choice, choice1...]... }
	// choice - {label:'label', onSelect:function(ev){}, onSubmit:function(ev){}}

	// Inherit from FED by calling it's constructor...
	// It sets up label$ and valu$. Inherit to set up ok$ or more$, then wigetize
	FC.call(this, place$, feature);
	
	//this.ok$=$('<input type="submit" value="ok">');
	this.prop$.text(feature.prop);
	this.prop$.on('mouseenter', this, function(ev){
		var that=ev.data;
		that.menu$.show().position({
			my:"left bottom", 
			at:"left top+2", 
			of:that.prop$, 
			collision:"flipfit"
		});
	});
	// prevent lingering menu 
	this.form$.on('mouseleave', this, function(ev){ ev.data.menu$.hide();});
	
	//this.form$.append(this.text$);
	this.initMenu(feature.choices);
	//this.form$.append(this.ok$);
	return this;
};

// Inherit from FED, prototype and constructor...
ChooserFC.prototype=Object.create(FC.prototype);
ChooserFC.prototype.constructor=ChooserFC;
var __=ChooserFC.prototype;  //shortcut to prototype

__.initMenu=function(choices){
	//choices -[{label:'label', onChoose:function(ev){}, onSubmit:function(ev){}}]

	//clear menu if already exists, means that menu is being redefined
	if(typeof this.menu$!='undefined'){this.menu$.remove();}

	var i, li$, choice, that=this;
	
	this.menu$=$('<ul></ul>').on('mouseleave',this, function(ev){ev.data.menu$.hide();});

	for (i in choices){
		//choices can be a list of strings - ['option1', 'option2', ...]
		//or a list of objects - [{label:'option1', onChoose:function(){} }, ... ]
		choice=choices[i];
		if (typeof  choice !='object') {
			choice={label:choice, onChoose:new Function('arg', 'return "'+choice+'";') };
		}
			
		li$=$('<li></li>').append($('<div></div>').text(choice.label));
		this.menu$.append(li$);

		//BIM.fun.log('chooserFED:' + choices[i].onChoose.toString() );		

		//click menu item to call the onChoose function
		li$.on('click', //event
			{that:this, onChoose:choice.onChoose}, //event data
			function(ev){ //event callback
				//BIM.fun.log('onChoose/submit:' + JSON.stringify(ev.data.that.feature) );
				try {
					//execute the onChoose function passed in ev.data...
					//alert (ev.data.onChoose);
					ev.data.that.feature.propToBe=ev.data.onChoose();
					//ev.data.that.valu$.text(v); //done by FED
					//need to trigger submit here - note that submit event is local to this module 
					ev.data.that.form$.trigger('submit', [ ev.data.that.feature ]);
				} catch(er) { BIM.fun.log(er.toString()); }
			}
		);

		// then hide menu
		li$.on('click', this, function(ev){ev.data.menu$.hide();});
	}
	
	this.form$.append(this.menu$);
	this.menu$.css("position","absolute").hide();
};

// override 
__.onSubmit=function(ev){
	//Important to pass (event, feature, revisedValu)
	FC.prototype.onSubmit.call(ev.data, ev, ev.data.feature);
}

// override
__.onFeatureChange=function(ev, feature){
	FC.prototype.onFeatureChange.call(ev.data, ev, feature);	
}

// override 
__.remove=function(){
	FC.prototype.remove.call(this);
	this.menu$.remove();
	//this.ok$.remove();
}

// override start function
__.start=function(){
	// call super function - takes care of <form>, <label>, undo...
	FC.prototype.start.call(this);
};


return ChooserFC;

}); //end of define

