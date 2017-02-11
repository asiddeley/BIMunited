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
	module: 	listenable
	desc: 
	usage:
	by: 		Andrew Siddeley 
	started:	8-Feb-2017
	
*/


define(
// load dependencies...
['jquery'],

// then do...
function($){

var listenable={

	create:function(el$){
		// create a new copy (of this template) and initialize
		return $.extend({}, listenable);
	},
	
	add:function(eventname, callback){
		if (typeof eventname != 'string' || typeof callback != 'function') {return;}
		var ll=this.store[eventname];
		if (typeof ll == 'undefined') {
			this.store[eventname]=[callback];
		} else {
			//ensure callback is unique in list
			//filter copies from list then append it
			ll=$.grep(ll, function(n, i){return (n !== callback);});
			ll.push(callback);
		}
	},
	
	call:function(eventname, data){
		//get list of listener interested in the event
		var ll=this.store[eventname]; 
		//leave if list not found
		if (typeof ll == 'undefined') return;
		//execute callback functions of interested listeners
		for (var i=0; i<ll.length;i++){
			ll[i]({'eventname':eventname, 'data':data});
		}		
	},
	
	store:{},

};

return listenable;

});