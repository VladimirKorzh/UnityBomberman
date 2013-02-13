using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class Seeker : MonoBehaviour {
	
	//Target object
	public Transform target;
	//Cache to know what our
	//last path was for
	Vector3 lastDestination;
	
	//Route to follow
	public List<Vector3> route = new List<Vector3>();
	//Position on the route
	public int routePos;
	
	//Something that knows how to move
	//our character
	Movement movement;
	
	void Awake()
	{
		//Something that can be told where to go
		movement = GetComponent<Movement>();
	}
		
	// Update is called once per frame
	void Update () {
		//Check for a target
		if(target == null)
			return;
		
		//Get the position from the target
		var targetPosition = target.position;
		//Has it moved
		if(targetPosition != lastDestination)
		{
			//Update the cache
			lastDestination = targetPosition;
			//Ask the grid to build a path
			BuildGraph.instance.SeekPath(transform.position, targetPosition, (path)=>{
				//This is called when we get a result
				if(path == null)
					return;
				//Update the route
				route.Clear();
				route.AddRange(path);
				routePos = 0;
				
			});
		}
		if(route.Count > 0)
		{
			var last = route[0];
			foreach(var step in route)
			{
				Debug.DrawLine(last, step, Color.blue);
				last = step;
			}
		}
		
		//Are we at the end of the route?
		if(routePos < route.Count)
		{
			//Set the target to the current route position
			movement.targetPosition = route[routePos];
			//Check for the next route position
			var distance = Vector3.Distance(route[routePos], transform.position);	
			if(distance < movement.speed/2)
				routePos++;
		}
		
		
	}
}
