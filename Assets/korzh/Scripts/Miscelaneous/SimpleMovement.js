/// This script moves the character controller forward 
/// and sideways based on the arrow keys.
/// It also jumps when pressing space.
/// Make sure to attach a character controller to the same game object.
/// It is recommended that you make only one call to Move or SimpleMove per frame.    

var speed : float = 6.0;
var jumpSpeed : float = 8.0;
var gravity : float = 20.0;

private var moveDirection : Vector3 = Vector3.zero;

@RPC
function PlayAnimation(animationName : String){
	animation.CrossFade(animationName);
}


function Update() {
	if(networkView.isMine){
	    var controller : CharacterController = GetComponent(CharacterController);
	    if (controller.isGrounded) {
	        // We are grounded, so recalculate
	        // move direction directly from axes
	        moveDirection = Vector3(Input.GetAxis("Horizontal"), 0,
	                                Input.GetAxis("Vertical"));
	                                
	        if (moveDirection != Vector3.zero) {
	            var rotation = transform.rotation; 
	            rotation.SetLookRotation(moveDirection); 
	            transform.rotation = rotation;
	        }
	        
	        moveDirection *= speed;
	        
	        if (Input.GetButton ("Jump")) {
	            moveDirection.y = jumpSpeed;
	        }
	    }
	
	    // Apply gravity
	    moveDirection.y -= gravity * Time.deltaTime;
	    
	    // Move the controller
	    controller.Move(moveDirection * Time.deltaTime);
	    
	    // animations go here
    	if (!controller.isGrounded) {
    		networkView.RPC("PlayAnimation", RPCMode.All, "jump");
   		} else	    
	    	if (Input.GetAxis("Horizontal") != 0 || Input.GetAxis("Vertical") != 0){
    			networkView.RPC("PlayAnimation", RPCMode.All, "run");
	    	} else {
    			networkView.RPC("PlayAnimation", RPCMode.All, "idle");
	    		}	    
	    
	    
    }
    else{
    	//enabled = false;
    }
}
