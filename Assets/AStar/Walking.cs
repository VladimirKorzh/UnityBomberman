using UnityEngine;
using System.Collections;

public class Walking : MonoBehaviour {
	
	Vector3 lastPosition;
	AnimationState walk;
	
	// Use this for initialization
	void Start () {
		lastPosition = transform.position;
		walk = animation["walk"];
		walk.enabled = true;
		walk.weight = 0;
	}
	
	// Update is called once per frame
	void Update () {
		
		var distanceMoved = Vector3.Distance(transform.position, lastPosition);
		
		if(distanceMoved > 0)
			animation.Blend(walk.name, 1);
		else
			animation.Blend(walk.name, 0);
		
		walk.speed = (distanceMoved/Time.deltaTime);
		lastPosition = transform.position;
	}
}
