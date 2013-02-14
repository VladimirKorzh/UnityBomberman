#pragma strict
//@script RequireComponent(AudioSource)

var soundToPlay : AudioClip;
var Type : int;

var SpeedMaterial : Material; 
var FireMaterial  : Material; 
var BombMaterial  : Material; 

public enum PowerUp { 
	Speed = 1,
	Fire  = 2,
	Bomb  = 3
}

function Start () {   
    transform.localPosition.y -= 0.3;
}

function Update () {
	transform.RotateAroundLocal(Vector3(1,0,1),Time.deltaTime*5);
}

@RPC
function SetType(type:int) { 
	Type = type;
	switch (Type) {
			case PowerUp.Speed:  renderer.sharedMaterial = SpeedMaterial;  break;
			case PowerUp.Fire:   renderer.sharedMaterial = FireMaterial;   break;
			case PowerUp.Bomb:   renderer.sharedMaterial = BombMaterial;   break;
	}

}

function OnTriggerEnter (other : Collider) {
	if (other.tag == "Player"){
		switch(Type) {
			case PowerUp.Speed:  other.GetComponent(UserInterface).buffSpeedBuff();  break;
			case PowerUp.Fire:   other.GetComponent(UserInterface).buffFireLength(); break;
			case PowerUp.Bomb:   other.GetComponent(UserInterface).buffBombs();      break;
		}
		
		AudioSource.PlayClipAtPoint(soundToPlay, transform.position);
	
	Network.Destroy(gameObject);
	}
	else {
		Debug.Log("Wrong collider");
	}
}