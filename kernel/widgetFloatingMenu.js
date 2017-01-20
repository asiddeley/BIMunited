/**********************************
S imple
O ff-line
U tility
P ackage

Andrew Siddeley
19-Apr-2016
*/

var soup={};

soup.ver="16.06.25";

soup.pageCount=0;
soup.picItem="1";
soup.rowCount=0;

//console.log("loading soup");

//soup.anything=function(input){return this.mayNotBeStr(input);}

soup.anything=function(obj){
	//returns anything as a string, with HTML markups
	var r="";  //$(".sandboxResult"+soup.sandbox.name).val()+"<br>";
	switch(typeof obj){
		case "object":
			r="<u>Object or Array:</u><br>";
			for (var i in obj) {
				//if (obj.hasOwnProperty(i)){
					r+=i +":"+soup.anything(obj[i])+"<br>";
				//}
			}
		break;
		default:
			//r="<u>"+ typeof (obj)+"</u><br>"+obj;
			r=obj;
	}
	return r;
}

soup.anything$=function(obj){
	//returns anything as a string, with escaped markups
	var r="";  
	switch(typeof obj){
		case "object":
			r="Object or Array:\n";
			for (var i in obj) {
					r+=i +" => "+soup.anything(obj[i])+"   ";
			}
		break;
		default:
			//r="<u>"+ typeof (obj)+"</u><br>"+obj;
			r=obj;
	}
	return r;
}


soup.autoHeight=function (el) {
	//Thanks http://stephanwagner.me/auto-resizing-textarea
    $(el).css('height', 'auto').css('height', el.scrollHeight + 5);
}


/*******************************************
Soup ajax database functions
A Siddeley
25-May-2016
********************************************/


soup.axLoadFile=function(col){

	// col = mongo style collection eg. {field1:"val1", field2:{field21:"hello"}...}
	// A Siddeley, 25-May-2016
	
	try {
		//"q" example - return all documents with "active" field of true:
		//https://api.mlab.com/api/1/databases/my-db/collections/my-coll?q={"active": true}&apiKey=myAPIKey
		var db="soupdb";
		var api="get this from mlab";
		return ($.ajax({
			url: "https://api.mlab.com/api/1/databases/"+db+"/collections/"+col+"?apiKey="+api,
			type: "GET",
			contentType: "application/json"
		}));

	} catch(ex) {
		alert ("axLoadFile failed " + ex);
		return null;
	}
}

soup.axSaveFile=function(filePath, content){
	this.ieCreatePath(filePath);
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
	} catch(ex) {
		return null;
	}
	var file = fso.OpenTextFile(filePath,2,-1,0);
	file.Write(content);
	file.Close();
	return true;
}






/*******************************************
Soup database functions
A Siddeley
1-May-2016
*/

soup.dataBase="base/"; //sub folder for data storage
soup.dataCache=null; //large string
soup.dataDoc=function(name, valu){
	//Returns a basic data object
	return ({
		name:(typeof name == 'undefined')?'unnamed':name.toString(),
		valu:(typeof valu == 'undefined')?'default-Valu':valu.toString()
	});
}

soup.dataFile="database.txt";
soup.dataFilename=function(name){
	name=(!name)?"database":name;
	return (soup.dataFile)?soup.localPath(soup.dataBase+soup.dataFile):soup.localPath(soup.dataBase+name+'.txt');
}
soup.dataMode="ie"; //use iexplorer activeX to store data as a txt file in project subfolder
//soup.dataMode="ax"; //use ajax to store data at mlab.com mongo database service


