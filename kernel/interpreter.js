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
'kernel/eventClone',
'kernel/eventProps',
'kernel/eventHighlight'],

// Then return the interpreter hash, only one instance required...
function($, babylon, clone, props, highlight){
	
return {
	
	'command':function(command){
		var that=this;
		switch (command) {
			case 'clone':
				BIM.scene.onPointerDown=clone;
				return 'clone mode';
			break;			
			
			case 'pick':
				BIM.scene.onPointerDown=highlight;	
				return 'pick mode';
			break;
			
			case 'props':
				scene.onPointerDown=props;
				return 'properties mode';
			break;
			default:
				return 'unknown command';
			break;			
		};
	}	
	
}



});

