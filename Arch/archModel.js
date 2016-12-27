///////////////////
//
// Andrew Siddeley
// 17-Dec-2016
//
// This module returns a new architectural model
// VS
// This module returns an bunch of architectural model makers
// usage archModel.make(settings) OR archModel.example(1)


var archModel={
	//extends basicModel adding/overwriting:
	'name':'archModel',
	'discpline':'Arch',
	'type':'archModel',
	'visible':true
}



define(
 //Load dependencies
 ['basic/basicModel', 'jquery', 'sylvester', 'basic/sphere'], 
 
 //Then do this...
 function(basicModel, $, vmath, sphere) {


	create:function(){return $.extend(basicModel, archModel);},
	
	
 
	//alert("basicModel\n"+u.tos(bm));
	//alert('name:'+bm.name+'\nxyz:'+s.vtos(bm.xyz));
	
	//return new object archModel based basicModel';
	
	var archModel=$.extend(basicModel, archStuff);
	
	archModel.addPart( sphere.basic() );

	
	
	return archModel;
 }
);