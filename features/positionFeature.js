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
	module: 	featurePosition
	desc: 
	author: 	Andrew Siddeley 
	started:	6-Apr-2017
	
****************************************************************/

define(
// load dependencies...
['babylon', 'jquery', 'features/ChooserFED'],

// then construct part object...
function(babylon, $, ChooserFED){
/***********
Returns a name feature getter (static method) wrapped in an object. 
A feature {} used by uiFeatures to edit and update babylon mesh properties.
The Feature getter is wrapped in an object so many features can be easily combined for each BIM entity / mesh
Feature structure...
	{label:'name', 
	valu:mesh.variable, 
	onFeatureChange:fn(ev,mesh,res){...}, 
	editor:featureEditor}
*/
var positionFeature = function(mesh){ 
	//Static function that returns a fresh feature {}, scoped to a particular mesh.
	//A feature is a hash used by FeaturesUI to edit and update babylon mesh properties.
	//Eg. {label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditor}
	
	return { 
		label:'position',
		desc:'A 3d vector rounded to the nearest 10 units',
		valu:mesh.position, 
		onValuChange:function(result){  mesh.position=result; },
		//onSubmit:function(valu){  mesh.position=valu; },
		editor:ChooserFED,
		choices:[
			{label:'random', 
				onChoose:function(ev){ 
					v=new babylon.Vector3(
						10*Math.floor(Math.random()*100), 
						10*Math.floor(Math.random()*100), 
						10*Math.floor(Math.random()*100)
					); 
					//show revised value
					//ev.data.valu$.val(v.toString() );
					//ev.data.valu=v;
					//trigger form submit with revised value
					//ev.data.submit();
					return v;
				}
			}, 
			{label:'zero',
				onChoose:function(ev){ 
					var v=new babylon.Vector3(0,0,0); 
					//ev.data.valu$.val(v);
					//ev.data.valu=v;
					//trigger form submit with revised value
					//ev.data.submit();
					return v;
				}
			}
		]	
	};
};

return positionFeature

});


