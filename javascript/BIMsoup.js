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
		"jq":"jquery"
    }
});



define(

	//Dependencies
	['arch/archModel','jq', 'sylvester'],
	
	//Factory function 
	function (am, $, s) {
		alert('name:'+am.name+'\nxyz:'+s.vtos(am.xyz));
		return{
			'allo':function(args){alert(args);},
			'board':function(args){alert(args);},			
			'commandLineInput':function(args){alert(args);},
			'database':function(args){alert(args);},			
			'name':'BIMsoupObject',
			archModel:am
		};		
	}
);





