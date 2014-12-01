var SERIES_END = 1500;

var mapFunction = function(x){
    for(var i = 0; i < SERIES_END; i++){
	   for(var j = 0; j < SERIES_END; j++){
	       Math.pow(i + 2*j - 7, 2) + Math.pow(2 * i + j - 5, 2);
	   }
    }
}

var getTimestamp = function() { return window.performance.now(); };

//Gets the array that we will use map
var getSeriesOfNumbers = function(begin, end){
    var numList = [];
    
    for (var i = begin; i <= end; i++){
	   numList.push(i);
    }

    return numList;
};

var findSumOfArrayMap = function(array){
   
    return array.map(function(element){
	   mapFunction(element);
    });
};

var findSumOfArray = function(array){
    var total = 0;
    
    for (var i = 0; i < array.length; i++){
	   mapFunction();
    }
    
    return total;

}

var addSumToDiv = function(sumFunction, functName){
    var begin = 1;
    var end = SERIES_END;
    var sum = 0;
    var series = getSeriesOfNumbers(begin, end);
    
    var start = getTimestamp();

    var sum = sumFunction(series);
    
    var elapsed = getTimestamp() - start;
    
    var div = document.getElementById('sequentialSum');
    div.innerHTML += functName + " Took:" + elapsed + "ms <br/>";
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
    addSumToDiv(findSumOfArrayMap, "Map");
    addSumToDiv(findSumOfArray, "");
};

window.onload = runEverything;
