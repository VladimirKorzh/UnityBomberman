#pragma strict

var Timer = 0.0f;
var LerpTimer = 0.0f;
var EXPLODED = false;
var RPCEXPLODED = false;
var TimeToExplosion = 2.0f;
var TimeToImpassable = 1;
var BombExplosionPrefab          : GameObject;
var BlockExplosionPrefab         : GameObject;
var ExplosionFlameParticleEffect : GameObject;
var LinkedPlayer                 : GameObject;


function Start(){
	if (networkView.isMine) 
		Debug.LogError("I created bomb: " + networkView.viewID);	
}

function Update(){
	if(networkView.isMine && !EXPLODED){
	    Timer += 1 * Time.deltaTime;    
		if(Timer >= TimeToExplosion) {
				EXPLODED = true;		
				Explode(Vector3.zero);				
			}
		
		
		// user specific only
		if(Timer < TimeToImpassable) collider.enabled = false;
		else collider.enabled = true;
				
		renderer.material.color = Color.Lerp( Color.black, Color.white, LerpTimer);
		if (LerpTimer < 1){
			LerpTimer += Time.deltaTime/TimeToImpassable;
		}
		
		// debug helpers
		Debug.DrawLine(transform.position, transform.position+Vector3(1,0,0)*3,  Color.red);
		Debug.DrawLine(transform.position, transform.position+Vector3(-1,0,0)*3, Color.red);
		Debug.DrawLine(transform.position, transform.position+Vector3(0,0,1)*3,  Color.red);
		Debug.DrawLine(transform.position, transform.position+Vector3(0,0,-1)*3, Color.red);
		Debug.DrawLine(transform.position, transform.position+Vector3(0,1,0)*3,  Color.red);
		Debug.DrawLine(transform.position, transform.position+Vector3(0,-1,0)*3, Color.red);
	}
}

function LinkPlayer(Player: GameObject){
	LinkedPlayer = Player;
}

@RPC
function Explode(dir : Vector3){
	if (networkView.isMine && !RPCEXPLODED){
			Debug.LogError("Explode in: " + networkView.viewID);
			Debug.LogError("Expl come from: " + dir);
			RPCEXPLODED = true;
			EXPLODED = true;
     		LinkedPlayer.GetComponent(UserInterface).BombsList.Remove( gameObject );
			networkView.RPC("RPCDestroyBlock", RPCMode.All, transform.position);		    	    	    
		        	    
		        	    
	    
			if (dir!=Vector3(-1,0,0) ) ExplodeDir(Vector3(1,0,0));
			if (dir!=Vector3(1,0,0) ) ExplodeDir(Vector3(-1,0,0));
			if (dir!=Vector3(0,0,-1) ) ExplodeDir(Vector3(0,0,1));
			if (dir!=Vector3(0,0,1) ) ExplodeDir(Vector3(0,0,-1));
			if (dir!=Vector3(0,-1,0) ) ExplodeDir(Vector3(0,1,0));
			if (dir!=Vector3(0,1,0) ) ExplodeDir(Vector3(0,-1,0));		

			Debug.LogError("Bomb destroyed: " + networkView.viewID);							
		    Network.Destroy(gameObject);
		    
 	   	}		
}


function ExplodeDir(dir : Vector3){
    var hit : RaycastHit;
    var fire: GameObject;
	var FireLength = LinkedPlayer.GetComponent(UserInterface).getFireLength();         
    
    for (var i=1;i<=FireLength;i++){
    	if (Physics.Linecast(transform.position, transform.position+dir*i,hit)) {
		  		if (hit.collider.tag == "WoodBlock") {
//		    		Debug.Log("block hit");	
					networkView.RPC("RPCDestroyBlock", RPCMode.All, hit.collider.gameObject.transform.position);
				    hit.collider.gameObject.GetComponent(WoodBlockBehaviour).Explode();	 
					Network.Destroy(hit.collider.gameObject);
		  		}
		  		if ( hit.collider.tag == "PowerUp") { 
					Network.Destroy(hit.collider.gameObject);
//		    		Debug.Log("powerup hit");	
		  		}  		
		  		if (hit.collider.tag == "Bomb"){
		  			Debug.LogError("BOMB HIT IN: " + networkView.viewID + " Target: " + hit.collider.gameObject.networkView.viewID);
		  			Debug.LogError("Target EXPLODED Flag: " + hit.collider.gameObject.GetComponent(BombBehaviour).EXPLODED);
		  			if (!hit.collider.gameObject.GetComponent(BombBehaviour).EXPLODED)
		  				hit.collider.gameObject.networkView.RPC("Explode", RPCMode.All, dir);
		  		}	 	
	  
    		break;
    	}
    	else{
			networkView.RPC("RPCSpawnFire", RPCMode.All, transform.position+dir*i);   			

    	}		    
    }
}

@RPC
function RPCDestroyBlock(pos:Vector3){
//	Debug.Log("explosion animation rcvd");	
	Instantiate(BlockExplosionPrefab, pos, Quaternion.identity);
}

@RPC
function RPCSpawnFire(pos:Vector3){
//	Debug.Log("fire animation rcvd");	
	var fire = Instantiate(ExplosionFlameParticleEffect, pos,Quaternion.identity);
	Destroy(fire,0.8);
}
