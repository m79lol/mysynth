var pointerDebugging = true;

function onClickButtonOctave( ev ) {
	var octave = parseInt( ev.target.id.substring( 2 ) );
	if (pointerDebugging) {
		console.log( "octave button click : id: " + ev.pointerId + " octave: " + octave );
  }
	if (octave != NaN) {
    var current_octave_el = document.getElementById("current_octave");
    current_octave_el.textContent = octave;
    
    var searchEles = document.getElementById("octavebox").children;
    for(var i = 0; i < searchEles.length; i++) {
      if(searchEles[i].tagName == 'BUTTON') {
        searchEles[i].disabled = false;
      }
    }
    ev.target.disabled = true;
    
    
		changeOctave(octave);
  }
	ev.preventDefault();
}

function onClickButtonInstrument( ev ) {
	var istrument_index = parseInt( ev.target.id.substring( 2 ) );
	if (pointerDebugging) {
		console.log( "instrument button click : id: " + ev.pointerId + " instrument: " + istrument_index );
  }
	if (istrument_index != NaN) {
    var current_instrument_el = document.getElementById("current_instrument");
    current_instrument_el.textContent = '('+istrument_index+') '+ ev.target.textContent;
    
    var searchEles = document.getElementById("soundsbox").getElementsByTagName("button");
    for(var i = 0; i < searchEles.length; i++) {
      searchEles[i].disabled = false;
    }
    ev.target.disabled = true;
    
		loadPreset(istrument_index);
  }
	ev.preventDefault();
}

function setupSynthUI() {
	var keybox = document.getElementById("keybox");

	if (window.location.search.substring(1) == "touch") {
		keybox.addEventListener('touchstart', touchstart);
		keybox.addEventListener('touchmove', touchmove);
		keybox.addEventListener('touchend', touchend);
	} else {
		keybox.addEventListener('down', pointerDown);
		keybox.addEventListener('track', pointerMove);
		keybox.addEventListener('up', pointerUp);
	}
  
  var octavebox = document.getElementById("octavebox");
  octavebox.addEventListener('click', onClickButtonOctave);
  
  var instrument_groups = {};
  var instrument_name = null;
  var group_name = null;
  
  for(var i = 0; i < webAudioFontIndex.length; i++) {
    instrument_name = webAudioFontIndex[i].js;
    group_name = instrument_name.substr(0, instrument_name.indexOf('.'));
    instrument_groups[group_name] = [];
    //console.log("group_name = " + group_name);
  }
  
  console.log("**********************");
  for(var i = 0; i < webAudioFontIndex.length; i++) {
    instrument_name = webAudioFontIndex[i].js;
    group_name = instrument_name.substr(0, instrument_name.indexOf('.'));
    instrument_name = instrument_name.substr(instrument_name.indexOf('.')+1);
    instrument_name = instrument_name.slice(0, -3);
    
    var arr = {};
    arr["index"] = i;
    arr["name"] = instrument_name;
    instrument_groups[group_name].push(arr);
    //console.log("instrument_name = " + instrument_name);
  }
  
  console.debug(instrument_groups);
  
  var soundsbox = document.getElementById("soundsbox");
  for (var group_name in instrument_groups) {
    var groupDivEl = document.createElement('div');
    
    var labelEl = document.createElement('span');
    labelEl.textContent = group_name;
    groupDivEl.appendChild(labelEl);
    groupDivEl.appendChild(document.createElement('br'));

    for (var i = 0; i < instrument_groups[group_name].length; i++) {
      var buttonEl = document.createElement('button');
      var arr = instrument_groups[group_name][i];
      buttonEl.textContent = arr["name"];
      buttonEl.id = "bi" + arr["index"];
      groupDivEl.appendChild(buttonEl);
    }
    
    soundsbox.appendChild(groupDivEl);
  }
  
  soundsbox.addEventListener('click', onClickButtonInstrument);
}