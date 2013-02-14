#pragma strict

var FireLength       : int;
var SpeedBuff        : int;
var currmaxBombCount : int;
var maxBombCount     = 5;
var maxFireLength    = 7;
var maxSpeedBuff     = 7;

var colorChoices : Color[];

var Bomb  : GameObject;

var BombsList: Array = Array();


function Start() {
    Screen.lockCursor = true;
	if(networkView.isMine){    
	    Camera.mainCamera.GetComponent(SmoothFollow).target = gameObject.transform;
	    gameObject.Find("Ice Golem").renderer.material.color = colorChoices[Random.Range(0, (colorChoices.length)) ];
	}
}

function Update () {	
	if (Input.GetKeyDown(KeyCode.Escape)){
		Screen.lockCursor = !Screen.lockCursor;
	}	
	if(networkView.isMine){
		if (Input.GetKeyDown(KeyCode.E)) PlaceBomb();
	}
}

function PlaceBomb(){
	if (BombsList.Count < currmaxBombCount){
//	    var newpos = transform.position + Vector3(0, 0.65, 0);
	    
	    var currentPos = transform.position;
	    var newpos = Vector3(Mathf.Round(currentPos.x),
                             		 currentPos.y + 0.4,
                             		 Mathf.Round(currentPos.z));
	    	    
	    var boom = Network.Instantiate(Bomb, newpos, Quaternion.identity,1);
	    boom.GetComponent(BombBehaviour).LinkPlayer(gameObject);
	    BombsList.Add( boom );	    
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


//function DestroyBlock(hit : RaycastHit){
//	if (hit.collider.tag == "WoodBlock") {
//		Destroy(hit.collider.gameObject);
//	}
//}
//function PlaceBlock(hit : RaycastHit){
//	if (hit.collider.tag == "WoodBlock"){	    
//	    var newpos = hit.normal + hit.transform.position;
//	    Instantiate (WoodenBlock, newpos, Quaternion.identity);
//    }
//}	