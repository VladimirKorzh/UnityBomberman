#pragma strict

var StoneBlock   : GameObject;
var WoodenBlock  : GameObject;

var playerPrefab : GameObject;
var spawnObject  : Transform;


function CreateDebugLevel () {
	
	var Xnum : int = 15;
	var Ynum : int = 11;	
	var newpos = Vector3(0,0,0);
	
	// layer one
	for(var i=0; i<Xnum; i++){
		for (var j=0; j<Ynum; j++){			
			if (i==0 || i == Xnum-1 || j==0 || j== Ynum-1) {
				newpos = Vector3(i,1,j);
				Network.Instantiate (StoneBlock, newpos, Quaternion.identity,0);
			}
			newpos = Vector3(i,0,j);
			Network.Instantiate (StoneBlock, newpos, Quaternion.identity,0);			
		}
	}
	
	// layer two
	for(i=1; i<Xnum-1; i+=1){
		for (j=1; j<Ynum-1; j+=1){			
			newpos = Vector3(i,1,j);
			if (i%2==0 && j%2==0){			
				Network.Instantiate (StoneBlock, newpos, Quaternion.identity,0);

			}	
			else{
				if( Random.value > 0.4) {				
					Network.Instantiate (WoodenBlock, newpos, Quaternion.identity,0);			
				}			
			}
		}
	}	
}

function spawnPlayer(){
	Network.Instantiate(playerPrefab, spawnObject.position, Quaternion.identity,0);
}
