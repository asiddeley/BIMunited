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
	"babylon":"../babylon/babylon.required",
	"babylon2D":"../babylon/babylon.canvas2d.required"
}

});


define(
// load dependencies...
[
'arch/archModel',
'jquery',
'babylon',
'kernel/uiBlackboard',
'kernel/uiPicker',
'kernel/uiFeatures',
'kernel/lightHemi',
'kernel/viewFree',
'kernel/tcm'
],

// then do this...
function (Model, $, babylon, uiBlackboard, uiPicker, uiFeatures, Light, View, TCM) {

// construct library object for return
var BIM={
	
	// The a, b, c, d & e main API methods...
	admin:function(adminData){
		$.extend(this.options, {admin:adminData} );
	},
		
	board:function(el){
		//first and main control is the blackboard
		$.extend(this.options, {'board':el});		
		var bb=$('<div></div>'); 
		$(el).append(bb);
		
		var div=$('<div></div>');
		$(el).append(div);
		this.ui.features=uiFeatures.init(div);
		
		div=$('<div></div>');
		$(el).append(div);
		this.ui.picker=uiPicker.create(div);
		
		//create blackboard last because it depends on above controls
		this.ui.blackboard=uiBlackboard.create(bb);
	
	},
	
	canvas:function(canvas){
		$.extend(this.options, {'canvas':canvas});
	},

	database:function(udata){
		$.extend(this.options, {database:udata});
	},
	
	engage:function(){
		
		var that=this;	
		
		// prepare engine
		var c=this.options.canvas;
		var engine = new babylon.Engine(c,  true);
		this.options.engine=engine;
		// why warning re. webgl dest rect smaller than viewport rect?
		// See, http://doc.babylonjs.com/classes/2.5/Engine, try this...
		// this.engine.setViewport(new babylon.Viewport(0,0,700,500));
		
		// initialize the scene
		this.scene = new babylon.Scene(engine);
		var s=this.scene;
		
		// set light in scene
		this.light.handler.setScene(this.light);
		
		// visit all parts to set the babylon scene		
		this.model.handler.setScene(this.model);
		
		// initialize scene materials
		//this.fun.log('initializing tcm');
		for (var key in this.tcmLib) {
			var m=this.tcmLib[key];
			m.handler.setScene(m);
			//that.fun.log(key);that.fun.log(m.handler.type);
		}
		
		// initialize view-camera in scene
		this.viewLib.main.handler.setScene(this.viewLib.main);
		
		// This is a cool Babylon feature
		// s.debugLayer.show();
		
		// engage the engine!
		engine.runRenderLoop(function(){ s.render();} );	

	},
	
	// function store 
	fun:{
		autoHeight:function(el){
			// grows textarea fit text - useful for typing in a small textarea 
			$(el).css('height','auto').css('height', el.scrollHeight+5);		
		},
		log:function(message) {BIM.ui.blackboard.log(message);},
		uid:function(name){
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
		uidstore:{ },
		unique:function(name){return this.uid(name);}
	},
	
	//shortcuts
	get:{
		canvas:function() {return BIM.options.canvas;},
		scene: function() {return BIM.scene;},
		uid: function(name) {return BIM.fun.uid(name);},
		uipb:function() {return BIM.ui.propertyboard;}
	},

	help:function(input){
		this.fun.log('help on '+input);
	},
	
	//main method for user interaction
	input:function(input){return this.ui.blackboard.input(input);},
	
	//Reserved
	j:null,
	
	//callbacks, 
	kickbacks:{},
	
	// main light
	light:Light.demo(1),
	
	// main model 
	model:Model.demo(1),
	
	// Reserved
	n:null,
	
	// Extended by user in a, b, c, d & e API functions
	options:{
		admin:{user:"unnamed", disc:'arch'},
		board:null,
		canvas:null,
		database:null,
		engine:null 
	},	
	
	//parts library
	partLib:{},
	
	//Reserved
	q:null,

	//Libaray of models not rendered unless called/referenced from model
	//All items must have setScene function ie. sceneable
	referenceLib:{},
	
	//Babylon scene, analog to BIM.model, initialized inside engage()
	scene:null,	
	
	//Texture colour material library ie. hash
	tcmLib:TCM.stdLib(),
	
	//User interfaces, initialized by this.board()
	ui:{
		blackboard:{}, 
		features:{},
		picker:{}
	},
	
	//View library, A view is the BIM analog to babylon camera
	viewLib:{main:View.demo()},
	
	//Reserved
	wxyz:null
	
}; 		

window.BIM=BIM;
return BIM;

});





