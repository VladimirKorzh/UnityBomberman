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
			obj.networkView.RPC("SetType", RPCMode.All, parseInt(BonusType.Speed) );   	
		}
		else if (rnd < 0.6){
			obj.networkView.RPC("SetType", RPCMode.All, parseInt(BonusType.Fire)); 
		}
		else {
			obj.networkView.RPC("SetType", RPCMode.All, parseInt(BonusType.Bomb)); 
		}	
	}
}