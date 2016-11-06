var synthBox = null;
var pointerDebugging = false;

function testChange(e) {
	console.log("test");
}

function createDropdown( id, label, x, y, values, selectedIndex, onChange ) {
	var container = document.createElement( "div" );
	container.className = "dropdownContainer";
	container.style.left = "" + x + "px";
	container.style.top = "" + y + "px";

	var labelText = document.createElement( "div" );
	labelText.className = "dropdownLabel";
	labelText.appendChild( document.createTextNode( label ) );
	container.appendChild( labelText );

	var select = document.createElement( "select" );
	select.className = "dropdownSelect";
	select.id = id;
	for (var i=0; i<values.length; i++) {
		var opt = document.createElement("option");
		opt.appendChild(document.createTextNode(values[i]));
		select.appendChild(opt);
	}
	select.selectedIndex = selectedIndex;
	select.onchange = onChange;
	container.appendChild( select );

	return container;
}

function createSection( label, x, y, width, height ) {
	var container = document.createElement( "fieldset" );
	container.className = "section";
	container.style.left = "" + x + "px";
	container.style.top = "" + y + "px";
	container.style.width = "" + width + "px";
	container.style.height = "" + height + "px";

	var labelText = document.createElement( "legend" );
	labelText.className = "sectionLabel";
	labelText.appendChild( document.createTextNode( label ) );

	container.appendChild( labelText );
	return container;
}

function setupSynthUI() {
	keybox = document.getElementById("keybox");

	if (window.location.search.substring(1) == "touch") {
		keybox.addEventListener('touchstart', touchstart);
		keybox.addEventListener('touchmove', touchmove);
		keybox.addEventListener('touchend', touchend);
	} else {
		keybox.addEventListener('down', pointerDown);
		keybox.addEventListener('track', pointerMove);
		keybox.addEventListener('up', pointerUp);

		if (window.location.search.substring(1) == "dbgptr")
			pointerDebugging = true;
	}
} 
