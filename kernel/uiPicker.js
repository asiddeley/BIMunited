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
	module: 	uiPicker
	desc: 
	usage:
	by: 		Andrew Siddeley 
	started:	6-Feb-2017
	
*/


define(
// load dependencies...
['jquery', 'babylon', 'babylon2D' ],

// then do...
function($, babylon, babylon2D ){

var uiPicker={

	create:function(div$){
		div$.text('Picker').addClass('BimBoard');
		// create a new copy (of this template) and initialize
		var uip=$.extend({}, uiPicker);
		uip.el$=div$;
		uip.pick$=$('<div></div>').text('picked items:0').addClass('BimCell');
		div$.append(uip.pick$);
		return uip;
	},
	
	add:function( part ){ 

		//if part not in pick list...
		if (this.picks.indexOf(part) == -1) {
			//add part to pick list
			this.picks.push(part);	
		} else {
			//remove part from pick list by filtering it out
			this.picks=$.grep(this.picks, function(v, i){return (part !== v);});
		}
		//refresh
		this.pick$.text(this.picks.length.toString()); //update board
		this.regen();
	},
	
	canvas2D:null, //initialized in start() by which time BIM.scene is initialized 
	
	//called by uiPicker on a newOrder event meaning another command was issued so clean-up
	done:function(eventname, data){
		this.el$.hide();
	},
	
	// DOM container element with jquery wrapping
	el$:null, //initialized in create()
	
	// pick count display field with jquery wrapping
	pick$:null,
	
	// array of picked parts 
	picks:[],
	
	// array of tags - reused for each pick set
	tags:[],
	
	tagCreate:function(part, i){
		//first pick blue (begin with blue or blueprint), middle picks silver, last pick red
		//colour = # RR GG BB AA
		var colour=(i==0)?'#0000FFFF':(i==this.picks.length-1)?'#FF0000FF':'#C0C0C0FF';
		//BIM.fun.log('colour'+colour);
		return new babylon2D.Group2D({
		parent: this.canvas2D, 
		id: "GroupTag" + i, 
		isVisible:true,
		width: 80, 
		height: 40, 		
		trackNode: part.baby, //picked babylon object to track
		origin: babylon2D.Vector2.Zero(),
		opacity:0.5,
		children: [ 
		   new BABYLON.Rectangle2D({ 
				id: "firstRect", 
				width: 80, 
				height: 26, 
				x: 0, 
				y: 0, 
				origin: BABYLON.Vector2.Zero(),
				border: "#FFFFFFFF", 
				fill:colour, 
				children: [
					new BABYLON.Text2D(
						part.name, //part name
						{marginAlignment:"h: center, v:center", fontName:"bold 12px Arial"}
					)
				]
			})			
		]
		});
	},
	
	regen:function(){
		//delete existing tags
		for (i=0; i<this.tags.length; i++){
			this.tags[i].dispose();
		};
		this.tags=[]; 
		
		//recreate tags
		var tag;
		for (i=0; i<this.picks.length; i++){
			tag=this.tagCreate(this.picks[i], i);
			this.tags.push(tag);
		};
		
		this.pick$.text('picked items:'+this.picks.length);
	},
	
	start:function(){ 
		if (this.canvas2D==null) {
			//BIM.fun.log('picker start, BIM.scene ' + BIM.scene);
			this.canvas2D=new babylon2D.ScreenSpaceCanvas2D( BIM.scene, {
				id:"uiPickerCanvas",
				//don't cache as bitmap, keep canvas2d fresh
				cachingStrategy:babylon2D.CACHESTRATEGY_DONTCACHE  
			} );
		};
		this.el$.show();
	}
	
	
};

return uiPicker;

});

