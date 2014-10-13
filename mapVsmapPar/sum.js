var SERIES_END = 700;

var mapFunction = function(x){
    for(var i = 0; i < SERIES_END; i++){
       for(var j = 0; j < SERIES_END; j++){
           Math.pow(i + 2*j - 7, 2) + Math.pow(Math.pow(2 * i + j - 5, 2),2) + Math.pow( Math.pow(i - j, 2) - 5, 2);
       }
   }
}

var getTimestamp = function() { 
    return window.performance.now(); 
};

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
};

var addSumToDiv = function(sumFunction, functType){
    var begin = 1;
    var end = SERIES_END;
    var sum = 0;
    var series = getSeriesOfNumbers(begin, end);
    
    var start = getTimestamp();

    var numberOfTimesToRun = 30;
    for(var i = 0; i < numberOfTimesToRun; i++){
        var sum = sumFunction(series);
    }
    
    var elapsed = getTimestamp() - start;
    
    console.log(elapsed);
    var div = document.getElementById('sequentialSum');
    div.innerHTML += functType + " Took:" + (elapsed/numberOfTimesToRun) + "ms on average<br/>";
};

var addSumToDivParallel = function(){
    var begin = 1;
    var end = SERIES_END;
    var sumPar = 0;
    var series = getSeriesOfNumbers(begin, end);
    var start = getTimestamp();

    var numberOfTimesToRun = 30;
    
    for(var i = 0; i < numberOfTimesToRun; i++){
        var sumPar = series.mapPar(function(element){
           mapFunction();
       });
    }


    var elapsed = getTimestamp() - start;

    var div = document.getElementById('parallelSum');
    div.innerHTML = "Parallel took : "+ (elapsed/numberOfTimesToRun) + "ms on average <br/>";
};

var runEverything = function(){
    document.getElementById('parallelSum').innerHTML = "";
    document.getElementById('sequentialSum').innerHTML = "";

    addSumToDivParallel();
    addSumToDiv(findSumOfArrayMap, "Map");
    addSumToDiv(findSumOfArray, "Regular");
};

window.onload = runEverything;
