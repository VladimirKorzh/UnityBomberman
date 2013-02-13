using UnityEngine;
using System.Collections;

public class Movement : MonoBehaviour {

	public float speed = 4;
	public Vector3 targetPosition;
	
	void Awake()
	{
		targetPosition = transform.position;
	}
	
	// Update is called once per frame
	void Update () {
	
		transform.position = Vector3.MoveTowards(transform.position, targetPosition, speed * Time.deltaTime);
	}
}
