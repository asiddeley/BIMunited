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
	'name':'archModel',
	'discpline':'Arch',
	'type':'archModel',
	'visible':true
}

//archModel object...
return {
	
	'create':function(usettings){ return $.extend(model.create(), archModel, usettings);},

	'demo':function(num, usettings){
		var that=this;
		switch(num){
			case 1: return that.demo1(usettings); break;
			default: return that.demo1(usettings);			
		}		
	},
	
	'demo1':function(usettings){
		//demo 1
		//Arch model with some sphere
		var m=this.create(usettings);
		var v=BABYLON.Vector3;
		m.addPart( sphere.demo({'name':'s1', 'radius':0.5, 'position':new v(0,0,0)}));
		m.addPart( sphere.demo({'name':'s2', 'radius':1, 'position':new v(6,0,0)}));
		m.addPart( sphere.demo({'name':'s3', 'radius':1.5, 'position':new v(0,6,0)}));
		m.addPart( sphere.demo({'name':'s4', 'radius':2, 'position':new v(6,6,0)}));
		return m;
	},
	
	
	}
	

}
});



