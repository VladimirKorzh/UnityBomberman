#pragma strict


var Xnum : int;
var Ynum : int;
var StoneBlock: Transform;
var WoodenBlock: Transform;
function Start () {
	Xnum = 21;
	Ynum = 21;
	
	var newpos = Vector3(0,0,0);
	
	// layer one
	for(var i=0; i<Xnum; i++){
		for (var j=0; j<Ynum; j++){			
			if (i==0 || i == Xnum-1 || j==0 || j== Ynum-1) {
				newpos = Vector3(i,1,j);
				Instantiate (StoneBlock, newpos, Quaternion.identity);
			}
			newpos = Vector3(i,0,j);
			Instantiate (StoneBlock, newpos, Quaternion.identity);			
		}
	}
	
	// layer two
	for(i=1; i<Xnum-1; i+=1){
		for (j=1; j<Ynum-1; j+=1){			
			newpos = Vector3(i,1,j);
			if (i%2==0 && j%2==0){			
				Instantiate (StoneBlock, newpos, Quaternion.identity);

			}	
			else{
				if( Random.value > 0.4) {				
					Instantiate (WoodenBlock, newpos, Quaternion.identity);			
				}			
			}
		}
	}	
	
//	// layer three
//	for(i=1; i<Xnum-1; i+=1){
//		for (j=1; j<Ynum-1; j+=1){			
//			newpos = Vector3(i,2,j);
//			if( Random.value > 0.8) {				
//				Instantiate (WoodenBlock, newpos, Quaternion.identity);			
//			}
//			else{
//				Instantiate (StoneBlock, newpos, Quaternion.identity);
//			}						
//		}
//	}			
//	
//	
//	
//	// layer four
//	for(i=1; i<Xnum-1; i+=1){
//		for (j=1; j<Ynum-1; j+=1){			
//			newpos = Vector3(i,3,j);
//			if( Random.value > 0.2) {				
//				Instantiate (WoodenBlock, newpos, Quaternion.identity);			
//			}
//			else{
//				Instantiate (StoneBlock, newpos, Quaternion.identity);
//			}						
//		}
//	}		
	
	
	
	
	
				/*
							newpos = Vector3(i,1,j);
				if( Random.value > 0.3) {				
					Instantiate (WoodenBlock, newpos, Quaternion.identity);			
				}
				else if( Random.value > 0.7) 	{
					Instantiate (StoneBlock, newpos, Quaternion.identity);
				}
			*/
	
}

