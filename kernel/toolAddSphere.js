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
['jquery'],

// then do...
function($){
	
// return basic part
return (

function (evt, pickResult) {
	if (pickResult.hit) {
		if (pickResult.pickedMesh != null) {
			var pm=pickResult.pickedMesh;
			var sd=pm.soupData();
			
			//alert(pickResult.pickedMesh);
			//var t=JSON.stringify(pickResult.pickedMesh, replacer);
			$('#myConsole').text(pickResult.pickedMesh.toString());
			
		}
	}
}

); //return

}); //define


