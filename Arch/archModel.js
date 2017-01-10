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
	desc:		Building Information Model source open utility program 
		
	module: 	ArchModel
	desc: 
	usage:

	author: 	Andrew Siddeley 
	started:	17-Dec-2016
	
*************************************************************************/

define(
 //Load dependencies...
 [ 'jquery','kernel/model','kernel/partSphere'], 
  
 //Then do this...
 function($, model, sphere) {

 var archModel={
	//extends basicModel adding/overwriting:
	'name':'archModel',
	'discpline':'Arch',
	'type':'archModel',
	'visible':true
}
 
return {
	// archModel factories...
	'demo':function(num, userStuff){
		var that=this;
		switch(num){
			case 1: return that.demo1(userStuff); break;
			default: return that.demo1(userStuff);			
		}		
	},
	
	'demo1':function(userStuff){
		//example 1
		//Arch model with a sphere
		var r=$.extend(basicModel, archModel, userStuff);
		var v=BABYLON.Vector3;
		r.addPart( sphere.demo({'name':'s1', 'radius':0.5, 'position':new v(0,0,0)}));
		r.addPart( sphere.demo({'name':'s2', 'radius':1, 'position':new v(6,0,0)}));
		r.addPart( sphere.demo({'name':'s3', 'radius':1.5, 'position':new v(0,6,0)}));
		r.addPart( sphere.demo({'name':'s4',  'radius':2, 'position':new v(6,6,0)}));
		//r.addPart( discs.basic() );
		//r.addPart( planes.basic() );
		//alert('# parts '+r.aPart.length);
		return r;
	}
	

}
});