soup.dataLoad=function(dataDoc){
	//argument may be a dataDoc (or data record), with target id and default data or
	//a	string representing a target cell id of the cell for which data is requested.
	if (typeof(dataDoc)=='string') dataDoc=soup.dataDoc(dataDoc);
	//var fn=soup.localPath(soup.dataBase);
	var fn=soup.dataFilename(dataDoc['name']);
	if (soup.dataCache === null) {
		switch (soup.dataMode){
			case "ax":
				soup.dataCache=soup.axLoadFile(fn);
			break;
			case "ie":
				soup.dataCache=soup.ieLoadFile(fn);
			break;			
			default:
				soup.dataCache=soup.ieLoadFile(fn);
		}
	}
	if (soup.dataCache === null) {
		//file not found so create file
		var db={};
		db[dataDoc.name]=dataDoc;
		soup.dataCache=JSON.stringify(db);
		
		switch (soup.dataMode){
			case "ax":
				soup.axSaveFile(fn, soup.dataCache);
			break;
			case "ie":
				soup.ieSaveFile(fn, soup.dataCache);
			break;			
			default:
				soup.ieSaveFile(fn, soup.dataCache);
		}		
		//soup.ieSaveFile(fn, soup.dataCache);
		
	} else {
		//file found so extract name:value 
		var db=JSON.parse(soup.dataCache);
		if (typeof(db[dataDoc.name])=='undefined'){
			//name:value not found so add
			db[dataDoc.name]=dataDoc;
			soup.dataCache=JSON.stringify(db);
			
			switch (soup.dataMode){
				case "ax":
					soup.axSaveFile(fn, soup.dataCache);
				break;
				
				case "ie":
					soup.ieSaveFile(fn, soup.dataCache);
				break;			
				
				default:
					soup.ieSaveFile(fn, soup.dataCache);
			}			
			//soup.ieSaveFile(fn, soup.dataCache);
		} 
		else { dataDoc=db[dataDoc.name];}
	}
	return dataDoc;
}

soup.dataSave=function(dataDoc){
	
	if (typeof(dataDoc)=='string') dataDoc=soup.dataDoc(dataDoc);
	//Get text file contents which is a JSON of all cells
	//{name1:value1, name2:value2...}
	//var fn=soup.localPath(soup.dataBase);
	var fn=soup.dataFilename(dataDoc['name']);
	if (soup.dataCache === null){
		soup.dataCache=soup.ieLoadFile(fn);
		//soup.dataCache=soup.axLoadFile(fn);
	}
	if (soup.dataCache === null){
		//file not found so create file
		var db={}; 
		db[dataDoc.name]=cellArg;
		soup.dataCache=JSON.stringify(db);
		var r=soup.ieSaveFile(fn, soup.dataCache);
		//var r=soup.axSaveFile(fn, soup.dataCache);		
	} else {
		//file found so change value of name
		var db=JSON.parse(soup.dataCache);
		db[dataDoc.name]=dataDoc;
		soup.dataCache=JSON.stringify(db);
		var r=soup.ieSaveFile(fn, soup.dataCache);
		//var r=soup.axSaveFile(fn, soup.dataCache);
	}
	//return success of ieSaveFile()
	return r; 
}

////////////////////////////////////////////////////////




soup.docName=function() {
	var path=window.location.pathname; //eg c:/documents/folder/file.html
	var name=path.substring(path.lastIndexOf('/')+1); //eg file.html
	name=name.replace(/%20/g," ");
	return name.substring(0,name.lastIndexOf('.'));
}
	


/****************************************
IE file functions
Thanks tiddly-wiki
Returns null if it can't do it, false if there's an error, 
or a string of the content if successful
***************************************/

soup.ieCopyFile=function(dest, source){
	////////////////////////////
	// copyright tiddly-wiki
	this.ieCreatePath(dest);
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		fso.GetFile(source).Copy(dest);
	} catch(ex) {
		return false;
	}
	return true;
}

soup.ieCreatePath=function(path) {
	////////////////////////////
	// Copyright tiddly-wiki
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
	} catch(ex) {
		return null;
	}

	var pos = path.lastIndexOf("\\");
	if(pos==-1)
		pos = path.lastIndexOf("/");
	if(pos!=-1)
		path = path.substring(0,pos+1);

	var scan = [path];
	var parent = fso.GetParentFolderName(path);
	while(parent && !fso.FolderExists(parent)) {
		scan.push(parent);
		parent = fso.GetParentFolderName(parent);
	}

	for(var i=scan.length-1;i>=0;i--) {
		if(!fso.FolderExists(scan[i])) {
			fso.CreateFolder(scan[i]);
		}
	}
	return true;
}

