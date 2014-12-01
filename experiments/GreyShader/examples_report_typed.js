var HEIGHT = 600, WIDTH = 600,
	LEFT = 100, TOP = 100,
	spacing = 10;

var T = TypedObject;
var Point = new T.StructType({x : T.uint32, y:T.uint32, grayScaleIntensity:T.float32});

var Points = Point.array(WIDTH * HEIGHT);
points = new Points();

var initialize = function(){
	var t1 = performance.now();
	points.mapPar(function(p, index){
		var rowIndex = index / HEIGHT,
		      colIndex = index - (rowIndex*HEIGHT);
		p.x = LEFT + colIndex * spacing;
		p.y = TOP + rowIndex * spacing;
	});
	var t2 = performance.now();
	console.log(t2 - t1);
};
//2511.133660162799

var shadePoints = function(){
	var t1 = performance.now();
	points.mapPar(function(pt){
		var xFactor = (pt.x-LEFT) /WIDTH;
		var yFactor = (pt.y-TOP) / HEIGHT;
		pt.grayScaleIntensity =Math.sqrt((xFactor*xFactor) + (yFactor*yFactor));
	});
	var t2 = performance.now();
	console.log(t2 - t1);
};
// 2129.252070414368
