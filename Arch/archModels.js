///////////////////
//
// Andrew Siddeley
// 17-Dec-2016
//
// This module returns an bunch of architectural model makers
// usage archModels.make(settings) OR archModels.example(1)


var archModel={
	//extends basicModel adding/overwriting:
	'name':'archModel',
	'discpline':'Arch',
	'type':'archModel',
	'visible':true
}



define(
 //Load dependencies...
 ['basic/_model',
 'jquery',
 'sylvester',
 'basic/spheres',
 'basic/discs',
 'basic/planes'
 ], 
 
 //Then do this...
 function(basicModel, $, vmath, spheres, discs, planes) {

 return {
	// archModel factories...
	'basic':function(userStuff){
		//empty Architectural Model
		return $.extend(basicModel, archModel, userStuff);
	},
	
	'ex1':function(userStuff){
		//example 1
		//Arch model with a sphere
		var r=$.extend(basicModel, archModel, userStuff);
		var v=BABYLON.Vector3;
		r.addPart( spheres.basic({'width':3}));
		r.addPart( spheres.basic({'width':3, 'position':new v(4,0,0)}));
		r.addPart( spheres.basic({'width':3, 'position':new v(6,0,0)}));

		//r.addPart( discs.basic() );
		//r.addPart( planes.basic() );
		//alert('# parts '+r.aPart.length);
		return r;
	},
	
	'example':function(num){
		var that=this;
		switch(num){
			case 1:
				return that.ex1();
			break;
			default:
				return that.basic();			
		}		
	}
}
});



