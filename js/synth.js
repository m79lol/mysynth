var voices = new Array();
var preset = null;
var AudioContextFunc = null;
var audioContext = null;
var player = null;

var currentOctave = 3;

var keys = new Array( 256 );
//Lower row: zsxdcvgbhnjm...
keys[16] = 41; // = F2
keys[65] = 42;
keys[90] = 43;
keys[83] = 44;
keys[88] = 45;
keys[68] = 46;
keys[67] = 47;
keys[86] = 48; // = C3
keys[71] = 49;
keys[66] = 50;
keys[72] = 51;
keys[78] = 52;
keys[77] = 53; // = F3
keys[75] = 54;
keys[188] = 55;
keys[76] = 56;
keys[190] = 57;
keys[186] = 58;
keys[191] = 59;

// Upper row: q2w3er5t6y7u...
keys[81] = 60; // = C4 ("middle C")
keys[50] = 61;
keys[87] = 62;
keys[51] = 63;
keys[69] = 64;
keys[82] = 65; // = F4
keys[53] = 66;
keys[84] = 67;
keys[54] = 68;
keys[89] = 69;
keys[55] = 70;
keys[85] = 71;
keys[73] = 72; // = C5
keys[57] = 73;
keys[79] = 74;
keys[48] = 75;
keys[80] = 76;
keys[219] = 77; // = F5
keys[187] = 78;
keys[221] = 79;
keys[220] = 80;

function changeOctave(octave) {
  currentOctave = octave;
}

function changePreset(preset_index) {
  preset = preset_index;
}

function loadPreset(idx){
  console.log('test',webAudioFontIndex[idx]);
  if(webAudioFontIndex[idx].drum){
    loadAndWait('..webaudiofont/webaudiofont/'+webAudioFontIndex[idx].js,webAudioFontIndex[idx].name,changePreset);
  }else{
    loadAndWait('../webaudiofont/webaudiofont/'+webAudioFontIndex[idx].js,webAudioFontIndex[idx].name,changePreset);
  }
}
function loadAndWait(jsName,varName,onFinish){
  console.log('init',jsName);
  var r=document.createElement('script');
  r.setAttribute("type","text/javascript");
  r.setAttribute("src", jsName);
  document.getElementsByTagName("head")[0].appendChild(r);
  waitOrFinish(varName,onFinish);
}
function waitOrFinish(varName,onFinish){
  console.log('wait for ',varName);
  if(window[varName]){
    onFinish(window[varName]);
  }else{
    setTimeout(function(){waitOrFinish(varName,onFinish);},100);
  }
}


function noteOn( note, velocity ) {
	console.log("note on: " + note );
	if (voices[note] == null) {
		// Create a new synth node
		voices[note] = new Voice(note, velocity);
		var e = document.getElementById( "k" + note );
		if (e)
			e.classList.add("pressed");
	}
}

function noteOff( note ) {
	if (voices[note] != null) {
		// Shut off the note playing and clear it 
		voices[note].noteOff();
		voices[note] = null;
		var e = document.getElementById( "k" + note );
		if (e)
			e.classList.remove("pressed");
	}

}

function Voice( note, velocity ) {
  this.note = note;
	console.log("note construct: " + this.note);
  
  var audioBufferSourceNode = player.queueWaveTable(audioContext, audioContext.destination, preset, audioContext.currentTime + 0, this.note, velocity, false);
}
Voice.prototype.noteOff = function() {
  console.log("note destruct: " + this.note);
}

function keyDown( ev ) {
	console.log( "key down: " + ev.keyCode );
  var note = keys[ev.keyCode];
	if (note) {
		noteOn( note + 12*(3-currentOctave), 0.75 );
  }
	return false;
}

function keyUp( ev ) {
	console.log( "key up: " + ev.keyCode );
	var note = keys[ev.keyCode];
	if (note) {
		noteOff( note + 12*(3-currentOctave) );
  }
	return false;
}
var pointers=[];

function touchstart( ev ) {
	for (var i=0; i<ev.targetTouches.length; i++) {
	  var touch = ev.targetTouches[0];
		var element = touch.target;

		var note = parseInt( element.id.substring( 1 ) );
		console.log( "touchstart: id: " + element.id + "identifier: " + touch.identifier + " note: " + note );
		if (!isNaN(note)) {
			noteOn( note + 12*(3-currentOctave), 0.75 );
			pointers[touch.identifier]=note;
		}
	}
	ev.preventDefault();
}

function touchmove( ev ) {
	for (var i=0; i<ev.targetTouches.length; i++) {
	  var touch = ev.targetTouches[0];
		var element = touch.target;

		var note = parseInt( element.id.substring( 1 ) );
		console.log( "touchmove: id: " + element.id + " identifier: " + touch.identifier + " note: " + note );
		if (!isNaN(note) && pointers[touch.identifier] && pointers[touch.identifier]!=note) {
			noteOff(pointers[touch.identifier] + 12*(3-currentOctave));
			noteOn( note + 12*(3-currentOctave), 0.75 );
			pointers[touch.identifier]=note;
		}
	}
	ev.preventDefault();
}

function touchend( ev ) {
	var note = parseInt( ev.target.id.substring( 1 ) );
	console.log( "touchend: id: " + ev.target.id + " note: " + note );
	if (note != NaN) {
		noteOff( note + 12*(3-currentOctave) );
  }
	pointers[ev.pointerId]=null;
	ev.preventDefault();
}

function touchcancel( ev ) {
	console.log( "touchcancel" );
	ev.preventDefault();
}

function pointerDown( ev ) {
	var note = parseInt( ev.target.id.substring( 1 ) );
	if (pointerDebugging) {
		console.log( "pointer down: id: " + ev.pointerId
			+ " target: " + ev.target.id + " note: " + note );
  }
	if (!isNaN(note)) {
		noteOn( note + 12*(3-currentOctave), 0.75 );
		pointers[ev.pointerId]=note;
	}
	ev.preventDefault();
}

function pointerMove( ev ) {
	var note = parseInt( ev.target.id.substring( 1 ) );
	if (pointerDebugging) {
		console.log( "pointer move: id: " + ev.pointerId 
			+ " target: " + ev.target.id + " note: " + note );
  }
	if (!isNaN(note) && pointers[ev.pointerId] && pointers[ev.pointerId]!=note) {
		if (pointers[ev.pointerId]) {
			noteOff(pointers[ev.pointerId] + 12*(3-currentOctave));
    }
		noteOn( note + 12*(3-currentOctave), 0.75 );
		pointers[ev.pointerId]=note;
	}
	ev.preventDefault();
}

function pointerUp( ev ) {
	var note = parseInt( ev.target.id.substring( 1 ) );
	if (pointerDebugging) {
		console.log( "pointer up: id: " + ev.pointerId + " note: " + note );
  }
	if (note != NaN) {
		noteOff( note + 12*(3-currentOctave) );
  }
	pointers[ev.pointerId]=null;
	ev.preventDefault();
}

function initAudio() {
  AudioContextFunc = window.AudioContext || window.webkitAudioContext;
	try {
    audioContext = new AudioContextFunc();
  }
  catch(e) {
    alert('The Web Audio API is apparently not supported in this browser.');
  }
  
  player=new WebAudioFontPlayer();
//  preset = _tone_Violin000080_461_460_45127;

	window.addEventListener('keydown', keyDown, false);
	window.addEventListener('keyup', keyUp, false);
	setupSynthUI();

}
window.onload=initAudio;
