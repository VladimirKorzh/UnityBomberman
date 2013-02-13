#pragma strict

var Timer = 0.0f;
var EXPLODED = false;
var TimeToExplosion = 2.0f;

var BombExplosionPrefab : GameObject;
var BlockExplosionPrefab : GameObject;
var ExplosionFlameParticleEffect : GameObject;
var LinkedPlayer : GameObject;

function Update(){
    Timer += 1 * Time.deltaTime;
    
	if(Timer >= TimeToExplosion)
	{
		Explode();
	}

}
function LinkPlayer(Player: GameObject){
	LinkedPlayer = Player;
}

function Explode(){
		if (!EXPLODED){
			EXPLODED = true;
     		LinkedPlayer.GetComponent(UserInterface).BombsList.Remove( gameObject );
			networkView.RPC("RPCDestroyBlock", RPCMode.All, transform.position);		    	    	    
		    	    	    
			ExplodeDir(Vector3(1,0,0));
			ExplodeDir(Vector3(-1,0,0));
			ExplodeDir(Vector3(0,0,1));
			ExplodeDir(Vector3(0,0,-1));
			ExplodeDir(Vector3(0,1,0));
			ExplodeDir(Vector3(0,-1,0));						
		    
 	   	}
		Network.Destroy(gameObject);
}


function ExplodeDir(dir : Vector3){
    var hit : RaycastHit;
    var fire: GameObject;
	var FireLength = LinkedPlayer.GetComponent(UserInterface).getFireLength();         
    
    for (var i=1;i<=FireLength;i++){
    	if (Physics.Linecast(transform.position, transform.position+dir*i,hit)) {
    		DestroyBlock(hit);  			  
    		break;
    	}
    	else{
			networkView.RPC("RPCSpawnFire", RPCMode.All, transform.position+dir*i);   			
   			Debug.Log("empty space");
    	}		    
    }
}

@RPC
function RPCDestroyBlock(pos:Vector3){
	Instantiate(BlockExplosionPrefab, pos, Quaternion.identity);
}

@RPC
function RPCSpawnFire(pos:Vector3){
	var fire = Instantiate(ExplosionFlameParticleEffect, pos,Quaternion.identity);
	Destroy(fire,0.8);
}


function DestroyBlock(hit:RaycastHit){

  		if (hit.collider.tag == "WoodBlock") {
			networkView.RPC("RPCDestroyBlock", RPCMode.All, hit.collider.gameObject.transform.position);
		    hit.collider.gameObject.GetComponent(WoodBlockBehaviour).Explode();	 
			Network.Destroy(hit.collider.gameObject);
  		}
  		if (hit.collider.tag == "PowerUp") { 
			Network.Destroy(hit.collider.gameObject);
  		}  		
  		if (hit.collider.tag == "Bomb"){
  			hit.collider.gameObject.GetComponent(BombBehaviour).Explode();
  		}	
}