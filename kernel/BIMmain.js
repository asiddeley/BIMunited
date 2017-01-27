/////////////////////
//
// Andrew Siddeley
// 17-Dec-2016
//
// Main entry point of app

requirejs.config({
	
//default base URL is same as HTML 
//but needs to be the same as jquery for jquery to work
"baseUrl": "javascript/",

"paths": {
	"arch": "../Arch",
	"kernel": "../kernel",
	//"jq": "jquery",
	//"jq": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
	"sylvester": "sylvester/sylvesterXp",
	"jq":"../javascript/jquery",
	"babylon":"../babylon/babylonXP"
}

});


define(
// load dependencies...
[
'arch/archModel',
'jquery',
'babylon',
'kernel/stage',
'kernel/interpreter',
'kernel/uiBlackboard',
'kernel/uiPropertyBoard'
],

// then do this...
function (Model, $, babylon, stage, interpreter, uibb, uipb) {

// construct library object for return
var BIM={
	
	// The a, b, c, d & e main API methods...
	admin:function(user){
		$.extend(this.options, {'user':user} );
	},
		
	board:function(el){
		$.extend(this.options, {'board':el});		
		var bb=$('<div class="BIMblackboard">blackboard</div>'); 
		$(el).append(bb);
		this.ui.blackboard=uibb.create(bb);		
		var pb=$('<div class="BIMpropboard">properties</div>');
		$(el).append(pb);
		this.ui.propertyboard=uipb.create(pb);
	},
	
	canvas:function(canvas){
		$.extend(this.options, {'canvas':canvas});
	},

	database:function(dbapi){
		$.extend(this.options, {'dbapi':dbapi});
	},
	
	engage:function(uOptions){
				
		// settings
		$.extend(this.options, uOptions);
		
		//alert('engage');
		this.mainModel=Model.demo(1);
		
		// Set the stage, cameras, lights, materials
		// To do, include this in model 
		this.stage=stage.demo(1);
		
		// prepare engine
		var c=this.options.canvas;
		var engine = new babylon.Engine(c,  true);
		// why warning re. webgl dest rect smaller than viewport rect?
		// See, http://doc.babylonjs.com/classes/2.5/Engine, try this...
		// this.engine.setViewport(new babylon.Viewport(0,0,700,500));
		
		this.scene = new babylon.Scene(engine);
		var s=this.scene;
		
		// camera, lights
		this.stage.setScene(s, c);
		
		// visit all parts to set the babylon scene		
		this.mainModel.handlers.setScene( this.mainModel );
		
		// This is a cool Babylon feature
		// s.debugLayer.show();
		
		// engage
		engine.runRenderLoop(function(){ s.render();} );	

	},
	
	// function store 
	fun:{
		'autoHeight':function(el){
			// grows textarea fit text - useful for typing in a small textarea 
			$(el).css('height','auto').css('height', el.scrollHeight+5);		
		},
		log:function(message){this.ui.blackboard.log(message);},
		'uid':function(name){
			//Returns a simple unique id string based on a given name and
			//how many time that name is called.  If no name given then 'id' is the default name.
			//eg. 'cell1', 'line1', 'cell2', 'line2', 'line3', 'id1' ...
			name=(typeof name == 'undefined')?'id':name.toString();
			var count=this.uidstore[name];
			count=(typeof count == 'undefined')?1:count+1; //define or increment id number
			this.uidstore[name]=count; //save count
			//alert( name+count.toString());
			return name+count.toString();
		},
		'uidstore':{ }			
	},
	
	//shortcuts
	get:{
		canvas:function() {return BIM.options.canvas;},
		scene: function() {return BIM.scene;},
		uid: function(name) {return BIM.fun.uid(name);}
		uipb:function() {return BIM.ui.propertyboard;},
	},

	
	// control
	input:function(input){
		//return this.tea.command(input, this.scene, this.settings.canvas);
		//var result=this.tea.command(input);
		var result=interpreter.command(input);
		this.log(input); this.log(result);		
	},
	
	juliet:null,
	
	kilo:null,
	
	lights:{},
	
	// main model - created inside engage()
	mainModel:null,
	
	// Extended by user in a,b,c,d&e API functions
	options:{
		blackboard:function(msg){alert(msg);},	 //basic callback function for BIM messages 
		boards:{blackboard:null, propertyboard:null},
		canvas:null,
		dbapi:null,
		user:"defaultUser"
	},	
	
	parts:{},
	project:{
		//partInfo
		//non graphic element
		discpline:'arch',	
		location:'unknown',
		name:'unnamed',
		projectNumber:'xxxx'
	},
	
	// collections of items not part of scene unless called/referenced from mainModel
	// all items must have setScene function - sceneable
	referenceModels:{		
		//arrangers:{},
		//colours:{},
		//lights:{},
		//models:{},
		//robots:{}, // populators, defaults, tests etc
		//texmat:{}, // babylon materals and textures
		//views:{} // babylon cameras
	},
	
	scene:null,	// the scene - created inside engage()
	
	stage:{}, 	// lights and cameras - created in engage()
	
	textures:{},
	
	// Various user interfaces.  Initialized by this.board()
	ui:{
		blackboard:{}, 
		propertyboard:{} 
	},
	
	views:{},
	
	//'window':win	// BIM references window and window ref's BIM
	
	
}; 		

window.BIM=BIM;
return BIM;

});