soup.ieLoadFile=function(filePath){
	//////////////////////////
	// Copyright tiddly-wiki
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var file = fso.OpenTextFile(filePath, 1);
		var content = file.ReadAll();
		file.Close();
	} catch(ex) {
		//alert ("loadfile failed " + ex);
		return null;
	}
	
	return content;
}


soup.ieSaveFile=function(filePath, content){
	///////////////////////////
	// Copyright tiddly wiki
	this.ieCreatePath(filePath);
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
	} catch(ex) {
		return null;
	}
	var file = fso.OpenTextFile(filePath,2,-1,0);
	file.Write(content);
	file.Close();
	return true;
}
///////////////////////////////////////////

soup.edit=function(list, index, remove, ins){
	//similar to splice, which seems to be wonky in iexplorer
	if (Array.isArray(list)) {
		if (typeof ins=='undefined') ins=[];
		if (!Array.isArray(ins)) ins=[ins];
		if (typeof index != 'number') return list;
		if (typeof remove != 'number') return list;
		if (index <= 0){
			return(ins.concat(list.slice(remove)));
		} else if(index < list.length){			
			return (list.slice(0,index).concat(ins).concat(list.slice(index+remove)));		
		} else {
			return (list.concat(ins));		
		}
	}
}

	
///////////////////////////////////////////////////////////////
	
soup.isJpg=function(path){
	var ext=path.substring(path.lastIndexOf('.')+1); 
	if (ext.toUpperCase()=="JPG") return true;
	else return false;
}

soup.isPic=function(path){
	var r;
	var ext=path.substring(path.lastIndexOf('.')+1); 
	switch(ext.toUpperCase()){
		case "JPG":	r=true;	break;
		case "PNG":	r=true; break;
		default: r=false;
	}
	return r;
}
	
