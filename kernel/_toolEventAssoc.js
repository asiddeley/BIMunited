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
	started:	28-Dec-2016
	
*/


define(
// load dependencies...
['jquery', 'babylon', 'kernel/highlight', 'kernel/dump'],

// then do...
function($, babylon, highlight, dump ){
	
return {
	
	//returns kit number n
	'demo':function(n, usettings){
		var that=this;
		switch(n){
			case 1:that.pickToHighlight(usettings);break;
			default:that.pickToHighlight(usettings);break;			
		}		
	},
	
	'setScene':function(scene, canvas){
		scene.onPointerDown=function(evt, pickResult){
			highlight(evt, pickResult);
			dump(evt, pickResult);
		};		
	},
		
	'command':function(command, console, scene, canvas){
		//input interpreter
		var that=this;
		switch (command) {
			case 'pick':
				scene.onPointerDown=highlight;	
				return 'pick mode<br>';
			break;
			case 'prop':
				scene.onPointerDown=dump;
				return 'properties mode<br>';
			break;
			default:
				return 'unknown command '+command+'<br>';
			break;			
		};
	}	
	
}



});


