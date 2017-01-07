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
['babylon'],

// then do...
function(babylon){
	
// return basic part
return (

function (evt, pickResult) {
	// var matLib=this.stage.matLib.picked;
	// if the click hits the ground object, we change the impact position
	if (pickResult.hit) {
		//alert('pickResult = '+pickResult.pickedPoint.x);
		//impact.position.x = pickResult.pickedPoint.x;
		//impact.position.y = pickResult.pickedPoint.y;
		if (pickResult.pickedMesh != null) {
			//highlight
			var picked=BIMsoup.stage.matLib.picked;
			var unpicked=BIMsoup.stage.matLib.unpicked;
			//alert('picked:'+picked+' / unpicked ' +unpicked)				
			if (typeof pickResult.pickedMesh.matBackup == 'undefinded'){
				pickResult.pickedMesh.matBackup=false;
			}
			if (pickResult.pickedMesh.matBackup==true) {
				// apply indicator material to picked mesh
				//alert(pickResult.pickedMesh.material.toString());
				pickResult.pickedMesh.matBackup=false;
				pickResult.pickedMesh.material=unpicked;					
			} else {
				//alert('matBackup'+pickResult.pickedMesh.matBackup);
				// restore original material to unpicked mesh
				pickResult.pickedMesh.material=picked;
				pickResult.pickedMesh.matBackup=true;	
			}
		}
	}
}

); //return

}); //define


