#pragma strict
//@script RequireComponent(AudioSource)

var PickUpSounds : AudioClip[];
var Type : int;

var SpeedMaterial : Material; 
var FireMaterial  : Material; 
var BombMaterial  : Material; 

function Start () {   
    transform.localPosition.y -= 0.3;
}

function Update () {
	transform.RotateAroundLocal(Vector3(1,0,1),Time.deltaTime*5);
}

@RPC
function SetType(type:int) { 
	Debug.Log("PowerUp->SetType: " + type);
	Type = type;
	switch (Type) {
			case BonusType.Speed:  renderer.sharedMaterial = SpeedMaterial;  break;
			case BonusType.Fire:   renderer.sharedMaterial = FireMaterial;   break;
			case BonusType.Bomb:   renderer.sharedMaterial = BombMaterial;   break;
	}

}

@RPC
function Explode(){		
	AudioSource.PlayClipAtPoint(PickUpSounds[Random.Range(0,PickUpSounds.Length)], transform.position);
	if (networkView.isMine) Network.Destroy(gameObject);
}


function OnTriggerEnter (other : Collider) {

	AudioSource.PlayClipAtPoint(PickUpSounds[Random.Range(0,PickUpSounds.Length)], transform.position);
	
	if (other.tag == "Player"){
		switch(Type) {
			case BonusType.Speed:  other.GetComponent(PlayerBehaviour).PickUpBonus(1); break;
			case BonusType.Fire:   other.GetComponent(PlayerBehaviour).PickUpBonus(2); break;
			case BonusType.Bomb:   other.GetComponent(PlayerBehaviour).PickUpBonus(3); break;
		}
		if (networkView.isMine) Network.Destroy(gameObject);
		Debug.Log("powerup picked up: " + networkView.viewID + " type: " + Type);
	}
}