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

	
	project:	BIM United Feature & Function Collection (FC)
	module: 	material Feature
	by:		 	Andrew Siddeley 
	date:		18-Apr-2017
	
****************************************************************/

define(
// load dependencies...
['united/FeaturesUItext'],

// then construct part object...
function(FeaturesUItext){
	
var materialFeature=function(mesh){ 
	//Static function that returns a fresh feature {}, scoped to a particular mesh
	//A feature is a hash used by uiFeatures to edit and update babylon mesh properties like this...
	//{label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditor}
	return { 
		label:'Material',
		valu:mesh.material,
		editor:FeaturesUIchooseFn,
		onFeatureChange:function(revisedMaterial) {mesh.material=revisedMaterial;},
	};
};

return materialFeature;

});


