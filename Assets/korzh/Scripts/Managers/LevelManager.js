//#pragma strict

var StoneBlock   : GameObject;
var WoodenBlock  : GameObject;
var FloorBlock   : GameObject;

var playerPrefab : GameObject;

var newpos:Vector3 = Vector3.zero;

var Xnum:int;
var Ynum:int;
var Znum:int;

var map : int[,,];


enum Cell {
	Empty = 0,
	Wood  = 1,
	Stone = 2,
	Floor = 3
}

var SpawnPos: Array = new Array();



function CreateEmptyMap(_Xnum:int, _Ynum:int, _Znum:int){
	Xnum = _Xnum;
	Ynum = _Ynum;
	Znum = _Znum;
 	
 	map = new int[Xnum, Ynum, Znum];
}

function CreateCascade(){
	for(var i=0; i<Xnum; i++){
		for (var j=0; j<Znum; j++){			
			if (i==0 || i == Xnum-1 || j==0 || j== Znum-1) {
				map[i,0,j] = Cell.Stone;
				map[i,1,j] = Cell.Stone;
				continue;
			}
			map[i,0,j] = Cell.Floor; 		
		}
	}
}

function CreateStandardGrid(){
	for(i=1; i<Xnum-1; i+=1){
		for (j=1; j<Znum-1; j+=1){			
			if (i%2==0 && j%2==0){			
				map[i,1,j] = Cell.Stone;
			}	
			else{		
			  	if( Random.value > 0.4) {	
					map[i,1,j] = Cell.Wood;			
				}			
			}
		}
	}
}

function MapInstantiate(){
	for(var y=0; y<Ynum; y++){
		for(var i=0; i<Xnum; i++){
			for (var j=0; j<Znum; j++){	
				switch (map[i,y,j]){
					case Cell.Wood:  Network.Instantiate (WoodenBlock, Vector3(i,y,j), Quaternion.identity,0); break;
					case Cell.Stone: Network.Instantiate (StoneBlock, Vector3(i,y,j), Quaternion.identity,0); break;					
					case Cell.Floor: Network.Instantiate (FloorBlock, Vector3(i,y,j), Quaternion.identity,0); break;
				}
			}
		}	
	}
}

function CreateDebugLevel () {

	CreateEmptyMap(15,2,11);
	CreateCascade();	
	CreateStandardGrid();
	
	CreateSpawnPos(Vector3(Xnum-2,1,Znum-2));
	CreateSpawnPos(Vector3(Xnum-2,1,1));
	CreateSpawnPos(Vector3(1,1,Znum-2));
	CreateSpawnPos(Vector3(1,1,1));		
				
	MapInstantiate();
			
}

function CreateSpawnPos(pos: Vector3){
	SpawnPos.Add(pos);
	if (map[pos.x,pos.y,pos.z]   != Cell.Stone) map[pos.x,pos.y,pos.z] 		 = Cell.Empty;	
	if (pos.z+1 < Znum)
		if (map[pos.x,pos.y,pos.z+1] != Cell.Stone) map[pos.x,pos.y,pos.z+1] = Cell.Empty;	
	if (pos.z-1 > 0)	
		if (map[pos.x,pos.y,pos.z-1] != Cell.Stone) map[pos.x,pos.y,pos.z-1] = Cell.Empty;	
	if (pos.x+1 < Xnum)
		if (map[pos.x+1,pos.y,pos.z] != Cell.Stone) map[pos.x+1,pos.y,pos.z] = Cell.Empty;	
	if (pos.x-1 > 0)
		if (map[pos.x-1,pos.y,pos.z] != Cell.Stone) map[pos.x-1,pos.y,pos.z] = Cell.Empty;		
}


function spawnPlayer(pos:Vector3){
	Network.Instantiate(playerPrefab, pos, Quaternion.identity,0).networkView.RPC("Repaint", RPCMode.AllBuffered, Network.player);
}
