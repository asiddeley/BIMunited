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
function($, babylon, clone, props, highlight){
	
return {
	
	_listenerAdd:function(eventname, callback){
		if (typeof eventname != 'string' || typeof callback != 'function') {return;}
		var ll=this._listeners[eventname];
		if (typeof ll == 'undefined') {
			this._listeners[eventname]=[callback];
		} else {
			//ensure callback is unique in list
			//filter copies from list then append it
			ll=$.grep(ll, function(n, i){return (n !== callback);});
			ll.push(callback);
			BIM.fun.log('listenerAdd..'+ll.length);
		}

	},
	
	_listenerCall:function(eventname, data){
		//AKA trigger
		//get list of listener interested in the event
		var ll=this._listeners[eventname]; 
		//leave if list not found
		if (typeof ll == 'undefined') return;
		//execute callback functions of interested listeners
		for (var i=0; i<ll.length;i++){
			ll[i]({'eventname':eventname, 'data':data});
		}		
	},
	
	_listeners:{},

	
	command:function(command){
		//this._listenerCall('newOrder', command);
		var that=this;
		switch (command) {
			case 'clone':
				BIM.scene.onPointerDown=clone;
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
				//picker listens for newOrder event to cleanup 
				this._listenerAdd('newOrder', BIM.ui.picker.done);
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


