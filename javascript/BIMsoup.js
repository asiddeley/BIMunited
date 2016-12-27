/////////////////////
//
// Andrew Siddeley
// 17-Dec-2016
//
// Main entry point of app

requirejs.config({
 "baseUrl": "javascript/",
 //default base URL is same as HTML file
 "paths": {
        "arch": "../Arch",
		"basic": "../Basic",
		//"jq": "jquery",
		//"jq":"//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
		"sylvester": "sylvester/sylvesterExp",
		"jq":"jquery",
		"babylon":"../webGL/babylonXP"
    }
});


var settings = {
	'canvas':null,
	'cli':null,
	'dbapi':null,
	'user':"defaultUser"	
};

define(
// load dependencies...
['arch/archModels','jquery', 'babylon', 'basic/_stagings'],

// then do this...
function (models, $, BABYLON, stagings) {
	
// return BIMsoup object
return {
	//// API functions
	'allo':function(user){
		
		this.settings=$.extend(this.settings, {'user':user});
		//alert("welcome "+settings.user+"\n");				
	},

	'board':function(canvas){
		this.settings=$.extend(this.settings, {'canvas':canvas});
	},	
			
	'command':function(input, output){
		// command line input and output
		this.settings=$.extend(this.settings, {'cli':input, 'clo':output});
	},

	'database':function(dbapi){
		this.settings=$.extend(this.settings, {'dbapi':dbapi});
	},
	
	'engage':function(usettings){
		// settings
		this.settings=$.extend(settings, usettings);
		this.aModel.push(models.example(1));
		this.stage=stagings.basic();
		// prepare engine
		var c=this.settings.canvas;
		this.engine = new BABYLON.Engine(c, true);
		this.scene = new BABYLON.Scene(this.engine);
		// camera, lights
		this.stage.setScene(this.scene, c);
		// visit all parts to set the babylon scene		
		for (var i=0; i<this.aModel.length;i++){this.aModel[i].setScene(this.scene, c);}
		// action
		var s=this.scene;
		this.engine.runRenderLoop(function(){s.render();});	
	},
	
		
	//// storage
	'aModel':[],	
	'engine':null,
	'scene':null,
	'settings':settings,
	'stage':{}
	
};		
	
});





