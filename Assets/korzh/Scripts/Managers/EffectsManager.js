#pragma strict

var PlayerDeathSound : AudioClip;

var ExplosionSound : AudioClip[];
var ExplosionSoundSeqN: int = 0;

var PickUpSound : AudioClip[];
var PickUpSoundSeqN : int = 0;

var ExplosionFlameParticleEffect : GameObject;

@RPC
function SpawnAnimationAtPos(which:String, pos:Vector3){
	switch(which){
		case "Fire": 
			var fire = Instantiate(ExplosionFlameParticleEffect, pos,Quaternion.identity);
			Destroy(fire, 1);
			break;
	}
}

@RPC
function PlaySoundEffectAtPos(which:String, pos:Vector3){
	switch(which){
		case "ExplosionSound": 		
			AudioSource.PlayClipAtPoint(ExplosionSound[ExplosionSoundSeqN], pos);
			if (ExplosionSoundSeqN+1 < ExplosionSound.Length)
				ExplosionSoundSeqN+=1;
			else ExplosionSoundSeqN=0;
			
			break;
			
		case "PickUpSound":
			AudioSource.PlayClipAtPoint(PickUpSound[PickUpSoundSeqN], pos);
			if (PickUpSoundSeqN+1 < PickUpSound.Length)
				PickUpSoundSeqN+=1;
			else PickUpSoundSeqN=0;			
			break;
			
		case "PlayerDeathSound":
			AudioSource.PlayClipAtPoint(PlayerDeathSound, pos);
			break;
	}
}





//
//var lvlMngr : LevelManager;
//var timeStep :float = 0.5f;
//var Timer: float = 0.0f;
//var lightHeight: float = 5;
//
//var currCell : Vector3;
//var rdy = false;
//
//var ScaleSounds : AudioClip[];

//function Go () {
//	lvlMngr = GameObject.Find("SceneManager").GetComponent(LevelManager);
//	currCell = Vector3(1, lvlMngr.Ynum+lightHeight, 1);
//	rdy = true;
//}
//
//function Update () {
//	if (rdy){
//		Timer += 1 * Time.deltaTime;
//		if (Timer >= timeStep){
//			Timer = 0.0f;
//			if (currCell.x+1 < lvlMngr.Xnum-1) currCell.x += 1;
//			else {
//				currCell.x = 1; 
//				if (currCell.z+1 < lvlMngr.Znum-1) currCell.z +=1;
//				else{
//					currCell.z = 1;
//				}
//			}
//			light.transform.position = currCell;			
//			PlayCellSoundColor();
//		}	
//	}
//}

//function PlayCellSoundColor(){
//
//			var selfCollision = Physics.OverlapSphere(Vector3(currCell.x,1,currCell.z),0.3,(1 << 9) + (1 << 8));
//			light.color = Color.white;
//			for (var i=0;i<selfCollision.Length;i++){
//				switch (selfCollision[i].collider.tag){
//					case "Player": light.color = Color.yellow; break;
//					case "WoodBlock": light.color = Color.green; break;
//					case "StoneBlock": light.color = Color.red; break;
//					case "Bomb": light.color = Color.blue; break;
//					case "PowerUp": light.color = Color.black; break;
//				}				
//			}
//			if (light.color == Color.white){
//				// cell is empty, play a note
////				var totalCellsAmount = (lvlMngr.Xnum-2) * (lvlMngr.Znum-2);			
//				var totalCellsAmount = (lvlMngr.Xnum-2);
//				var bucketSize = totalCellsAmount / ScaleSounds.Length;	
//				var soundIndex = 0;
////				var cellnum = currCell.x * currCell.z;
//				var cellnum = currCell.x;
//				for(var index = 0; index<ScaleSounds.Length; index++) {
//					if (cellnum < bucketSize) {
//						soundIndex = index;
//						break;
//					}
//					else {
//						cellnum -= bucketSize;
//					}
//				}
//				AudioSource.PlayClipAtPoint( ScaleSounds[soundIndex],Vector3(currCell.x,1,currCell.z) );	
//			}
//}
