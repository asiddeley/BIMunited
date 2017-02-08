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
		div$.html('Picker...<br>Picked parts:');
		//BIM.fun.log('picker create '+babylon);
		// create a new copy (of this template) and initialize
		var uip=$.extend({}, uiPicker);
		uip.el$=div$;
		uip.pick$=$('<div>0</div>');
		uip.pick$.css('background', 'salmon');
		div$.append(uip.pick$);
		//scene unlikely to be defined when create called so defer.
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
	
	tags:[],
	
	tagCreate:function(part, i){
		return new babylon2D.Group2D({
		parent: this.canvas2D, 
		id: "GroupTag" + i, 
		width: 80, 
		height: 40, 
		trackNode: part.baby,  //picked babylon object
		origin: babylon2D.Vector2.Zero(),
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
					new BABYLON.Text2D(part.name, { marginAlignment: "h: center, v:center", fontName: "bold 12px Arial" })
				]
			})			
		]
		});
	},
		
	regen:function(){
		//generate tags/flags for screen space to represent each picked part
		var tag, part;
		this.tags=[]; //clear tags and regenerate
		for (var i=0; i<this.pick.length; i++){
			part=this.pick[i];
			tag=this.tagCreate(part, i);
			this.tags.push(tag);
		}		
	},
	
	start:function(){ 
		if (this.canvas2D==null) {
			//BIM.fun.log('picker start, BIM.scene ' + BIM.scene);
			this.canvas2D=new babylon2D.ScreenSpaceCanvas2D( BIM.scene, {id:"uiPickerCanvas"} );
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

