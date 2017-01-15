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
['jquery','kernel/window'],

// then do...
function($, win){
return (
function (evt, pickResult) {
	if (pickResult.hit) {
		if (pickResult.pickedMesh != null) {
			//alert(pickResult.pickedMesh);
			//var t=JSON.stringify(pickResult.pickedMesh, replacer);
			var mesh=pickResult.pickedMesh;
			//var sd=mesh.BIMO;
			//var msg='type:'+sd.type+'<br>name:'+sd.name+'<br>';
			//BIM.settings.console(msg);
			var ff=mesh.BIMP.handlers.properties; //list of functions to access part's properties
			BIM.settings.dashboard.clear; //prepare panel for new set of properties
			for (var i=0; i<ff.length; i++){
				ff[i](mesh.BIMP, BIM.settings.dashboard);
			}
		}
	}
}
); //return
}); //define


