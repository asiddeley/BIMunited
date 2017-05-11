/************************************************************
	license:
	
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

	
	project:	BIM united FC (Framework Concept)
	module: 	part
	desc: 
	author: 	Andrew Siddeley 
	started:	26-Feb-2017
	
****************************************************************/

define(
// load dependencies...
['features/textFC'],

// then construct part object...
function(textFC){
	
var nameFeature=function(mesh){ 
	//Static function that returns a fresh name feature {}, scoped to a particular mesh
	//A feature is a hash used by uiFeatures to edit and update babylon mesh properties
	//and looks like this...
	//{label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditor}
	return { 
		label:'Name',
		prop:mesh.name,
		propToBe:null,
		propUpdater:function(result){mesh.name=result;},
		control:textFC
	};
};

return nameFeature;

});


