extends Node2D

const APP_KEY = '2b3167bfb45358d788a9'
const APP_CLUSTER = 'us3'
const API_HOST = 'http://localhost:8000'

var PUSHER_SETTINGS = { 
		"cluster": APP_CLUSTER,
		"userAuthentication": {
			"endpoint":API_HOST + '/api/auth',
			"callback": auth_callback
		},
		"channelAuthorization": {
			"endpoint": API_HOST + '/api/join',
		}
}

var user = null
var channel = null
var channel_code = ""

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	Pusher.debug = OS.is_debug_build()
	Pusher.connection_state_changed.connect(handle_connection)
	Pusher.signin_success.connect(handle_signin)
	
	host()

func is_authenticated():
	return user and Pusher.connection_state == PusherState.CONNECTED

func join_after_auth(code = ""):
	if is_authenticated():
		var channel_name = "presence-game-" + code	
		channel = Pusher.subscribe(channel_name)

func host_after_auth():
	if is_authenticated():
		Pusher.subscribe("private-host")

func host():
	if Pusher.connection_state != PusherState.CONNECTED:
		Pusher.connect_app(APP_KEY, PUSHER_SETTINGS)
	else:
		host_after_auth()
	
func join(code = ""):
	channel_code = code
	# Reconnect
	if Pusher.connection_state != PusherState.CONNECTED:
		Pusher.connect_app(APP_KEY, PUSHER_SETTINGS)
	else:
		join_after_auth(code)

func handle_signin(user_data):
	user = user_data
	host_after_auth()
	# join_after_auth(channel_code)
	
func auth_callback(error, code, headers, body):
	if code == 200 and body:
		var body_data = PusherUtils.parse_json(body.get_string_from_utf8())
		if 'session_token' in body_data:
			Pusher.user_auth_params['session_token'] = body_data['session_token']
			Pusher.channel_auth_params['session_token'] = body_data['session_token']
	
func handle_connection(connection_state):
	if connection_state == PusherState.CONNECTED:
		Pusher.signin()
