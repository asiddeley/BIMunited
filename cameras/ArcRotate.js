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

	
	project:	BIMunited
	module: 	stage
	author:	Andrew Siddeley 
	started:	27-Jan-2017
	
****************************************************************/
// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

//var Babylon=require('babylon');
var $=require('jquery');
var Instrument=require('handles/Handle');

var ArcRotateCamera=function(topFeatures){

	Instrument.call(this, topFeatures);
	
	this.bimType='ArcRotateCamera';
	this.setScene=function(scene, mesh, canvas){
		//return $.extend({}, view, udata);
		//view.baby=new BABYLON.FreeCamera('free', view.position , window.BIM.scene);
		//new ArcRotateCamera(name, alpha, beta, radius, target, scene)
		var cam = new BABYLON.ArcRotateCamera(
			"ArcRotateCamera", //name
			1, //alpha
			0.8, //beta
			100, //radius
			new BABYLON.Vector3(0, 0, 0), //target
			BIM.scene
		);
		
        cam.attachControl(BIM.options.canvas, true);	
		//cam.bimHandler=ArcRotateCamera; //...done as following
		Instrument.prototype.setScene.call(this, scene, cam);
		
		return cam;
	};
};

//inherit prototype from super
ArcRotateCamera.prototype=Object.create(Instrument.prototype);
ArcRotateCamera.prototype.constructor=Instrument;
//shortcut
//var __=ArcRotateCamera.prototype;	


return ArcRotateCamera;
});