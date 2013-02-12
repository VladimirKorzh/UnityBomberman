#pragma strict

var Timer = 0.0f;
var EXPLODED = false;
var TimeToExplosion = 2.0f;

var BombExplosionPrefab : GameObject;
var BlockExplosionPrefab : GameObject;
var ExplosionFlameParticleEffect : GameObject;

function Update(){
    Timer += 1 * Time.deltaTime;
    
	if(Timer >= TimeToExplosion)
	{
		Explode();
	}

}

function Explode(){
		if (!EXPLODED){
			EXPLODED = true;
			     		
		    Instantiate(BombExplosionPrefab, transform.position, transform.rotation);
		    	    	    
			ExplodeDir(Vector3(1,0,0));
			ExplodeDir(Vector3(-1,0,0));
			ExplodeDir(Vector3(0,0,1));
			ExplodeDir(Vector3(0,0,-1));
			ExplodeDir(Vector3(0,1,0));
			ExplodeDir(Vector3(0,-1,0));						
		    
 	   	}
		Destroy(gameObject);
}


function ExplodeDir(dir : Vector3){
    var hit : RaycastHit;
    var fire: GameObject;
	var playerObject = GameObject.Find("Player");
	var FireLength = playerObject.GetComponent(UserInterface).getFireLength();     
    Debug.Log("FireLength: " + FireLength);
    
    
    for (var i=1;i<=FireLength;i++){
    	if (Physics.Linecast(transform.position, transform.position+dir*i,hit)) {
    		DestroyBlock(hit);  			  
    		break;
    	}
    	else{
    		fire = Instantiate(ExplosionFlameParticleEffect, transform.position+dir*i,Quaternion.identity);
   			Destroy(fire,0.8);
    	}		    
    }
}

function DestroyBlock(hit:RaycastHit){
//  		Debug.Log(hit.collider.tag + " got hit by a bomb explosion at: " + hit.transform.position + " Normal: " + hit.normal);
  		if (hit.collider.tag == "WoodBlock") {
		    Instantiate(BlockExplosionPrefab, hit.transform.position, hit.transform.rotation);
		    hit.collider.gameObject.GetComponent(WoodBlockBehaviour).Explode();	 
			Destroy(hit.collider.gameObject);
  		}
  		if (hit.collider.tag == "Bomb"){
  			hit.collider.gameObject.GetComponent(BombBehaviour).Explode();
  		}
  		if (hit.collider.tag == "MainCamera"){
  			Debug.Log("Player died");
  		}
  		  		
}