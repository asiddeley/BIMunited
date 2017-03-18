# BIM United FC
* BIM is Building Information Modelling
* FC is Function Collection

Andrew Siddeley 
16-Mar-2017

## BIM United FC is
* Designed for use in Architecture, Buildings, Construction, Design and Engineering
* Provides means for administrating, browsing, creating, databasing (locally or externally) and editing a babylon scene 
* Written in javascript and built around the Babylon JS library
* Extends scene and mesh objects with a rich variety of powerful functions
* Project is versioned with Git and on maintained on GitHub


## Javascript Libraries included
Library | Functionality
--- | ---
bootstrap|HTML user interface 
jquery |module extension, UI widgetry and DOM
node js|local database conectivity
mongodb|non SQL database for local storage
require|module management of project

## Analogues
<table><tr><td>BIM</td><td>Babylon</td></tr> |
--- | ---
model| scene
part | mesh (with added bim handler)
tool | actionManager
ui   | debug layer
</table>

## Usage
BIM united has five steps to get going; also known as the a.b.c.d.e functions shown below. 
```HTML
<script>
BIM.admin('username');
BIM.board(document.getElementById('myblackboard'));
BIM.canvas(document.getElementById('myCanvas'));
BIM.database('dbaccessAPI');
BIM.engage(optionsObject);

// OR chained together thus 
BIM.admin().board().canvas().database().engage();

// Note that leaving out arguments defaults to factory settings


</script>



```






