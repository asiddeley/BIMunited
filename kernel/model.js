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

	'addPart':function(part){
		part.parent=this;
		this.parts.push(part);
		if (this.scene!=null)
			part.setScene(this.scene, this.canvas);
		},
	'canvas':null,
	'discipline':null,
	'name':'unnamed',
	'parts':[],
	'scene':null,
	'setScene':function(scene, canvas){
		if (this.scene==null) {this.scene=scene;this.canvas=canvas;}
		for (var i=0; i<this.parts.length; i++){
			//part_static(part[i],scene, canvas);
			this.parts[i].setScene(scene, canvas);
			}
		},
	'tags':[],
	'type':'model',
	'visit':function(visitor){visitor.welcome(this);},			
	'xyz':vmath.V([1,2,3])			
};

});











