using UnityEngine;
using System.Collections;

public class ClickToMove : MonoBehaviour {
	
	public Collider target;
	
	
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if(Input.GetMouseButtonDown(0))
		{
			RaycastHit hit;
			if(target.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit, 10000))
			{
				transform.position = hit.point;
			}
		}
	}
}
