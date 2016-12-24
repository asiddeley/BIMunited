define([], function(){

var a=function(obj){
		//returns anything as a string, with escaped markups
		var r="";  
		switch(typeof obj){
			case "object":
				r="Object or Array:\n";
				for (var i in obj) {
						r+=i +":"+a(obj[i])+"\n";
				}
			break;
			default:
				//r="<u>"+ typeof (obj)+"</u><br>"+obj;
				r=obj;
		}
		return r;
	};

//return object of useful functions
return {anything:a, tos:a};

});