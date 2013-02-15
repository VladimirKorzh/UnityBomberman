#pragma strict

var GameTypeName = "TestBomberMan";
var ServerName = "Network Testing";
var ServerComment = "Looks Cool";
var ServerPassword = "";
	
var hostData: HostData[];
private var btnX:float;
private var btnY:float;
private var btnW:float;
private var btnH:float;

function Start () {
	btnX = Screen.width * 0.05;
	btnY = Screen.width * 0.05;
	btnW = Screen.width * 0.1;
	btnH = Screen.width * 0.05;
}

function startServer(){
	Network.incomingPassword = ServerPassword;
 	Network.InitializeServer(32, 25001, !Network.HavePublicAddress);
 	MasterServer.RegisterHost(GameTypeName, ServerName, ServerComment);
}


// Events
function OnServerInitialized(){
	// Called on the server whenever a Network.InitializeServer was invoked and has completed.
	Debug.Log("Server Initialized. my playerID: " + Network.player);
 	GetComponent(LevelManager).CreateDebugLevel();
 	
 	var spawnPos = GetComponent(LevelManager).SpawnPos[parseInt(Network.player.ToString())];
 	SpawnYourself(spawnPos);
	Debug.Log("Level Created");			
}

function OnPlayerConnected(player: NetworkPlayer){
	// Called on the server whenever a new player has successfully connected.
	Debug.Log("Player connected "+player.ToString());
	
	var spawnPos = GetComponent(LevelManager).SpawnPos[parseInt(player.ToString())];	
	networkView.RPC("SpawnYourself", player, spawnPos);
}

function OnPlayerDisconnected(player: NetworkPlayer) {
    Debug.Log("Clean up after player " +  player);
    Network.RemoveRPCs(player);
    Network.DestroyPlayerObjects(player);
}

function OnConnectedToServer(){
	// Called on the client when you have successfully connected to a server

}

function OnDisconnectedFromServer(){
	// Called on client during disconnection from server,
	// but also on the server when the connection has disconnected.
}

function OnFailedToConnect(){
	// Called on the client when a connection attempt fails for some reason.
}

function OnMasterServerEvent(mse:MasterServerEvent){
	// Called on clients or servers when reporting events from the MasterServer.
	if(mse == MasterServerEvent.RegistrationSucceeded){
		Debug.Log("Registered on Master Server");	
	}
}


function OnFailedToConnectToMasterServer(){
	// Called on clients or servers when there is a problem connecting to the master server.
}

@RPC
function SpawnYourself(pos: Vector3){
	GetComponent(LevelManager).spawnPlayer(pos);
	
}