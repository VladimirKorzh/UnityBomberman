#pragma strict

var PowerUp      : GameObject;
var PowerUpChance = 0.7;


@RPC
function Explode(){
	if (Random.value > 1 - PowerUpChance){
		Debug.Log("spawned powerup");	
		var obj = Network.Instantiate(PowerUp, transform.position, transform.rotation,1);
		var rnd = Random.value;
		if (rnd < 0.3){
			obj.networkView.RPC("SetType", RPCMode.All, 1);   	
		}
		else if (rnd < 0.6){
			obj.networkView.RPC("SetType", RPCMode.All, 2); 
		}
		else {
			obj.networkView.RPC("SetType", RPCMode.All, 3); 
		}	
	}
}