#pragma strict

var isDead = false;

var maxBomb :int   = 5;
var maxFire  :int   = 7;
var maxSpeed :int   = 7;

var SpeedBonusWeight :float = 0.5;
var jumpSpeed : float = 8.0;
var gravity : float = 20.0;

var Fire  = 1;
var Speed = 2;
var Bomb = 1;
var canJump = false;


var PlacedBombsList = Array();	


public enum BonusType { 
	Speed = 1,
	Fire  = 2,
	Bomb  = 3
}


var goBomb : GameObject;

private var moveDirection : Vector3 = Vector3.zero;
var controller : CharacterController;

function Start(){
	if(networkView.isMine){ 
		// set the camera to follow this object
	    Camera.mainCamera.GetComponent(SmoothFollow).target = gameObject.transform;
	    	
	   	// create an abstract color difference between players
	    gameObject.Find("Ice Golem").renderer.material.color = Color.white;
	    controller = GetComponent(CharacterController);
	    
    }
    else {
    	enabled = false;
    }
}


function PickUpBonus(type: BonusType){
	switch (type) {
		case BonusType.Speed: if (Speed < maxSpeed) Speed+=SpeedBonusWeight; break;
		case BonusType.Fire:  if (Fire < maxFire)  Fire+=1; break;
		case BonusType.Bomb:  if (Bomb < maxBomb)  Bomb +=1;            	 break;
	}
}

function PlaceBomb(){
	if (PlacedBombsList.Count < Bomb){	    
	    var currentPos = transform.position;
	    var newpos = Vector3(Mathf.Round(currentPos.x),
                             		 currentPos.y + 0.4,
                             		 Mathf.Round(currentPos.z));
	    	    
	    var boom = Network.Instantiate(goBomb, newpos, Quaternion.identity,1);
	    boom.GetComponent(BombBehaviour).LinkPlayer(gameObject);
	    PlacedBombsList.Add( boom );	    
    }
}
	
@RPC
function PlayAnimation(animationName : String){
	animation.CrossFade(animationName);
	if (animationName == "death")
		animation.wrapMode = WrapMode.ClampForever;
	else {
		animation.wrapMode = WrapMode.Loop;
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
	if (!controller.isGrounded) {
		networkView.RPC("PlayAnimation", RPCMode.All, "jump");
	} 
	else	
	{    
    	if (Input.GetAxis("Horizontal") != 0 || Input.GetAxis("Vertical") != 0){
    	
			if ( Speed < 4) {		
				networkView.RPC("PlayAnimation", RPCMode.All, "walk");
			}
			else 
			{ 
				networkView.RPC("PlayAnimation", RPCMode.All, "run");
			}
			
    	} 
    	else 
    	{
			networkView.RPC("PlayAnimation", RPCMode.All, "idle");
		}	      	    
    }
}

function UpdateControls(){
	if (Input.GetKeyDown(KeyCode.Escape)) Application.Quit();
	if (Input.GetKeyDown(KeyCode.E))      PlaceBomb();

}

function Update(){
	UpdateMovement();
	UpdateAnimations();
	UpdateControls();
}







