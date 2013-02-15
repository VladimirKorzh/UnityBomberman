#pragma strict

var Timer = 0.0f;
var LerpTimer = 0.0f;
var Exploded = false;
var TimeToExplosion = 2.0f;
var TimeToImpassable = 1;
var BombExplosionPrefab          : GameObject;
var BlockExplosionPrefab         : GameObject;
var ExplosionFlameParticleEffect : GameObject;
var LinkedPlayer                 : GameObject;


function Start(){
	if (networkView.isMine) 
		Debug.Log("I created bomb: " + networkView.viewID + " at: " + transform.position);	
}

function Update(){
	if(networkView.isMine){
	    Timer += 1 * Time.deltaTime;    
	    	    
		if(Timer >= TimeToExplosion) {	
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
	//if (networkView.isMine && !Exploded){
	if (networkView.isMine){
			Exploded = true;
			Debug.Log("Explode in: " + networkView.viewID);
			Debug.Log("Expl come from: " + dir);
			
     		LinkedPlayer.GetComponent(PlayerBehaviour).PlacedBombsList.Remove( gameObject );
    		 		        	    
			//explode self
    		networkView.RPC("RPCSpawnFire", RPCMode.All, transform.position);  
			
			var selfCollision = Physics.OverlapSphere(transform.position,0.3,(1 << 9));
			for (var i=0;i<selfCollision.Length;i++){
				if (selfCollision[i].collider.tag == "Player"){
					Debug.Log("Player was standing on the bomb");
					selfCollision[i].collider.gameObject.networkView.RPC("Kill", RPCMode.All);
				}
			}
	    
			if (dir!=Vector3(-1,0,0) ) ExplodeDir(Vector3(1,0,0));
			if (dir!=Vector3(1,0,0) ) ExplodeDir(Vector3(-1,0,0));
			if (dir!=Vector3(0,0,-1) ) ExplodeDir(Vector3(0,0,1));
			if (dir!=Vector3(0,0,1) ) ExplodeDir(Vector3(0,0,-1));
			
			// up down disabled for now
//			if (dir!=Vector3(0,-1,0) ) ExplodeDir(Vector3(0,1,0));
//			if (dir!=Vector3(0,1,0) ) ExplodeDir(Vector3(0,-1,0));		

			Debug.Log("Bomb destroyed: " + networkView.viewID);							
		    Network.Destroy(gameObject);
		    
 	   	}		
}

    
function ExplodeDir(dir : Vector3){
    var hit : RaycastHit;
    var colliders : Collider[];
    var fire: GameObject;
    var ExplosionSphereRadius = 0.3;
	var FireLength = LinkedPlayer.GetComponent(PlayerBehaviour).Fire;         
    
    for (var i=1;i<=FireLength;i++){    	
    	if (Physics.Linecast(transform.position, transform.position+dir*i,hit, (1 << 8))) {    
    		if (hit.collider.tag == "StoneBlock") break;
    		
    		networkView.RPC("RPCSpawnFire", RPCMode.All, transform.position+dir*i);   
    			
	  		if (hit.collider.tag == "WoodBlock") {
			    hit.collider.gameObject.GetComponent(WoodBlockBehaviour).Explode();	 
				Network.Destroy(hit.collider.gameObject);
	  		}
	  		
	  		if ( hit.collider.tag == "PowerUp") { 
				Network.Destroy(hit.collider.gameObject);
	  		}  		
	  		
	  		if (hit.collider.tag == "Bomb"){	  			
	  			if (hit.collider.gameObject.networkView.isMine){
	  				Debug.Log("BOMB IS MINE: " + networkView.viewID + " Target: " + hit.collider.gameObject.networkView.viewID);
	  			 	hit.collider.gameObject.GetComponent(BombBehaviour).Explode(dir);		  			
  			 	}
	  			else {
	  				Debug.Log("BOMB NOT MINE: " + networkView.viewID + " Target: " + hit.collider.gameObject.networkView.viewID);
	  				hit.collider.gameObject.networkView.RPC("Explode", RPCMode.All, dir);		
	  				}
	  		}	 
	  				
    		break;
    	}
    	else {
    		colliders = Physics.OverlapSphere(transform.position+dir*i,ExplosionSphereRadius, (1 << 9) ) ;
    		networkView.RPC("RPCSpawnFire", RPCMode.All, transform.position+dir*i);   	
    		
			for (var j=0;j<colliders.Length;j++){				
				if (colliders[j].collider.tag == "Player"){
					Debug.Log("Player got hit by bomb explosion");
					colliders[j].collider.gameObject.networkView.RPC("Kill", RPCMode.All);
				}			
			}    		    		
    	}
    }
}    
    
    
   

@RPC
function RPCDestroyBlock(pos:Vector3){
	Debug.Log("explosion animation rcvd: " +  pos);	
	var expl =  Instantiate(BlockExplosionPrefab, pos, Quaternion.identity);
	Destroy(expl, 1);
}

@RPC
function RPCSpawnFire(pos:Vector3){
//	Debug.Log("fire animation rcvd");	
	var fire = Instantiate(ExplosionFlameParticleEffect, pos,Quaternion.identity);
	Destroy(fire, 1);
}
