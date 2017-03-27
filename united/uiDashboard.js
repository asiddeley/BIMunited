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
	module: 	united
	by: 		Andrew Siddeley 
	started:	26-Mar-2017
*/


define(
// load dependencies...
// loading widgetCell defines wCell widget in jquery.
['jquery', 'united/uiFeatureText'],

// then do...
function($, wc){

var uiDashboard={

	create:function(board, uis){
		// create only one instance of this ui - static
		// board - the DOM container all ui DOM elements
		// uiStore - BIM.ui hash to store ui references
		// For DOM structure of tabs, see example at https://api.jqueryui.com/tabs/
		
		this.div$=$('<div></div>'); 
		$(board).append(this.div$);	
		
		this.divTab$=$('<div></div>');
		this.div$.append(this.divTab$);
		
		this.divUl$=$('<ul></ul>');
		this.divTab$.append(this.divUl$);
		
		for (var i=0; i<uis.length; i++){this.addTab(i, uis[i]);}
		//use jquery-ui to turn tab$ into a tab widget
		this.divTab$.tabs();
		
		//use jquery-ui to turn div$ into a floating dialog box
		this.div$.dialog({draggable:true, title:'BIM United', autoOpen:true});
		
		BIM.fun.addEventHandlers(this.getEventHandlers());
		BIM.ui.uiDashboard=this;
		return this;
	},
	
	
	/*************************
	For DOM structure of tabs, see example at https://api.jqueryui.com/tabs/
	<div id="tabs">
		<ul>
			<li><a href="#tab-1"><span>One</span></a></li>
			<li><a href="#tab-2"><span>Two</span></a></li>
			<li><a href="#tab-3"><span>Three</span></a></li>
		</ul>
		<div id="tab-1">
		<p>First tab is active by default:</p>
		<pre><code>$( "#tabs" ).tabs(); </code></pre>
		</div>
		<div id="tab-2">...
	</div>
	*******************************/
	
	addTab:function(i, ui){
		//check and remove any dialog functionality, keeping structure
		var id='tab'+i.toString();
		//if (ui.div$.hasClass('ui-dialog')){ui.div$.destroy();}
		var l$=$('<li></li>');
		var a$=$('<a></a>').attr('href', "#"+id).text(ui.bimType);
		var d$=$('<div></div>').attr('id', id).append(ui.div$);
		//BIM.fun.log('id:'+d$.attr('id'));
		l$.append(a$);
		this.divUl$.append(l$);
		this.divTab$.append(d$);		
	},
	
	div$:null,
	divTab$:null,
	divUl$:null,
	
	getEventHandlers:function(){
		//don't use keywork 'this' here as it will refer to the callers context
		return {
			bimInput:{name:'bimInput',  handler:uiDashboard.onInput },
			//bimPick:{name:'bimPick',  handler:uiFeatures.onPick }
		};
	},
	
	onInput:function(ev, input){
		switch (input){
			case 'da':
			case 'dashboard':BIM.ui.uiDashboard.toggle();break;
			//case 'tab':BIM.fun.log(BIM.ui.uiDashboard.divTab$.html());break;
		} 
	},
	
	toggle:function(){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	},


};

return uiDashboard;

});