soup.localFileEnum=function(){
	/**********
	Returns an enumetration of local files 
	that is, files in same folder as the subject html file
	Works in IExplorer only
	ASiddeley 26-Sep-2015
	**********/
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var path=window.location.pathname; //eg c:/documents/folder/file.html
	var name=path.substring(path.lastIndexOf('/')+1); //eg file.html
	var dir=path.substring(1, path.lastIndexOf('/')); //eg c:/documents/folder
	//For line below, thanks http://bucarotechelp.com/design/jseasy/88012801.asp
	var spec = dir.replace(/\//g,"\\\\");
	spec = spec.replace(/%20/g," ");
	//alert(spec);
	var fo = fso.GetFolder(spec);
	var fe = new Enumerator(fo.files);
	return fe;
}
	
this.localPicArray=function(){
	var fe=soup.localFileEnum();
	var r=[];
	for(; !fe.atEnd(); fe.moveNext()){
		if( soup.isPic(fe.item().name)) r.push(fe.item().name);
	}
	//alert (r);
	return r;
}
	
soup.localPicItem=function(){return picItem;}

soup.localPath=function(name){
	var path=window.location.pathname; //eg c:/documents/folder/file.html
	var dir=path.substring(1, path.lastIndexOf('/'))+"/" + name; //eg c:/documents/folder
	var fn = dir.replace(/\//g,"\\\\");
	fn = fn.replace(/%20/g," ");
	return fn;
}


///////////////////////////////////////////////////////
// CELL
// Made with jQuery widget plug-in
// $('.cell').savable();
//
// NOTE: DO NOT USE '-' FOR ID NAMES, CELL WONT WORK.  USE '_' INSTEAD
// NOTE: Cell Ids cannot be Kebab-case, use snake_case or camelCase instead 

soup.cell=function(el){
	/**********
	Turns the provided element into a cell, I.e. savable and editable
	A cell has normally hidden heading and input fields as well as a normally showing result field.
	Cell text can be edited when the mouse is over it,
	*********/
	$(el).cell();
	return soup;
};


$.widget ("soup.cell", {
	
    options: {
		name: 'unnamed',
		text: 'default',
		xtxt: 'default', //existing text
		undo: [],
		idi: 'default',
		idr: 'default',
		idn: 'default'
	},
	
	
	_create:function() {
		this.options.name=this.element.attr("id");
		this.options.text=this.element.text();
		this.options.idi=this.options.name+'input';
		this.options.idr=this.options.name+'result';
		this.options.idn=this.options.name+'name';
		this.options=$.extend(this.options, soup.dataLoad(this.options));
		//this.styleRestore();		
		this._on( this.element, {
			dragstop:'stylingStop',
			resizestop:'stylingStop',
			mouseenter:'_highlight', 
			mouseleave:'_highlightoff' ,
			contextmenu:'_contextmenu'
			//click:'_contentEdit'
		});
		this.render();
    },
	

	_contextmenu:function(event) {
		//var c=window.getComputedStyle(this.element[0],null);
		//var c=this.element.data("ui-draggable"); //long running script
		//$("#dialog").dialog('open').html(soup.anything(c));
		//return false;
		//alert('Cell context menu');
		return false; //cancel other context menus
	},
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
	_highlight:function(event) {
		//this.element.css('background-color','silver'); 
		this.options.xtxt=$("#" + this.options.idi).val();
		//$("#"+this.options.idn).show();
		$("#"+this.options.idi).show().css({'position':'relative', 'z-index':10000, 'background':'silver'});
		$("#"+this.options.idr).hide();	
	},
	
	_highlightoff:function(event) {
		//this.element.css('background-color','white'); 
		var ntxt=$("#" + this.options.idi).val();
		//text has changed so 
		if( ntxt != this.options.xtxt) {
			//text changed so save
			ntxt=(ntxt=='')?'--':ntxt;
			this.options.undo.push(this.options.xtxt);
			if (this.options.undo.length > 10) {this.options.undo.shift();}
			this.options.text=ntxt;
			$("#"+this.options.idr).text(this._process(ntxt));	
			soup.dataSave(this.options);
		}
		//$("#"+this.options.idn).hide();
		$("#"+this.options.idi).hide();
		$("#"+this.options.idr).show();	
	},
	
	
	_process: function( valu ) {
		//check for and evaluate code in cell content
		if (valu.substr(0,1) == '=') {
			try{valu=eval(valu.substr(1));}
			catch(er){valu=er.toString();}
		}
        return valu;
    },
	
	render: function() {		
		//wrap text so it can be saved & edited
		//console.log('cell foreachItem:'+this.element.foreachItem); //undefined
		this.element.html(
			"<p id='"+ this.options.idn + "' style='display:none;' >"+ this.options.name +"</p>"+
			"<textarea id='"+this.options.idi+"' type='text' style='z-index=10001; "+
			"display:none;width:100%;height:auto;'"+
			"onclick='soup.autoHeight(this)' onkeyup='soup.autoHeight(this)' >"+
			this.options.text+
			"</textarea>"+
			"<p id='"+this.options.idr+"' class='cellresult'>"+
			this._process(this.options.text)+
			"</p>"	
		);
		//this._trigger( "refreshed", null, { text: this.options.text } );
    },
	
	result: function(){
		return this._process(this.options.text);
	},
	
    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) {
        this._super( options );
    },	
	
	
	styleGet:function(c){
		//return an object with only drag properties from a given object
		return	$.extend( { }, 
			{ 'position': c['position'] },
			{ 'left': c['left'] },
			//{ 'right': c['right'] },
			{ 'top': c['top'] },
			//{ 'bottom': c['bottom'] },
			{ 'height': c['height'] },
			{ 'width': c['width'] }
		);	
	},
	
	styleRestore:function(c){
		this.element.css(this.styleGet(this.options));
	},			
		
	stylingStop:function(event, ui){
		//save position
		var c=window.getComputedStyle(this.element[0],null);
		this.options=$.extend(this.options, this.styleGet(c));
		//console.log (soup.anything(this.options));
		soup.dataSave(this.options);
		//return false;
	}

});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// foreach 
// each

soup.idfix=function(el, suffix){
	var id=$(el).attr('id');
	$(el).attr('id', id + suffix);
	return soup; //to allow chaining
}

soup.idfixx=function(el, prefix, suffix){
	var id=$(el).attr('id');
	$(el).attr('id', prefix + id + suffix);
	return soup; //to allow chaining
}


$.widget("soup.foreach", {
	
	/******
	<div class='soup-foreach' soup-foreach='["a", "b", "c"]'>
	<p soup-action='$(this.child).text(this.index1)'>elements to be repeated</p>
	</div>
	child:	current new element eg: '<p>elements to be repeated</p>' then '<p>elements to be...
	index:	current loop count, eg: 0 then 1 then 2
	index1:	current loop count starting at 1, eg: 1 then 2 then 3
	item:	current loop argument eg: "a" then "b" then "c"
	
	TODO - MAKE IT WORK IN CASE WHERE FOREACH IS NESTED IN A FOREACH
	***/
	child: null, 
	index: 0, 
	index1: 1,
	item: 99, 
	template: '<div class="row"><p>item</p><p>desc</p><p>ref</p></div>',
	
	
	options: {
        name: 'foreach1',
		items: [1, 2, 3],
    },
	
	_create: function() {
		//read defaults from html tag/content
		this.template=this.element.html();
		this.options=$.extend(this.options,{
				name:this.element.attr('id'),
				items:eval(this.element.attr("soup-foreach")) //convert from string to array
			}		
		);

		this.options=$.extend(this.options, soup.dataLoad(this.options));
		this.refresh();
    },
	
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) {
        this._super( options );
        this.refresh();
    },

	items: function(arg, callback){
		switch (typeof arg) {
		case 'undefined': 
			return this.options.items;
			break;
		case 'object':
			if (Array.isArray (arg)) {
				console.log('foreach items changed');
				this.options.items=arg;
				soup.dataSave(this.options);
				this.refresh();
				if (typeof callback=='function') {
					for (var i=0; i<this.options.items.length; i++){
						//pass arguments: index, element
						callback(i, this.element.children(':nth-child('+ (i+1) +')'));
					}
				}
			} 			
			break;
		case 'string':
			if (arg=='max'){
				var r=0;
				this.options.items.forEach(function(i){r=(r<i)?i:r;});
				return r;
			}
			break;
		}
	},
	
	
    refresh: function() {
		var action, all, el, i, j;
		var newbies=-1; //number elements in template to be determined
		this.element.html(''); //clean slate
		for (i in this.options.items){
			this.index=i;
			this.index1=parseInt(i)+1;
			this.item=this.options.items[i];
			this.element.append(this.template);
			all=$(this.element).find('*');
			if (newbies == -1) newbies=all.length; 
			for (j=newbies;  j>0;  j--){
				this.child=all[ all.length-j ];
				el=all[ all.length-j ];
				action=$(el).attr('soup-action');
				//What about nested foreach's
				el.foreach=this;
				//el[this.name]=this; //to allow nested foreach
				el.foreachIndex=this.index;
				//el[this.name+'Index']=this.index; //to allow nested foreach
				el.foreachIndex1=this.index1;
				//el[this.name+'Index1']=this.index1; //to allow nested foreach
				el.foreachItem=this.item;
				//el[this.name+'Item']=this.item; //to allow nested foreach
				if (action) {
					try { eval( action ); } 
					catch(er) { console.log( er.toString() );}
				}
			}
			this._trigger("foreach-refresh", null, {'foreach':this} );
		};
   },


}); //widget

