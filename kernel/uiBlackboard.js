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

	project:	BIM
	module: 	uiBlackboard
	desc: 
	usage:
	by: 		Andrew Siddeley 
	started:	22-Jan-2017
	
*/


define(
// load dependencies...
['jquery', 'kernel/listenable'],

// then do...
function($){


var uiBlackboard={

	create:function(div$){
		// create a blackboard and initialize
		var bb=$.extend({}, uiBlackboard);
		bb.div$=div$; //jquery wrapped DOM element for blackboard
		bb.div$.text('blackboard..').addClass('bimBlackboard');
		
		//link ui controls with custom events
		//bb.div$.css('background', 'blue');
		bb.div$.on('bimInput', BIM.ui.picker.onInput); 
		bb.div$.on('bimInput', BIM.ui.features.onInput); 
		//$.on(customEvent, delegateSelector, handler)
		bb.div$.on('bimPick', BIM.ui.features.onPick);

		return bb;
	},
	
	div$:null,
	
	input:function(command){
		var that=this;
		this.log(command);
		//this.listeners.call('input', command);
		this.div$.trigger('bimInput', 'hello');
		
		switch (command) {
			case 'bb':this.div.toggle();return true; break;
			
			case 'clone':
				//BIM.scene.onPointerDown=clone;
				this.log('click to clone');
				return true;
			break;	

			case 'ff':
				this.log('featutes...');
				//access features of first picked item
				//return BIM.ui.features.access(BIM.ui.picker.last());
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
			case 'wipe':this.logStore=[]; this.div.html('');break;
			
			default: this.log('unknown command'); return false; 			
		};
	},	
	
	//make this blackboard listenable
	//listeners:listenable.create(), 
	
	log:function(msg){
		//add message to the store
		this.logStore.push(msg);
		//limit store to the last n messages
		if (this.logStore.length>50){this.logStore.shift();}
		//show last n items of the store
		var htm='', n=10, l=this.logStore.length;
		//make sure n is smaller or equal to the number of items to print
		n=(n>l)?l:n; 
		for (var i=l-n; i<l; i++){ htm+=this.logStore[i]+'<br>';}
		//$(BIM.options.boards.blackboard).html(htm);
		$(this.div$).html(htm);
	},
	
	logStore:[],

};


return uiBlackboard;

});


