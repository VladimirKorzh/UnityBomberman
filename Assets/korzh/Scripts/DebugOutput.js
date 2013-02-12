#pragma strict
var playerObject : GameObject;
function Start () {
	playerObject = GameObject.Find("Player");	
	guiText.material.color = Color.blue;
}

function Update () {	
	guiText.text = "Fire: " + playerObject.GetComponent(UserInterface).getFireLength() + " BombsCount: " + playerObject.GetComponent(UserInterface).getBombCountCurrent() + "/"+ playerObject.GetComponent(UserInterface).getBombCount() + " Speed: " + playerObject.GetComponent(UserInterface).getSpeedBuff();
}