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
'kernel/eventHighlight',
],

// Then return the interpreter hash, only one instance required...
function($, audience){
	
return {
	
	init:function(){
		//picker listens for newOrder event to cleanup 
		this.listeners.add('input', BIM.ui.picker.done);
	},
	
	listeners:[],
	
	input:function(command){
		var that=this;
		this.listeners.call('input', command);
		
		switch (command) {
			case 'clone':
				//BIM.scene.onPointerDown=clone;
				return 'click to clone';
			break;			
			
			case 'pick':
				BIM.scene.onPointerDown=function (evt, pickResult) {
					if (pickResult.hit) {
						if (pickResult.pickedMesh != null) {
							BIM.ui.picker.add(pickResult.pickedMesh.bim);			
						}
					}
				}				

				BIM.ui.picker.start();
				return 'click to pick';
			break;
			
			case 'props':
				BIM.scene.onPointerDown=props;
				return 'properties mode';
			break;
			
			default:
				return 'unknown command';
			break;			
		};
	},
	

	
}



});


