///////////////////
//
// Andrew Siddeley
// 17-Dec-2016
//
//

define(
// load dependencies...
['sylvester'],
// then do...
function(vmath) {

// return a constructed basicModel
return {

	'addPart':function(part){this.aPart.push(part);},
	'aPart':[],
	'discipline':null,
	'name':'unnamed',
	'setScene':function(scene, canvas){
		for (var i=0; i<this.aPart.length; i++)
			{this.aPart[i].setScene(scene, canvas);}
	},
	'tags':[],
	'type':'basicModel',
	'visit':function(visitor){visitor.welcome(this);},			
	'xyz':vmath.V([1,2,3])			
};

});











