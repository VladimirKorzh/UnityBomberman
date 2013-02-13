#pragma strict

var PowerUp      : GameObject;
var PowerUpChance = 0.7;

function Start () {
	
}

function Explode(){
	if (Random.value > 1 - PowerUpChance){
		Network.Instantiate(PowerUp, transform.position, transform.rotation,1);
	}
}