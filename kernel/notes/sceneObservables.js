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

	
	project:	BIMsoup
	desc:		(B)uilding(I)nformation(M)odel
				(s)cript(o)riented(u)tility(p)ackage 
		
	module: 	module
	desc: 
	usage:

	by: 		Andrew Siddeley 
	started:	30-Dec-2016
	

    scene.onDisposeObservable
    scene.onBeforeRenderObservable
    scene.onAfterRenderObservable
    scene.onReadyObservable
    scene.onBeforeCameraRenderObservable
    scene.onAfterCameraRenderObservable
    scene.onNewCameraAddedObservable
    scene.onCameraRemovedObservable
    scene.onNewLightAddedObservable
    scene.onLightRemovedObservable
    scene.onNewGeometryAddedObservable
    scene.onGeometryRemovedObservable
    scene.onNewMeshAddedObservable
    scene.onMeshRemovedObservable
    scene.onPrePointerObservable
    scene.onPointerObservable
    layer.onDisposeObservable
    layer.onBeforeRenderObservable
    layer.onAfterRenderObservable
    material.onDisposeObservable
    material.onBindObservable
    baseTexture.onDisposeObservable
    renderTargetTexture.onAfterUnbindObservable
    renderTargetTexture.onBeforeRenderObservable
    renderTargetTexture.onAfterRenderObservable
    renderTargetTexture.onClearObservable
    abstractMesh.onDisposeObservable
    abstractMesh.onCollideObservable
    abstractMesh.onCollisionPositionChangeObservable
    abstractMesh.onAfterWorldMatrixUpdateObservable
    mesh.onBeforeRenderObservable
    mesh.onAfterRenderObservable
    mesh.onBeforeDrawObservable
    particleSystem.onDisposeObservable
    postProcess.onActivateObservable
    postProcess.onSizeChangedObservable
    postProcess.onApplyObservable
    postProcess.onBeforeRenderObservable
    postProcess.onAfterRenderObservable.
    spriteManager.onDisposeObservable
*/

define(
// load dependencies...
[],

// then do...
function(){
	
// abstract scene observables
return {
	
	'onDisposeObservable':function(){},
    'onBeforeRenderObservable':function(){},
    'onAfterRenderObservable':function(){},
    'onReadyObservable':function(){},
    'onBeforeCameraRenderObservable':function(){},
    'onAfterCameraRenderObservable':function(){},
    'onNewCameraAddedObservable':function(){},
    'onCameraRemovedObservable':function(){},
    'onNewLightAddedObservable':function(){},
    'onLightRemovedObservable':function(){},
    'onNewGeometryAddedObservable':function(){},
    'onGeometryRemovedObservable':function(){},
    'onNewMeshAddedObservable':function(){},
    'onMeshRemovedObservable':function(){},
    'onPrePointerObservable':function(){},
    'onPointerObservable':function(){}
};

});


