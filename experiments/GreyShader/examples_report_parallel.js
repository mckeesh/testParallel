
var HEIGHT = 600, WIDTH = 600,
	LEFT = 100, TOP = 100,
	spacing = 10;
var points = []; //|\label{global}|  
function Point(x, y){
	this.x = x;
	this.y = y;
}

var initialize = function(){
	var t1 = performance.now();
	for (var y = 0; y < HEIGHT; y++) {
	        for (var x = 0; x <  WIDTH; x++) {
           		 var p = new Point(LEFT + x * spacing, TOP + y * spacing); //|\label{create_point}|  
		            points.push(p);//|\label{push_point}|  
        		}
	}
	var t2 = performance.now();
	console.log(t2-t1);
};
//1471.8412802987732

var shadePoints = function(){
	var t1 = performance.now();
	points.mapPar(function(pt){
		var xFactor = (pt.x-LEFT) /WIDTH;
		var yFactor = (pt.y-TOP) / HEIGHT;
		pt.grayScaleIntensity =Math.sqrt((xFactor*xFactor) + (yFactor*yFactor));
	});
	var t2 = performance.now();
	shadeTime += t2 - t1;
};
			
initialize();

var index = 50;
for(var i = 0; i < index; i++){	
	var shadeTime = 0;
	shadePoints();
	console.log(shadeTime);
}
