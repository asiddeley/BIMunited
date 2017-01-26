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
	
	create:function(div){
		// create a new copy (of this template) and initialize
		this.div=div;
		var r=$.extend({}, uiBlackboard);
		return r;		
	},
	
	div:null,

	log:function(msg){
		this.store.push(msg);	
		//limit store to the last n messages
		if (this.store.length>50){this.store.shift();}
		var htm='', lim=10;
		var lim=(this.store.length<lim)?this.store.length:lim;
		for (var i=0; i<lim; i++){htm+=this.store[i]+'<br>'}
		//$(BIM.options.boards.blackboard).html(htm);
		$(this.div).html(htm);
	},
	
	store:[]
};


return uiBlackboard;

});


