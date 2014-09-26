var SERIES_END = 2500;

var mapFunction = function(x){
    //$.get("http://www.google.com");
    for(var i = 0; i < SERIES_END; i++){
	for(var j = 0; j < SERIES_END; j++){
	    var benchmarkResult = Math.pow(i + 2*j - 7, 2) + Math.pow(2 * i + j - 5, 2);
	}
    }
}

var getTimestamp = function() { return window.performance.now(); };

var getSeriesOfNumbers = function(begin, end){
    var numList = [];
    
    for (var i = begin; i <= end; i++){
	numList.push(i);
    }

    return numList;
};

var findSumOfArrayMapReduce = function(array){
   
    return array.map(function(element){
	mapFunction(element);})
};

var findSumOfArray = function(array){
     var total = 0;
    for (var i = 0; i < array.length; i++){
	mapFunction();
    }
    return total;

}

var addSumToDiv = function(sumFunction){
    var begin = 1;
    var end = SERIES_END;
    var sum = 0;
    var series = getSeriesOfNumbers(begin, end);
    
    var start = getTimestamp();

    var sum = sumFunction(series);
    
    var elapsed = getTimestamp() - start;
    
    console.log(elapsed);
    var div = document.getElementById('sequentialSum');
    div.innerHTML += " Non parallel Took:" + elapsed + "ms <br/>";
};

var addSumToDivParallel = function(){
    var begin = 1;
    var end = SERIES_END;
    var sumPar = 0;
    var series = getSeriesOfNumbers(begin, end);
    var start = getTimestamp();
    
    var sumPar = series.mapPar(function(element){
	mapFunction();
    });


    var elapsed = getTimestamp() - start;

    var div = document.getElementById('parallelSum');
    div.innerHTML = "Parallel took : "+ elapsed + "ms";
};

var runEverything = function(){
    addSumToDivParallel();
    addSumToDiv(findSumOfArrayMapReduce);
    addSumToDiv(findSumOfArray);
};

window.onload = runEverything;