//////////////////////////////////////////////////////
// contextMenu

$.widget("soup.contextMenu", {

	hi:function(){alert('hello');},
	
	options:{	},
	
	_create: function(){
		$(this.element).hide();
		this.options.caller=null; //caller set by show()
	},
	
	caller:function( ){
		var  r=this.options.caller;
		if (arguments[0]=='foreach') {
			//r=$.data(this.options.caller,'foreach');
			r=this.options.caller.foreach;
		}
		else if (arguments[0]=='foreachItem') {
			//r=$.data(this.options.caller,'foreachItem');
			r=this.options.caller.foreachItem;			
		}
		else if (arguments[0]=='foreachIndex') {
			//r=$.data(this.options.caller,'foreachIndex');
			r=this.options.caller.foreachIndex;
		}
		else if (arguments[0]=='foreachIndex1') {
			//r=$.data(this.options.caller,'foreachIndex');
			r=this.options.caller.foreachIndex1;
		}
		return r;
	},
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
	hide:function(){
		$(this.element).hide();
	},

    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) { this._super( options );  },

	show: function(ev){
		//elmenu=$(elmenu);
		//soup.popdn=function(){ elmenu.hide(); }
		//soup._popcaller=caller;
		this.options.caller=ev.target;
		var left = ev.pageX + 5;
		var top = ev.pageY;
		if (top + this.element.height() >= $(window).height()) top -= this.element.height();
		if (left + this.element.width() >= $(window).width()) left -= this.element.width();
		this.element.show().css({zIndex:1001, left:left, top:top});
		return false;
	}
	
});

