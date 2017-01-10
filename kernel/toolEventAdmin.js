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
		
	module: 	Tool Event Administrator (TEA)
	desc: 
	usage:

	author: 	Andrew Siddeley 
	started:	28-Dec-2016
	
*************************************************************************/


define(
// load dependencies...
['jquery',
'babylon',
'kernel/toolClone',
'kernel/toolProps',
'kernel/toolHighlight'],

// construct and return the TEA...
function($, babylon, clone, props, highlight){
	
return {
	
	'demo':function(n, usettings){
		var that=this;
		switch(n){
			case 1:that.pickToHighlight(usettings);break;
			default:that.pickToHighlight(usettings);break;			
		}		
	},
	
	'setScene':function(scene, canvas){ },
		
	'command':function(command, scene, canvas){
		//input interpreter
		var that=this;
		switch (command) {
			case 'clone':
				scene.onPointerDown=clone;
				return 'clone mode<br>';
			break;			
			
			case 'pick':
				scene.onPointerDown=highlight;	
				return 'pick mode<br>';
			break;
			
			case 'props':
				scene.onPointerDown=props;
				return 'properties mode<br>';
			break;
			default:
				return 'unknown command '+command+'<br>';
			break;			
		};
	}	
	
}



});


