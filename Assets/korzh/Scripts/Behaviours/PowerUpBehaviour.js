#pragma strict
//@script RequireComponent(AudioSource)

var materials : Material[];

var pickupSound : AudioClip[];
var soundToPlay : AudioClip;

enum POWERUP{
	Speed = 0,
	Fire  = 1,
	Bomb  = 2
}
var type : int;

function Start () {
    if (materials.Length == 0) // do nothing if no materials
        return;
       
    soundToPlay = pickupSound[0];    
    transform.localPosition.y -= 0.3;
	var rnd = Random.value; 
	if (rnd < 0.3){
		renderer.sharedMaterial = materials[POWERUP.Speed];
		type = POWERUP.Speed;
	}
	else if (rnd < 0.6){
		renderer.sharedMaterial = materials[POWERUP.Fire];
		type = POWERUP.Fire;
	}
	else {
		renderer.sharedMaterial = materials[POWERUP.Bomb];
		type = POWERUP.Bomb;	
	}
}

function Update () {
	transform.RotateAroundLocal(Vector3(1,0,1),Time.deltaTime*5);
}

function OnTriggerEnter (other : Collider) {

	var playerObject = GameObject.Find("Player");

	switch(type) {
		case POWERUP.Speed: playerObject.GetComponent(UserInterface).buffSpeedBuff();  break;
		case POWERUP.Fire:  playerObject.GetComponent(UserInterface).buffFireLength(); break;
		case POWERUP.Bomb:  playerObject.GetComponent(UserInterface).buffBombs(); break;
		}
	
	AudioSource.PlayClipAtPoint(soundToPlay, transform.position);
	Destroy(gameObject);
}