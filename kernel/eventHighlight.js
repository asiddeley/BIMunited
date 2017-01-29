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
	desc:		(B)uilding(I)nformation(M)odel(s)ource(o)pen(u)tility(p)rogram 
		
	module: 	onpick module
	desc: 
	usage:

	by: 		Andrew Siddeley 
	started:	30-Dec-2016
	
*/

define(
// load dependencies...
['babylon', 'jquery'],

// then do...
function(babylon, $){return(

function (evt, pickResult) {
	if (pickResult.hit) {
		if (pickResult.pickedMesh != null) {
			//BIM.fun.log('pickedMesh.bim '+pickResult.pickedMesh.bim); 
			//if (typeof pickResult.pickedMesh.material =='undefined'){
			//	BIM.fun.log('material undefined'); 
			//	pickResult.pickedMesh.material=BIM.tcmLib.maincolour.baby;
			//}
			if (pickResult.pickedMesh.bim.poked==false) {
				//apply material from library to indicate mesh is poked
				//BIM.fun.log('picked material '+pickResult.pickedMesh.material); 
				pickResult.pickedMesh.bim.pickRestore=pickResult.pickedMesh.material;
				pickResult.pickedMesh.material=BIM.tcmLib.poked.baby;	
				pickResult.pickedMesh.bim.poked=true;
				
				//get properties and connect them to property board
				var board=BIM.ui.propertyboard;
				var bim=pickResult.pickedMesh.bim;
				var pp=bim.handler.getProperties();
				board.clear();
				//BIM.fun.log('properties...');
				for (var k in pp){ 
					//BIM.fun.log(k);
					pp[k](bim, board); 
				} //call each property function
				
				
			} else {
				//restore material with a copy since matRestore needs to be set to false
				//to indicate unpicked, if not a copy then material would also be set.
				//pickResult.pickedMesh.material=BIM.tcmLib.pokedoff.baby;
				pickResult.pickedMesh.material=pickResult.pickedMesh.bim.pickeRestore;
				pickResult.pickedMesh.bim.poked=false;	
			}
		}
	}
}

);}); //define


