#pragma strict

//static var BombCount  : int = 1;
//static var FireLength : int = 1;
//static var SpeedBuff  : int = 2;
var FireLength : int;
var SpeedBuff  : int;
var currmaxBombCount : int;
var maxBombCount = 5;

var maxFireLength = 7;
var maxSpeedBuff = 7;

var WoodenBlock : GameObject;
var Bomb  : GameObject;

var BombsList: Array = Array();



function Start() {
    Screen.lockCursor = true;
}

function Update () {
	var hit : RaycastHit;
		
	if (Input.GetKeyDown(KeyCode.Escape)){
		Screen.lockCursor = !Screen.lockCursor;
	}	
//	if (Input.GetKeyDown(KeyCode.Q)){
//		Debug.Log(BombsList.Count);
//	}
	
    if (Input.GetButtonDown("Fire1") || Input.GetButtonDown("Fire2") || Input.GetKeyDown(KeyCode.LeftShift)){
		if (Physics.Raycast(transform.position, transform.forward, hit)){
			if (Input.GetButtonDown("Fire1")) PlaceBlock(hit);
			else if (Input.GetButtonDown("Fire2")) DestroyBlock(hit);
			else if (Input.GetKeyDown(KeyCode.LeftShift)) PlaceBomb(hit);
		}
    }    
}

function PlaceBlock(hit : RaycastHit){
	if (hit.collider.tag == "WoodBlock"){	    
	    var newpos = hit.normal + hit.transform.position;
	    Instantiate (WoodenBlock, newpos, Quaternion.identity);
    }
}	
function PlaceBomb(hit : RaycastHit){
	if (hit.collider.tag != "Bomb" && hit.collider.tag != "PowerUp" && BombsList.Count < currmaxBombCount){
	    var newpos = hit.normal + hit.transform.position;
	    var boom = Instantiate(Bomb, newpos, Quaternion.identity);
	    BombsList.Add( boom );
    }
}	
function DestroyBlock(hit : RaycastHit){
	if (hit.collider.tag == "WoodBlock") {
		Destroy(hit.collider.gameObject);
	}
}


function buffBombs(){
	if (currmaxBombCount < maxBombCount) currmaxBombCount+=1;	
}

function buffFireLength(){
	if (FireLength < maxFireLength) FireLength+=1;
}

function buffSpeedBuff(){
	if (SpeedBuff < maxSpeedBuff) SpeedBuff+=1;
}

function getFireLength(){
	return FireLength;
}
function getSpeedBuff(){
	return SpeedBuff;
}
function getBombCountCurrent(){
	return BombsList.Count;
}
function getBombCount(){
	return currmaxBombCount;
}