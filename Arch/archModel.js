///////////////////
//
// Andrew Siddeley
// 17-Dec-2016



define(
 //Dependencies
 ['basic/basicModel', 'jquery', 'sylvester'], 
 
 //Factory function
 function(bm, $, s) {

	//alert("basicModel\n"+u.tos(bm));
	//alert('name:'+bm.name+'\nxyz:'+s.vtos(bm.xyz));
	
	//return new object archModel based basicModel';
	return $.extend(bm, {name:'archModel', disc:'Arch'});
	
 }
);