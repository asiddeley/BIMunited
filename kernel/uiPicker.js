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
		div$.css('background', 'cyan');
		div$.html('Picker...<br>');
		// create a new copy (of this template) and initialize
		var uip=$.extend({}, uiPicker);
		uip.el$=div$;
		uip.pick$=$('<div></div>');
		uip.pick$.css('background', 'salmon');
		div$.append(uip.pick$);
		//scene unlikely to be defined when create called so do this in start().
		//this.canvas2d = new BABYLON.ScreenSpaceCanvas2D(scene, { id: "ScreenCanvas"});
		return uip;
	},
	
	add:function( part ){ 

		//if part not in pick list...
		if (this.pick.indexOf(part) == -1) {
			//add part to pick list
			this.pick.push(part);	
		} else {
			//remove part from pick list by filtering it out
			this.pick=$.grep(this.pick, function(v, i){return (part !== v);});
		}
		//refresh
		this.pick$.text(this.pick.length.toString()); //update board
		this.regen();
	},
	
	canvas2D:null,
	
	//called by uiPicker on a newOrder event meaning another command was issued so clean-up
	done:function(eventname, data){
		this.pick=[]; //clear
		this.el$.hide();
	},
	
	// element with jquery wrapping
	el$:null,
	
	// pick count display field
	pick$:null,
	
	// array of picked parts to track
	pick:[],
	
	// array of tags - reused for each pick set
	tags:[],
	
	// objects for tapping into name and colour of each tag
	// tap={vis:true, name:'name', trackNode:null, fill:"#808080FF"}
	taps:[],
	
	
	tagCreate:function(part, i){
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
				fill: "#808080FF",
				children: [
					new BABYLON.Text2D(
						tap.name, //control this value through tap
						{marginAlignment:"h: center, v:center", fontName:"bold 12px Arial"}
					)
				]
			})			
		]
		});
	},
	
	tagCreateReuse:function(tap, i){
		return new babylon2D.Group2D({
		parent: this.canvas2D, 
		id: "GroupTag" + i, 
		isVisible:tap.vis, //control this value through tap
		width: 80, 
		height: 40, 
		//picked babylon object to track
		trackNode: tap.trackNode, //control this value through tap
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
				fill: tap.fill, //control this value through tap
				children: [
					new BABYLON.Text2D(
						tap.name, //control this value through tap
						{marginAlignment:"h: center, v:center", fontName:"bold 12px Arial"}
					)
				]
			})			
		]
		});
	},
	
	tapCreate:function(){
		return {fill:"#808080FF", name:'unnamed', trackNode:null, vis:true  };
	},
	
	regen:function(){
		//delete existing tags
		for (i=0; i<this.tags.length; i++){
			this.tags[this.tagCreate(this.picks[i], i)];
		};
		this.tags=[]; 
		
		//recreate tags
		var tag;
		for (i=0; i<this.pick.length; i++){
			tag=this.tagCreate(this.picks[i], i);
			this.tags.push(tag);
		};

		
	},
		
	regenReuse:function(){
		//generate tags for screen space to represent each picked part
		var i, tag, tap, part;
		
		for (i=0; i<this.taps.length; i++){
			//hide all tags (via taps), then show as many needed
			this.taps[i].vis=false;
		}

		for (i=0; i<this.pick.length; i++){
			//reuse tags but create extras as needed
			if (i==this.tags.length){
				tap=this.tapCreate();
				this.taps.push(tap)
				tag=this.tagCreate(tap, i);
				this.tags.push(tag);
			}
			//change tag properties through tap
			part=this.pick[i];
			tap=this.taps[i];
			tap.tracknode=part.baby;
			tap.name=part.name;
			tap.vis=true; //show it!!!
			//first tag to have special colour
			if (i==0) {tap.fill="#505050FF";} else {tap.fill="#808080FF";} 
		}
		
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
		this.pick$.text( '0' );  //update board
	}
	
	
};

return uiPicker;

});


/********************

var create = function (scene) {
    var d = 50;
    var cubes = new Array();
    for (var i = 0; i < 360; i += 20) {
        var r = BABYLON.Tools.ToRadians(i);
        var b = BABYLON.Mesh.CreateBox("Box #" + i / 20, 5, scene, false);
        b.position.x = Math.cos(r) * d;
        b.position.z = Math.sin(r) * d;
        cubes.push(b);
    }
    var canvas = new BABYLON.ScreenSpaceCanvas2D(scene, {
        id: "ScreenCanvas"
    });
    i = 0;
    for (var _i = 0, cubes_1 = cubes; _i < cubes_1.length; _i++) {
        var cube = cubes_1[_i];
        new BABYLON.Group2D({
            parent: canvas, 
            id: "GroupTag #" + i, 
            width: 80, 
            height: 40, 
            trackNode: cube, 
            origin: BABYLON.Vector2.Zero(),
            children: [
                new BABYLON.Rectangle2D({ 
                    id: "firstRect", 
                    width: 80, 
                    height: 26, 
                    x: 0, 
                    y: 0, 
                    origin: BABYLON.Vector2.Zero(),
                    border: "#FFFFFFFF", 
                    fill: "#808080FF", 
                    children: [
                        new BABYLON.Text2D(cube.name, { marginAlignment: "h: center, v:center", fontName: "bold 12px Arial" })
                    ]
                })
            ]
        });
        ++i;
    }
    return canvas;
};

var createScene = function() {
	var scene = new BABYLON.Scene(engine);
	var hpi = Math.PI / 2;
	var camera = new BABYLON.ArcRotateCamera("camera1", -hpi, hpi, 150, new BABYLON.Vector3(0, 0, 0), scene);
	camera.attachControl(canvas, false);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = .5;
			
	create(scene);

	return scene;
};


*************/

