let timer = document.getElementById("timer");
let run = false;

let started = Date.now();

function timerloop(){
	if (run){
		let now = Date.now();
		timer.innerText = buildTimeString(now, started);
	}
	requestAnimationFrame(timerloop);
}

function buildTimeString(now, started){
	let tot = now-started;
	let mils = tot%1000;
	let secs = Math.floor(tot/1000)%60;
	let mins = Math.floor(tot/1000/60)%60;
	let hours = Math.floor(tot/1000/60/60)%100;

	if (mils < 10){
		mils = "00"+mils;
	}else if (mils < 100){
		mils = "0"+mils;
	}

	if (secs < 10){
		secs = "0"+secs
	}

	if (mins < 10){
		mins = "0"+mins
	}

	if (hours < 10){
		hours = "0"+hours;
	}

	return hours+":"+mins+":"+secs+"."+mils;
}

function stop(){
	run = false;
}

function start(){
	started = Date.now();
	run = true;
}

function reset(){
	stop()
	timer.innerText = "00:00:00.000";
}

timerloop();