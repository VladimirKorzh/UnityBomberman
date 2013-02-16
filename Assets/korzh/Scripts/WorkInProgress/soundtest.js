#pragma strict

//var background: AudioClip;
//var notes: AudioClip[];
//
//var TimeToNextNote:float;
//var Timer:float;
//
//function Start () {
//	AudioSource.PlayClipAtPoint(background, transform.position);
//	TimeToNextNote = 10;
//}
//
//function Update () {
//	Timer += 1 * Time.deltaTime;    
////	Debug.Log("Timer: "  + Timer);
//	if (TimeToNextNote < Timer){
//		TimeToNextNote = Random.Range(0.5, 3.0);
//		Debug.Log("ToNextNote: "  + TimeToNextNote);
//		Timer = 0.0;
//		AudioSource.PlayClipAtPoint(notes[Random.Range(0,notes.Length)], transform.position);	
//	}
//}