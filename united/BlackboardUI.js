/************************************************************

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

	project:	BIM
	module: 	uiBlackboard
	desc: 
	usage:
	by: 		Andrew Siddeley 
	started:	22-Jan-2017
	
*/


define(

// load dependencies...
['jquery', 'babylon', 'united/UI'],

// then do...
function($, BJS, UI){

var BlackboardUI = function(board, title){

	// This class extends UI, call super constructor
	UI.call(this, board, title); 
	
	//using <xmp> to escape any html code that may be input, such as "<button>...</button>"
	this.divLog$=$('<xmp></xmp>').addClass('ui-dialog-content');
	this.div$.append(this.divLog$);
	
	this.divForm$=$('<form></form>').submit(function(ev){
		ev.preventDefault(); //inhibit page reload
		//get text and pass it to BIM for processing
		BIM.input($(this).find('input:text').val()); 
		return false; //prevent further bubbling of event
	});
	this.divInput$=$('<input type="text" placeholder="Command">');
	this.divOk$=$('<input type="submit" value="Ok">');
	this.divForm$.append(this.divInput$, this.divOk$);
	this.divForm$.controlgroup({items:{
		"button":"button, input[type=text], input[type=submit]"
	}});
	this.div$.append(this.divForm$);

	//jquery wrapped DOM element for big text dumps such as serialized scene
	this.divDump$=$('<xmp></xmp>');
	this.div$.append(this.divDump$);
	this.divDump$.addClass('ui-dialog-content').css('height', '300px').hide();
	
	return this;
};


// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// Inherit prototype from UI
BlackboardUI.prototype=Object.create(UI.prototype);
BlackboardUI.prototype.constructor=BlackboardUI;
var __=BlackboardUI.prototype;
			
//DOM element for big text dumps	
__.divDump$=null;

__.divLog$=null;
	
__.getKeywords=function(){
	if (this.keywords==null){ this.keywords=[
		{keywords:['bb'], 
		handler:this.toggle, 
		help:'open/close the blackboard'}
	];}
	return this.keywords;
};
	
__.getEvents=function(){
	return [ 
		{name:'bimInput', data:this, handler:this.onInput },
		{name:'bimMsg', data:this, handler:function(ev, msg){ev.data.log(msg);}},
		{name:'bimMsg', data:this, handler:function(ev, msg){ev.data.log('BIM FC');}}
	];
};
	
__.keywords=null;

// Inherited but overriden	
__.onInput=function(ev, input){
	//BIM.ui.uiBlackboard.log(input);
	ev.data.log("> "+input);
	
	//call others to process input 
	//this.div$.trigger('bimInput', [command]);
	
	//blackboard responsible for following input 
	//note how 'this' is passed in event data.  See getEvents()
	switch (input) {
		case 'bb':ev.data.toggle(ev.data);break;
		case 'bbw':
			ev.data.logStore=[];
			ev.data.log$.html('');
			break;
		case 'debug':ev.data.toggleDebug();break;
		//dump scene
		case 'dump':
			//alert ('dump');
			//BIM.fun.log('visible '+BIM.ui.uiBlackboard.divDump$.is(':visible'));
			if (ev.data.divDump$.is(':visible')==true){
				ev.data.divDump$.hide();
			} else {
				var s=JSON.stringify(BJS.SceneSerializer.Serialize(BIM.scene) );
				s=s.replace(/(.{100})/g, "$1\n");
				ev.data.divDump$.show().html(s);
			}
			break;
		//dump scene Geometry
		case 'dumpg':
			var g=JSON.stringify(BJS.SceneSerializer.Serialize(BIM.scene).geometries);
			g=g.replace(/(.{100})/g, "$1\n");
			ev.data.divDump$.show().text(g);
			break;
		//dump scene Meshes
		case 'dumpm':
			var m=JSON.stringify(BJS.SceneSerializer.Serialize(BIM.scene).meshes);
			m=m.replace(/(.{100})/g, "$1\n");
			ev.data.divDump$.show().text(m);
			break;
		
		case 'events':
			var keys=Object.keys(ev.data.getEvents()); //keys - Array of event names
			ev.data.log(ev.data.alias.toUpperCase()+'\n' + keys.join("\n"));
			break;				

		case 'keywords':
			var keys=['bb', 'bbw', 'keywords', 'events'];
			ev.data.log(ev.data.alias.toUpperCase()+'\n' + keys.join("\n"));
			break;			
	};
};
	

__.log=function(msg){
	//insert returns every 100 characters
	msg=msg.replace(/(.{100})/g, "$1\n");
	
	//add message to the store
	this.logStore.push(msg);
	//limit store to the last n messages
	if (this.logStore.length>50){this.logStore.shift();}
	//show last n items of the store
	var htm='', n=10, l=this.logStore.length;
	//make sure n is smaller or equal to the number of items to print
	n=(n>l)?l:n; 
	//for (var i=l-n; i<l; i++){ htm+=this.logStore[i]+'<br>';}
	for (var i=l-n; i<l; i++){ htm+=this.logStore[i]+'\n';}
	$(this.divLog$).html(htm);
};
	
__.logStore=[];
	
__.toggleDebug=function(){
	if (!this.toggleDebugB) {
		BIM.scene.debugLayer.shouldDisplayLabel=function(node){return true;}
		BIM.scene.debugLayer.shouldDisplayAxis=function(mesh){return true;}
		BIM.scene.debugLayer.show();			
		this.toggleDebugB=true;
	} else {
		BIM.scene.debugLayer.hide();			
		this.toggleDebugB=false;
	};
};
	
__.toggleDebugB=false;

// usage> var bb=new BlackboardUI(DOMcontainer, "log" );
return BlackboardUI;

});


