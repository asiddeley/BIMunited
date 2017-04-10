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
['jquery', 'babylon'],

// then do...
function($, BJS){

var BlackboardUI = function(board, title){
	
	this.div$=$('<div></div>');	
	if (typeof title != 'undefined' && title != null) {this.alias=title;}
	else  {this.alias='Log';}
		
	if (typeof board != 'undefined' && board != null){ 
		if (board instanceof window.Element){this.board$=$(board);}
		//board is jquery wrapped DOM element
		if (board instanceof $){this.board$=board;}	
		this.board$.append(this.div$);
	}
	
	//register events that this UI responds to
	BIM.fun.on(this.getEvents());
	
	//using <xmp> to escape any html code that may be input, such as "<button>...</button>"
	this.divLog$=$('<xmp></xmp>').addClass('ui-dialog-content');
	this.div$.append(this.divLog$);
	
	this.divInput$=$('<form></form>').addClass('ui-dialog-content');
	this.divInput$.append($('<input type="text" placeholder="Command">'));
	this.divInput$.append($('<input type="submit" value="Return">'));

	//jquery wrapped DOM element for scene dumps
	this.divDump$=$('<xmp></xmp>');
	this.div$.append(this.divDump$);
	this.divDump$.addClass('ui-dialog-content').css('height', '300px').hide();
	
	return this;
};

var DEF=BlackboardUI.prototype;

BlackboardUI.prototype.alias='Log';

//DOM element with jquery wrapper, provided via API and holds all UI
BlackboardUI.prototype.board$=null;

//DOM element for blackboard, logging user input etc
BlackboardUI.prototype.div$=null;
			
//DOM element for big text dumps	
BlackboardUI.prototype.divDump$=null;

BlackboardUI.prototype.divLog$=null;
	
BlackboardUI.prototype.getKeywords=function(){
	if (this.keywords==null){ this.keywords=[
		{keywords:['bb'], 
			handler:this.toggle, 
			help:'open/close the blackboard'}
	];}
	return this.keywords;
};
	
BlackboardUI.prototype.getEvents=function(){
	return { 
	bimInput:{name:'bimInput', data:this, handler:this.onInput },
	bimMsg:{name:'bimMsg', data:this, handler:function(ev, msg){ev.data.log(msg);} }
	};
};
	
BlackboardUI.prototype.keywords=null;
	
BlackboardUI.prototype.onInput=function(ev, input){
	//BIM.ui.uiBlackboard.log(input);
	ev.data.log("> "+input);
	
	//call others to process input 
	//this.div$.trigger('bimInput', [command]);
	
	//blackboard responsible for following input 
	//note how 'this' is passed in event data.  See getEvents()
	switch (input) {
		case 'bb':ev.data.toggle();break;
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
			
		case 'keywords':
			var keys=['bb', 'bbw', 'keywords', 'events'];
			ev.data.log('// Blackboard UI\n' + keys.join("\n"));
			break;		
			
		case 'events':
			var keys=Object.keys(ev.data.getEvents()); //keys - Array of event names
			ev.data.log('// Blackboard UI\n' + keys.join("\n"));
			break;				
	
	};
};

	
BlackboardUI.prototype.log=function(msg){
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
	
BlackboardUI.prototype.logStore=[];
		
BlackboardUI.prototype.toggle=function(){
	// Toggle only if this ui was initialized as a dialog otherwise
	// it can be assumed it is a tab in a tabbed dialog box.
	if (this.div$.is(':ui-dialog')){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	}
};
	
BlackboardUI.prototype.toggleDebug=function(){
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
	
BlackboardUI.prototype.toggleDebugB=false;

return BlackboardUI;

});


