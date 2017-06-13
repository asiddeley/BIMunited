/************************************************************
	license:

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

	
	project:	BIM united FC (Feature & Function Collection)
	module: 	__PartHandler
	desc: 		Abstract base class for all part handlers.  Constructor function creates a handler Object, one handler per bimType
	author: 	Andrew Siddeley 
	started:	8-May-2017
	
****************************************************************/
// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module){

//var $=require('jquery');
//var babylon=require('babylon');
//var Nameable=require('features/Nameable');

var Handler=function(moreFeatures){

	this.bimType='Element';
	this.desc='prototype for all Bim-United-FC scene-model elements';
	if (Array.isArray(moreFeatures)){ this.Features=moreFeatures; }
	else {this.Features=[];}
	//console.log(this.Features);
};
var __=Handler.prototype;	

__.setScene=function(scene, parentMesh){
	//mesh - babylon mesh, optional
	
	if (typeof parentMesh == 'undefined'){parentMesh={};}
	parentMesh.bimhandle=this; //should be .bimhandle or .bimelement__handle
	parentMesh.bimData={};
	for (var i in this.Features){
		//Features which are constructor functions so need to call their prototypes...
		this.Features[i].prototype.setScene(scene, parentMesh);
	}
	return parentMesh;
};

__.addFeatures=function(){
	//adds a feature constructor function to this Element__Handler
	for (var a in arguments) {
		this.Features.push(arguments[a]);
		//console.log(arguments[a]);
	}
};	

__.getfeatures=function(mesh) {
	/**********
	Returns a fresh hash of features:
	{name:{feature}, position:{feature}...}
	A feature is a hash scoped to a particular mesh like this:
	{label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditer}
	**********/
	//console.log('getfeatures(), this:');console.log(this);
	//Hope there's no confusion with Features, features & feature.
	var i, feature, features={};
	for (i in this.Features){
		feature=new this.Features[i](mesh);
		features[feature.alias]=feature;
	}
	return features;
}

return Handler;
});