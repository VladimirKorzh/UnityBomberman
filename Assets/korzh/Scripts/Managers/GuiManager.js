#pragma strict

//@script ExecuteInEditMode()

var nm         : NetworkManager;
var state      : int;
var screenName : String;



enum GUIState {
	PlayingMatch = 0,
	MainMenu = 1, 
	CreatingGame = 2,
	BrowsingHostlist = 3, 
	BrowsingHostlistDone = 4,
	Loading = 5
}

function Start(){
	state = GUIState.MainMenu;
	nm = GetComponent(NetworkManager);
	screenName = "";
}

function MainMenuScreen(){
	if (state != GUIState.MainMenu) GUI.Box(Rect(200,100, 500, 200),screenName);	
	
	if (GUI.Button(Rect(Screen.width/2,Screen.height/2,150,50), "Single Player Test")){
		state = GUIState.PlayingMatch;
		nm.startServer();
		GetComponent(LevelManager).CreateDebugLevel();
		GetComponent(LevelManager).spawnPlayer();
	}	
	if (GUI.Button(Rect(25,100,150,50), "Create a new Game")){
		state = GUIState.CreatingGame;
	}
	if (GUI.Button(Rect(25, 175, 150, 50), "Browse hosts")){
		Debug.Log("Refreshing hostlist: " + nm.GameTypeName);
		state = GUIState.BrowsingHostlist;
		MasterServer.ClearHostList();
		MasterServer.RequestHostList(nm.GameTypeName);
	}				
	if (GUI.Button(Rect(25, 250, 150, 50), "Exit")){
		Debug.Log("Exiting the application");
		Application.Quit();
	}	
};

function ServerListScreen(){
	MainMenuScreen();
	screenName = "Server List";

	if (nm.hostData){
		for (var i:int = 0; i<nm.hostData.Length; i++){
			if(GUI.Button(Rect(225, 125+(50*i), 200, 50), nm.hostData[i].gameName)){
				Network.Connect(nm.hostData[i]);
				state = GUIState.Loading;
			};
		}
	}	
	else{
		GUI.Label (Rect (225,125,200,50), "Searching...");
	}			
}

function CreateNewServerScreen(){
	MainMenuScreen();
	screenName = "Create New Server";
	
	GUI.Label (Rect (225,125,150,30), "Server gamename:");
	nm.ServerName = GUI.TextField (Rect (375, 125, 200, 25), nm.ServerName);
	
	GUI.Label (Rect (225,175,150,30), "Server comment:");
	nm.ServerComment = GUI.TextField (Rect (375, 175, 200, 25), nm.ServerComment);
	
	GUI.Label (Rect (225,225,150,30), "Server password:");
	nm.ServerPassword = GUI.TextField (Rect (375, 225, 200, 25), nm.ServerPassword);	
	
	if (GUI.Button(Rect(425, 275, 150, 50), "Create Server")){
		nm.startServer();
		state = GUIState.Loading;
	}
}

function LoadingScreen(){
	GUI.Label (Rect (Screen.height/2,Screen.width/2,150,30), "Waiting for clients");
    GUILayout.Label("Player ping values");
    for (var i : int = 0; i < Network.connections.Length; i++) {
        GUILayout.Label("Player " + 
            Network.connections[i] + " - " + 
            Network.GetAveragePing(Network.connections[i]) + " ms");
    }	
}

function OnGUI(){
	switch (state) {
		case GUIState.MainMenu: MainMenuScreen(); break;
		case GUIState.BrowsingHostlist:	
		case GUIState.BrowsingHostlistDone: ServerListScreen(); break;
		case GUIState.CreatingGame: CreateNewServerScreen(); break;
		case GUIState.Loading: LoadingScreen(); break;
		case GUIState.PlayingMatch: break;
	}
}

function Update () {
	var nm = GetComponent(NetworkManager);
	if (state == GUIState.BrowsingHostlist && MasterServer.PollHostList().Length > 0){
		state = GUIState.BrowsingHostlistDone;
		Debug.Log("Servers found: " +MasterServer.PollHostList().Length);
		nm.hostData = MasterServer.PollHostList();
	}
}