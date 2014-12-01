var GUESSING_DOMAIN = 10000;
var guessingIterationsPerCycle = 10000;

var targetNumber = Math.round(Math.random() * GUESSING_DOMAIN);
var correctlyGuessed = false;

console.log("Trying to guess " + targetNumber + " out of " + GUESSING_DOMAIN + " numbers.");

var arrayForIteration = [];
var arrayForIterationSize = 0;

for(var i = 0; i < guessingIterationsPerCycle; i++){
	arrayForIteration[i] = i;
}

var timing = 0;

var iterations = 0;
while(!correctlyGuessed){
	var t1 = performance.now();

	var guessingresults = arrayForIteration.mapPar(function(){
		return Math.round(Math.random() * GUESSING_DOMAIN) == targetNumber;
	});

	timing += (performance.now()-t1);

	guessingresults.reduce(function(e){
		if(e){
			correctlyGuessed = true;
		}
	})

	iterations++;
}

console.log("Found in " + iterations + " iterations at " + timing/iterations + "ms per cycle");