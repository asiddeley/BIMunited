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
['jquery'],

// then do...
function($){


var uiBlackboard={

	addEventHandlers:function(ee){
		for (var n in ee){
			//add custom bim events to blackboard with jquery 
			this.div$.on(n, ee[n].handler);
		}
	},

	create:function(div$){
		// create a blackboard and initialize
		var bb=$.extend({}, uiBlackboard);
		//jquery wrapped DOM element for blackboard
		bb.div$=div$; 
		bb.div$.text('blackboard').addClass('bimBlackboard');
		//jquery wrapped DOM element for log
		bb.log$=$('<div></div>'); 
		bb.div$.append(bb.log$);
		return bb;
	},
	
	div$:null,
	
	input:function(command){
		var that=this;
		this.log(command);
		this.div$.trigger('bimInput', command);

		switch (command) {
			case 'bb':this.div$.toggle();return true; break;
			case 'wipe':this.logStore=[]; this.log$.html('');break;
		};
	},	
	
	log$:null,
	
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
		$(this.log$).html(htm);
	},
	
	logStore:[],

};


return uiBlackboard;

});


