@tool
extends EditorPlugin

# Replace this value with a PascalCase autoload name, as per the GDScript style guide.
const AUTOLOAD_NAME = "Bonfire"

func _enable_plugin():
	# The autoload can be a scene or script file.
	add_autoload_singleton(AUTOLOAD_NAME, "res://addons/bonfire/api.gd")

func _disable_plugin():
	remove_autoload_singleton(AUTOLOAD_NAME)
