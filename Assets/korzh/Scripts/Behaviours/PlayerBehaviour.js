#pragma strict

var isDead = false;

var maxBomb  :int   = 5;
var maxFire  :int   = 7;
var maxSpeed :float   = 7;

var SpeedBonusWeight :float = 0.5;
var jumpSpeed : float = 8.0; 
var gravity : float = 20.0;

var Fire  = 1;
var Speed : float = 2.0f;
var Bomb = 1;
var canJump = false;

var PlacedBombsList = Array();	

public enum BonusType { 
	Speed = 1,
	Fire  = 2,
	Bomb  = 3
}

var sm : GameObject;
var goBomb : GameObject;
private var moveDirection : Vector3 = Vector3.zero;
private var controller : CharacterController;




function Start(){
	if(networkView.isMine){ 
		// set the camera to follow this object
	    Camera.mainCamera.GetComponent(SmoothFollow).target = gameObject.transform;
	    Camera.mainCamera.transform.position.x = 7f;
	    Camera.mainCamera.transform.position.y = 10.77f;
	    Camera.mainCamera.transform.position.z = 5f;	    
	    Camera.mainCamera.transform.LookAt(Vector3(7,1,5));

	   	// create an abstract color difference between players

	    controller = GetComponent(CharacterController);
		sm = GameObject.Find("SceneManager");	    
    }
    else {    
    	enabled = false;
    }
}


function PickUpBonus(type: BonusType){
	switch (type) {
		case BonusType.Speed: if (Speed < maxSpeed) Speed+=SpeedBonusWeight; break;
		case BonusType.Fire:  if (Fire < maxFire)   Fire +=1;                break;
		case BonusType.Bomb:  if (Bomb < maxBomb)   Bomb +=1;            	 break;
	}
	Debug.Log("Player now has -> S:"+Speed+" B:"+Bomb+" F:"+Fire);
}

function PlaceBomb(){
	if (PlacedBombsList.Count < Bomb){	    
	    var currentPos = transform.position;
	    var newpos = Vector3(Mathf.Round(currentPos.x),
                             		 currentPos.y + 0.4,
                             		 Mathf.Round(currentPos.z));
                             		 
                             		 		
		var colliders = Physics.OverlapSphere(newpos,0.35, (1 << 8) ) ;
		  	
		for (var j=0;j<colliders.Length;j++){		
			Debug.Log(colliders[j].collider.tag);			
			if (colliders[j].collider.tag == "Bomb"){
				Debug.Log("Can't place bomb here, there is one already.");
				return;
			}			
		}   	
		
		
		if (PlacedBombsList.length > 0) 
		if ((PlacedBombsList[PlacedBombsList.length-1] as GameObject).transform.position == newpos) {
			Debug.Log("You have just placed a bomb there.");
	    	return;
		}
		
	    var boom = Network.Instantiate(goBomb, newpos, Quaternion.identity,1);
	    
	    boom.GetComponent(BombBehaviour).LinkPlayer(gameObject);
	    PlacedBombsList.Add( boom );	    
    }
}
	



function UpdateMovement() {   
    if (controller.isGrounded) {
        // We are grounded, so recalculate move direction directly from axes
        moveDirection = Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
                                
        if (moveDirection != Vector3.zero) {
            var rotation = transform.rotation; 
            rotation.SetLookRotation(moveDirection); 
            transform.rotation = rotation;
        }
        
        moveDirection *= Speed;
        
        if (Input.GetButton ("Jump")) {
            moveDirection.y = jumpSpeed;
        }
    }

    // Apply gravity
    moveDirection.y -= gravity * Time.deltaTime;
    
    // Move the controller
    controller.Move(moveDirection * Time.deltaTime);
}

function UpdateAnimations(){
	if (!isDead) { 
		if (!controller.isGrounded) {
			networkView.RPC("PlayMovementAnimation", RPCMode.All, "jump");
		} 
		else	
		{    
	    	if (Input.GetAxis("Horizontal") != 0 || Input.GetAxis("Vertical") != 0){
	    	
				if ( Speed < 4) {		
					networkView.RPC("PlayMovementAnimation", RPCMode.All, "walk");
				}
				else 
				{ 
					networkView.RPC("PlayMovementAnimation", RPCMode.All, "run");
				}
				
	    	} 
	    	else 
	    	{
				networkView.RPC("PlayMovementAnimation", RPCMode.All, "idle");
			}	      	    
	    }
    }
	else {
		networkView.RPC("PlayMovementAnimation", RPCMode.All, "death");
	}
}

function UpdateControls(){
	if (Input.GetKeyDown(KeyCode.Escape)) Application.Quit();
	if (Input.GetKeyDown(KeyCode.E) && !isDead)      PlaceBomb();
	if (Input.GetKeyDown(KeyCode.Q)) { collider.enabled = true;     isDead = false; }
}

function Update(){
	if (!isDead) UpdateMovement();
	UpdateAnimations();
	UpdateControls();
}

@RPC
function PlayMovementAnimation(animationName : String){
	animation.CrossFade(animationName);
	if (animationName == "death")
		animation.wrapMode = WrapMode.ClampForever;
	else {
		animation.wrapMode = WrapMode.Loop;
	}
}

@RPC
function Kill(){
	isDead = true;
	Debug.Log("Player died");
//	Camera.mainCamera.audio.Stop();
	sm.networkView.RPC("PlaySoundEffectAtPos", RPCMode.All, "PlayerDeathSound", transform.position);	
	collider.enabled = false;
}

@RPC
function Repaint(owner:NetworkPlayer){
	var CharColors = new Color[4];
	CharColors[0] = Color.white;
	CharColors[1] = Color.red;
	CharColors[2] = Color.green;
	CharColors[3] = Color.black;

    gameObject.GetComponentsInChildren(Renderer)[0].renderer.material.color = CharColors[parseInt(owner.ToString())];    

}