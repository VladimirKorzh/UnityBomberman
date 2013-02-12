#pragma strict
//@script RequireComponent(AudioSource)

var materials : Material[];
var type : String;
var pickupSound : AudioClip[];
var soundToPlay : AudioClip;
function Start () {
    if (materials.Length == 0) // do nothing if no materials
        return;
    soundToPlay = pickupSound[0];    
        
	if (Random.value > 0.5){
		renderer.sharedMaterial = materials[0];
		type = "SpeedBuff";
	}
	else{
		renderer.sharedMaterial = materials[1];
		type = "FireLength";
	}
}

function Update () {
	transform.RotateAroundLocal(Vector3(1,0,1),Time.deltaTime);
}

function OnTriggerEnter (other : Collider) {

	var playerObject = GameObject.Find("Player");

	if (type == "SpeedBuff"){
		playerObject.GetComponent(UserInterface).buffSpeedBuff();
	}
	if(type=="FireLength"){
		playerObject.GetComponent(UserInterface).buffFireLength();
	}
	
	Debug.Log("S:"+playerObject.GetComponent(UserInterface).getSpeedBuff() + " F: " + playerObject.GetComponent(UserInterface).getFireLength());
	GetComponent(MeshRenderer).enabled = false;
	AudioSource.PlayClipAtPoint(soundToPlay, transform.position);
	Destroy(gameObject);
}