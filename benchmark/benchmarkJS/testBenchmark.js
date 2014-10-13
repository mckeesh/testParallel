var runFunctionLoopAmount = 100;
var SERIES_END = 700;

var mapFunction = function(x){
    for(var i = 0; i < SERIES_END; i++){
       for(var j = 0; j < SERIES_END; j++){
           Math.pow(i + 2*j - 7, 2) + Math.pow(Math.pow(2 * i + j - 5, 2),2) + Math.pow( Math.pow(i - j, 2) - 5, 2);
       }
   }
}

var getSeriesOfNumbers = function(begin, end){
    var numList = [];
    
    for (var i = begin; i <= end; i++){
       numList.push(i);
   }

   return numList;
};

var sequentialMap = function(){
  var numList = getSeriesOfNumbers(0,runFunctionLoopAmount);
  numList.map(mapFunction);
}

var parallelMap = function(){
  var numList = getSeriesOfNumbers(0,runFunctionLoopAmount);
  numList.mapPar(mapFunction);
}

var suite = new Benchmark.Suite;

// add tests
suite.add('mapReg', function(){
  sequentialMap();
})
.add('mapPar', function(){
  parallelMap();
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });