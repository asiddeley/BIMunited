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

	
	project:	BIMsoup
	desc:		(B)uilding (I)nformation (M)odel (s)cript (o)riented (u)tility (p)ackage 
		
	module: 	stage
	desc: 
	usage:

	by: 		Andrew Siddeley 
	started:	27-Dec-2016
	
****************************************************************/
define(
// load dependencies...
['babylon','jquery'],

// then do this...
function(BABYLON, $){

// stage properties
var stage = {
	'cameras':{},
	'lights':{},
	'matLib':{},
	'name':'unnamed',
	'setScene':function(scene, canvas){ },
	'type':'Stage', //set by create
	//'ui':{} //user interface
};

// stage methods...
var Stage={
	
	'create':function(usettings){return $.extend({}, Stage, stage, usettings);},

	'demo':function(num){
		var that=this;
		switch(num){
			case 1:	return that.demo1(); break;
			default:return that.demo1();					
		}
	},
		
	'demo1':function(){
		// override setScene method
		return Stage.create({'setScene':function(scene, canvas){
			// Cameras
			this.cameras.free=new BABYLON.FreeCamera('free', new BABYLON.Vector3(0, 5,-10), scene);
			// why warning re rect smaller than view rect?  Try below...
			// this.cameras.free.viewport=new BABYLON.Viewport(0,0,1,1); ...no good.
            this.cameras.free.setTarget(BABYLON.Vector3.Zero());
            this.cameras.free.attachControl(canvas, false);	
			// Lights
			this.lights.hemi=new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0,1,0), scene);
			// Materials
			this.matLib.picked=new BABYLON.StandardMaterial('picked', scene);
			this.matLib.picked.diffuseColor = new BABYLON.Color3(255, 215, 0);
			//this.matLib.picked.alpha=0.5;
			this.matLib.unpicked=new BABYLON.StandardMaterial('unpicked', scene);
			this.matLib.unpicked.diffuseColor = new BABYLON.Color3(100, 100, 100);
			
			// UI
			//this.ui.uiPropertyboard=UIPB.create(BIM.get.divPropertyboard());
			//this.ui.uiBlackboard=UIBB.create(BIM.get.divBlackboard());
		}});		
	},


	'demo1old':function(){
		// basic stage with one hemi light and a free camera
		var r=$.extend({}, Stage, stage);
		// override setScene method
		r.setScene=function(scene, canvas){
			// Cameras
			this.cameras.free=new BABYLON.FreeCamera('free', new BABYLON.Vector3(0, 5,-10), scene);
			//this.cameras.free.viewport=new BABYLON.Viewport(0,0,1,1); //dest rect < view rect warning remains?
            this.cameras.free.setTarget(BABYLON.Vector3.Zero());
            this.cameras.free.attachControl(canvas, false);	
			// Lights
			this.lights.hemi=new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0,1,0), scene);
			// Materials
			this.matLib.picked=new BABYLON.StandardMaterial('picked', scene);
			this.matLib.picked.diffuseColor = new BABYLON.Color3(255, 215, 0);
			this.matLib.unpicked=new BABYLON.StandardMaterial('unpicked', scene);
			this.matLib.unpicked.diffuseColor = new BABYLON.Color3(100, 100, 100);
			//this.matLib.picked.alpha=0.5;
		};		
		return r;
	},
	
	'type':'stage'
	
}

//alert('stageHandlers:'+stageHandlers);
return Stage;
});