/////////////////////////////////////////////////////////
//
// pocket
soup.pocket=function(el){
	$(el).pocket();
	return soup;
};


$.widget("soup.pocket", {

	_template:'<div></div>',
	_imgpath:'',
	
	options:{
		name:'unnamed',
		file:{name:null},
		caption:'unnamed'
	},
	
	_create: function(){
		//this.options.caller=null;
		//this._template=this.element.html();
		this._imgpath=this.element.attr('soup-imgpath');
		this.options=$.extend(this.options,{
			name:this.element.attr('id')
		});

		this._on( this.element, {
			dragover:'_dragover',
			drop:'_dropimg'
		});
		this.options=$.extend(this.options, soup.dataLoad(this.options));
		this.refresh();
	},
	
	_dragover:function(event){
		//event.originalEvent.dataTransfer.effectAllowed = "link";
		//this.element.css(background,'pink');
	},


	_dropimg:function(event){
		//just get first file
		for (var p in event.originalEvent.dataTransfer.files[0]){
			console.log(p+':'+event.originalEvent.dataTransfer.files[0][p]);
		}
		this.options.file.name=event.originalEvent.dataTransfer.files[0].name;
		soup.dataSave(this.options);
		this.refresh();
	},
	
	_destroy: function() {
        //this.element.removeClass( "savable" ).text( "" );
    },
	
	refresh: function(){
		var s=(this.options.file.name!=null)?('src="./'+this._imgpath+this.options.file.name+'"'):' ';
		this.element.html('<img '+ s +' style="max-width:100%; max-height:100%;" >');
		//this.element.html('<img '+ s + '>');
		//console.log(this.element.html());
	},
	
	result: function(){return this._imgpath+this.options.file.name;},
	
    _setOption: function( key, valu ) {
       //if ( key === "valu" ) { valu = this._checkValu( valu );  }
       this._super( key, valu );
	},
	
	_setOptions: function( options ) { this._super( options );  },
	
});


soup.result=function(id){
	//returns the result from soup widget of given id
	//console.log('get returns:'+key);
	return $(id).cell('result')||$(id).pocket('result');
}



//apply widgets to elements of certain class

//to make foreach nestable, apply foreach widget in reverse order ie. bottom to top of selection

$(document).ready(function(){
	$(".soup-cell").cell();
	$(".soup-foreach").foreach();
	$(".soup-contextMenu").contextMenu();
	$(".soup-pocket").pocket();
});


console.log('SOUP.js loaded\n');




