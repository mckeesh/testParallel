// Based on http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf
/**
 * Copyright (c) 2009 Oliver Hunt <http://nerget.com>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

function FluidField(canvas) {

    var FluidUnit = function(){
        this.u = 0;
        this.v = 0;
        this.dense = 0;
        this.u_prev = 0;
        this.v_prev = 0;
        this.dense_prev = 0;
    };

    function addUFields(fluidUnitsArray, dt)
    {
        for (var i=0; i<size ; i++ ) fluidUnitsArray[i].u += dt*fluidUnitsArray[i].u_prev;
    }

    function addVFields(fluidUnitsArray, dt)
    {
        for (var i=0; i<size ; i++ ) fluidUnitsArray[i].v += dt*fluidUnitsArray[i].v_prev;
    }

    function addDenseFields(fluidUnitsArray, dt)
    {
        for (var i=0; i<size ; i++ ) fluidUnitsArray[i].dense += dt*fluidUnitsArray[i].dense_prev;
    }

    function set_bndU(b, fluidUnitsArray)
    {
        if (b===1) {
            for (var i = 1; i <= width; i++) {
                fluidUnitsArray[i].u =  fluidUnitsArray[i + rowSize].u;
                fluidUnitsArray[i + (height+1) *rowSize].u = fluidUnitsArray[i + height * rowSize].u;
            }

            for (var j = 1; i <= height; i++) {
                fluidUnitsArray[j * rowSize].u = -fluidUnitsArray[1 + j * rowSize].u;
                fluidUnitsArray[(width + 1) + j * rowSize].u = -fluidUnitsArray[width + j * rowSize].u;
            }
        } else if (b === 2) {
            for (var i = 1; i <= width; i++) {
                fluidUnitsArray[i].u = -fluidUnitsArray[i + rowSize].u;
                fluidUnitsArray[i + (height + 1) * rowSize].u = -fluidUnitsArray[i + height * rowSize].u;
            }

            for (var j = 1; j <= height; j++) {
                fluidUnitsArray[j * rowSize].u =  fluidUnitsArray[1 + j * rowSize].u;
                fluidUnitsArray[(width + 1) + j * rowSize].u =  fluidUnitsArray[width + j * rowSize].u;
            }
        } else {
            for (var i = 1; i <= width; i++) {
                fluidUnitsArray[i].u =  fluidUnitsArray[i + rowSize].u;
                fluidUnitsArray[i + (height + 1) * rowSize].u = fluidUnitsArray[i + height * rowSize].u;
            }

            for (var j = 1; j <= height; j++) {
                fluidUnitsArray[j * rowSize].u =  fluidUnitsArray[1 + j * rowSize].u;
                fluidUnitsArray[(width + 1) + j * rowSize].u =  fluidUnitsArray[width + j * rowSize].u;
            }
        }
        var maxEdge = (height + 1) * rowSize;
        fluidUnitsArray[0].u          = 0.5 * (fluidUnitsArray[1].u + fluidUnitsArray[rowSize].u);
        fluidUnitsArray[maxEdge].u          = 0.5 * (fluidUnitsArray[1 + maxEdge].u + fluidUnitsArray[height * rowSize].u);
        fluidUnitsArray[(width+1)].u         = 0.5 * (fluidUnitsArray[width].u + fluidUnitsArray[(width + 1) + rowSize].u);
        fluidUnitsArray[(width+1)+maxEdge].u = 0.5 * (fluidUnitsArray[width + maxEdge].u + fluidUnitsArray[(width + 1) + height * rowSize].u);
    }

    function set_bndU0(b, fluidUnitsArray)
    {
        if (b===1) {
            for (var i = 1; i <= width; i++) {
                fluidUnitsArray[i].u_prev =  fluidUnitsArray[i + rowSize].u_prev;
                fluidUnitsArray[i + (height+1) *rowSize].u_prev = fluidUnitsArray[i + height * rowSize].u_prev;
            }

            for (var j = 1; i <= height; i++) {
                fluidUnitsArray[j * rowSize].u_prev = -fluidUnitsArray[1 + j * rowSize].u_prev;
                fluidUnitsArray[(width + 1) + j * rowSize].u_prev = -fluidUnitsArray[width + j * rowSize].u_prev;
            }
        } else if (b === 2) {
            for (var i = 1; i <= width; i++) {
                fluidUnitsArray[i].u_prev = -fluidUnitsArray[i + rowSize].u_prev;
                fluidUnitsArray[i + (height + 1) * rowSize].u_prev = -fluidUnitsArray[i + height * rowSize].u_prev;
            }

            for (var j = 1; j <= height; j++) {
                fluidUnitsArray[j * rowSize].u_prev =  fluidUnitsArray[1 + j * rowSize].u_prev;
                fluidUnitsArray[(width + 1) + j * rowSize].u_prev =  fluidUnitsArray[width + j * rowSize].u_prev;
            }
        } else {
            for (var i = 1; i <= width; i++) {
                fluidUnitsArray[i].u_prev =  fluidUnitsArray[i + rowSize].u_prev;
                fluidUnitsArray[i + (height + 1) * rowSize].u_prev = fluidUnitsArray[i + height * rowSize].u_prev;
            }

            for (var j = 1; j <= height; j++) {
                fluidUnitsArray[j * rowSize].u_prev =  fluidUnitsArray[1 + j * rowSize].u_prev;
                fluidUnitsArray[(width + 1) + j * rowSize].u_prev =  fluidUnitsArray[width + j * rowSize].u_prev;
            }
        }
        var maxEdge = (height + 1) * rowSize;
        fluidUnitsArray[0].u_prev          = 0.5 * (fluidUnitsArray[1].u + fluidUnitsArray[rowSize].u_prev);
        fluidUnitsArray[maxEdge].u_prev          = 0.5 * (fluidUnitsArray[1 + maxEdge].u + fluidUnitsArray[height * rowSize].u_prev);
        fluidUnitsArray[(width+1)].u_prev         = 0.5 * (fluidUnitsArray[width].u + fluidUnitsArray[(width + 1) + rowSize].u_prev);
        fluidUnitsArray[(width+1)+maxEdge].u_prev = 0.5 * (fluidUnitsArray[width + maxEdge].u + fluidUnitsArray[(width + 1) + height * rowSize].u_prev);
    }

    function set_bndV(b, fluidUnitsArray)
    {
        if (b===1) {
            for (var i = 1; i <= width; i++) {
                fluidUnitsArray[i].v =  fluidUnitsArray[i + rowSize].v;
                fluidUnitsArray[i + (height+1) *rowSize].v = fluidUnitsArray[i + height * rowSize].v;
            }

            for (var j = 1; i <= height; i++) {
                fluidUnitsArray[j * rowSize].v = -fluidUnitsArray[1 + j * rowSize].v;
                fluidUnitsArray[(width + 1) + j * rowSize].v = -fluidUnitsArray[width + j * rowSize].v;
            }
        } else if (b === 2) {
            for (var i = 1; i <= width; i++) {
                fluidUnitsArray[i].v = -fluidUnitsArray[i + rowSize].v;
                fluidUnitsArray[i + (height + 1) * rowSize].v = -fluidUnitsArray[i + height * rowSize].v;
            }

            for (var j = 1; j <= height; j++) {
                fluidUnitsArray[j * rowSize].v =  fluidUnitsArray[1 + j * rowSize].v;
                fluidUnitsArray[(width + 1) + j * rowSize].v =  fluidUnitsArray[width + j * rowSize].v;
            }
        } else {
            for (var i = 1; i <= width; i++) {
                fluidUnitsArray[i].v =  fluidUnitsArray[i + rowSize].v;
                fluidUnitsArray[i + (height + 1) * rowSize].v = fluidUnitsArray[i + height * rowSize].v;
            }

            for (var j = 1; j <= height; j++) {
                fluidUnitsArray[j * rowSize].v =  fluidUnitsArray[1 + j * rowSize].v;
                fluidUnitsArray[(width + 1) + j * rowSize].v =  fluidUnitsArray[width + j * rowSize].v;
            }
        }
        var maxEdge = (height + 1) * rowSize;
        fluidUnitsArray[0].v          = 0.5 * (fluidUnitsArray[1].u + fluidUnitsArray[rowSize].v);
        fluidUnitsArray[maxEdge].v          = 0.5 * (fluidUnitsArray[1 + maxEdge].v + fluidUnitsArray[height * rowSize].v);
        fluidUnitsArray[(width+1)].v         = 0.5 * (fluidUnitsArray[width].v + fluidUnitsArray[(width + 1) + rowSize].v);
        fluidUnitsArray[(width+1)+maxEdge].v = 0.5 * (fluidUnitsArray[width + maxEdge].v + fluidUnitsArray[(width + 1) + height * rowSize].v);
    }

    function range(start, finish){
      var rangeArr = [];
      var count = 0;
      while(start < finish){rangeArr[count++] = start++;}
      return rangeArr;
    }

    function lin_solve(b, fluidUnitsArray, a, c)
    {
        var rangeArr = range(1,height);

        if (a === 0 && c === 1) {
            for (var j=1 ; j<=height; j++) {
                var currentRow = j * rowSize;
                ++currentRow;
                for (var i = 0; i < width; i++) {
                    fluidUnitsArray[currentRow].u_prev = fluidUnitsArray[currentRow].v_prev;
                    ++currentRow;
                }
            }
            set_bndU0(b, fluidUnitsArray);
        } else {
            var invC = 1 / c;

            for (var k=0 ; k<iterations; k++) {

                for(var j = 0; j < height; j++){
                    j += 1;
                    var lastRow = (j - 1) * rowSize;
                    var currentRow = j * rowSize;
                    var nextRow = (j + 1) * rowSize;
                    var lastU0 = fluidUnitsArray[currentRow].u_prev;
                    ++currentRow;
                    for (var i=1; i<=width; i++)
                        lastU0 = fluidUnitsArray[currentRow].u_prev = (fluidUnitsArray[currentRow].v_prev + a*(lastU0+fluidUnitsArray[++currentRow].u_prev+fluidUnitsArray[++lastRow].u_prev+fluidUnitsArray[++nextRow].u_prev)) * invC;
                }

                set_bndU0(b, fluidUnitsArray);
            }
        }
    }
    
    function diffuse(b, fluidUnitsArray, dt)
    {
        var a = 0;
        lin_solve(b, fluidUnitsArray, a, 1 + 4*a);
    }
    
    function lin_solve2(fluidUnitsArray, a, c)
    {

        if (a === 0 && c === 1) {
            for (var j=1 ; j <= height; j++) {
                var currentRow = j * rowSize;
                ++currentRow;
                for (var i = 0; i < width; i++) {
                    fluidUnitsArray[currentRow].u = fluidUnitsArray[currentRow].u_prev;
                    fluidUnitsArray[currentRow].v = fluidUnitsArray[currentRow].v_prev;
                    ++currentRow;
                }
            }
            set_bndU(1, fluidUnitsArray);
            set_bndV(2, fluidUnitsArray);
        } else {
            var rangeArr = range(1,height);
            //TODO: NEVER SEEMS TO SATISFY THIS CONDITION
            var invC = 1/c;

            for (var k=0 ; k<iterations; k++) {
                fluidUnitsArray.map(function (fluidUnit, j) {
                    j += 1;
                    var lastRow = (j - 1) * rowSize;
                    var currentRow = j * rowSize;
                    var nextRow = (j + 1) * rowSize;
                    var lastX = fluidUnit.u;
                    var lastY = fluidUnit.v;
                    ++currentRow;
                    for (var i = 1; i <= width; i++) {
                        lastX = fluidUnit.u = (fluidUnit.u_prev + a * (lastX + fluidUnit.u + fluidUnitsArray[lastRow].u + fluidUnitsArray[nextRow].u)) * invC;
                        lastY = fluidUnit.v = (fluidUnit.v_prev + a * (lastY + fluidUnit.v + fluidUnitsArray[++lastRow].v + fluidUnitsArray[++nextRow].v)) * invC;
                    }
                });
                set_bndU(1, fluidUnitsArray);
                set_bndV(2, fluidUnitsArray);
            }
        }
    }
    
    function diffuse2(fluidUnitsArray, dt)
    {
        var a = 0;
        lin_solve2(fluidUnitsArray, a, 1 + 4 * a);
    }
    
    function advect(b, fluidUnitsArray, dt)
    {
        var rangeArr = range(1,height+1);
        var Wdt0 = dt * width;
        var Hdt0 = dt * height;
        var Wp5 = width + 0.5;
        var Hp5 = height + 0.5;

        fluidUnitsArray.map( function(fluidUnit, j) {
            j +=1;
            var pos = j * rowSize;
            for (var i = 1; i <= width; i++) {
                var x = i - Wdt0 * fluidUnit.u;
                var y = j - Hdt0 * fluidUnit.v;
                if (x < 0.5)
                    x = 0.5;
                else if (x > Wp5)
                    x = Wp5;
                var i0 = x | 0;
                var i1 = i0 + 1;
                if (y < 0.5)
                    y = 0.5;
                else if (y > Hp5)
                    y = Hp5;
                var j0 = y | 0;
                var j1 = j0 + 1;
                var s1 = x - i0;
                var s0 = 1 - s1;
                var t1 = y - j0;
                var t0 = 1 - t1;
                var row1 = j0 * rowSize;
                var row2 = j1 * rowSize;
                fluidUnit.u_prev = s0 * (t0 * fluidUnitsArray[i0 + row1].v_prev + t1 * fluidUnitsArray[i0 + row2].v_prev) + s1 * (t0 * fluidUnitsArray[i1 + row1].v_prev + t1 * fluidUnitsArray[i1 + row2].v_prev);
            }
        });

        set_bndU0(b, fluidUnitsArray);
    }

    function project(fluidUnitsArray)
    {

        var h = -0.5 / Math.sqrt(width * height);

        for(var j = 1; j <= height; j++){
            //j += 1;
            var row = j * rowSize;
            var previousRow = (j - 1) * rowSize;
            var prevValue = row - 1;
            var currentRow = row;
            var nextValue = row + 1;
            var nextRow = (j + 1) * rowSize;
            for (var i = 1; i <= width; i++ ) {
                fluidUnitsArray[++currentRow].v_prev = h * (fluidUnitsArray[++nextValue].u - fluidUnitsArray[++prevValue].u + fluidUnitsArray[++nextRow].v - fluidUnitsArray[++previousRow].v);
                fluidUnitsArray[currentRow].u_prev = 0;
            }
        }

        set_bndV(0, fluidUnitsArray);
        set_bndU(0, fluidUnitsArray);
        
        lin_solve(0, fluidUnitsArray, 1, 4 );
        var wScale = 0.5 * width;
        var hScale = 0.5 * height;

        for (var j = 1; j<= height; j++ ) {
            var prevPos = j * rowSize - 1;
            var currentPos = j * rowSize;
            var nextPos = j * rowSize + 1;
            var prevRow = (j - 1) * rowSize;
            var currentRow = j * rowSize;
            var nextRow = (j + 1) * rowSize;

            for (var i = 1; i<= width; i++) {
                fluidUnitsArray[++currentPos].u -= wScale * (fluidUnitsArray[++nextPos].u_prev - fluidUnitsArray[++prevPos].u_prev);
                fluidUnitsArray[currentPos].v   -= hScale * (fluidUnitsArray[++nextRow].u_prev - fluidUnitsArray[++prevRow].u_prev);
            }
        }
        set_bndU(1, fluidUnitsArray);
        set_bndV(2, fluidUnitsArray);
    }
    
    function dens_step(fluidUnitsArray, dt)
    {
        addDenseFields(fluidUnitsArray, dt);
        diffuse(0, fluidUnitsArray, dt );
        advect(0, fluidUnitsArray, dt );
    }

    function migratesVariablesToOlderVersions(fluidUnitsArray){
        fluidUnitsArray.map(function(fluidUnit){
            var temp = fluidUnit.u_prev; fluidUnit.u_prev = fluidUnit.u; fluidUnit.u = temp;
            var temp = fluidUnit.v_prev; fluidUnit.v_prev = fluidUnit.v; fluidUnit.v = temp;
        });
    }
    
    function vel_step(fluidUnitsArray, dt)
    {
        addUFields(fluidUnitsArray, dt );
        addVFields(fluidUnitsArray, dt );
        //TODO: This could fail after the refactor
        migratesVariablesToOlderVersions(fluidUnitsArray);
        diffuse2(fluidUnitsArray, dt);
        project(fluidUnitsArray);
        migratesVariablesToOlderVersions(fluidUnitsArray);
        advect(1, fluidUnitsArray, dt);
        advect(2, fluidUnitsArray, dt);
        project(fluidUnitsArray);
    }
    var uiCallback = function(fluidUnitsArray) {};

    function Field(fluidUnitsArray) {
        // Just exposing the fields here rather than using accessors is a measurable win during display (maybe 5%)
        // but makes the code ugly.
        this.setDensity = function(x, y, d) {
            fluidUnitsArray[(x + 1) + (y + 1) * rowSize].dense = d;
        }
        this.getDensity = function(x, y) {
             return fluidUnitsArray[(x + 1) + (y + 1) * rowSize].dense;
        }
        this.setVelocity = function(x, y, xv, yv) {
            fluidUnitsArray[(x + 1) + (y + 1) * rowSize].u = xv;
            fluidUnitsArray[(x + 1) + (y + 1) * rowSize].v = yv;
        }
        this.getXVelocity = function(x, y) {
             return fluidUnitsArray[(x + 1) + (y + 1) * rowSize].u;
        }
        this.getYVelocity = function(x, y) {
             return fluidUnitsArray[(x + 1) + (y + 1) * rowSize].v;
        }
        this.width = function() { return width; }
        this.height = function() { return height; }
    }
    function queryUI(fluidUnitsArray)
    {
        for (var i = 0; i < size; i++)
            fluidUnitsArray[i].u = fluidUnitsArray[i].v = fluidUnitsArray[i].dense = 0.0;
        uiCallback(new Field(fluidUnitsArray));
    }

    this.update = function () {
        queryUI(fluidUnitsArray);
        //fluidUnit.queryUI();
        vel_step(fluidUnitsArray, dt);
        dens_step(fluidUnitsArray, dt);
        displayFunc(new Field(fluidUnitsArray));
    }
    this.setDisplayFunction = function(func) {
        displayFunc = func;
    }
    
    this.iterations = function() { return iterations; }
    this.setIterations = function(iters) {
        if (iters > 0 && iters <= 100)
           iterations = iters;
    }
    this.setUICallback = function(callback) {
        uiCallback = callback;
    }
    var iterations = 10;
    var visc = 0.5;
    var dt = 0.1;
    var width;
    var height;
    var rowSize;
    var size;
    var displayFunc;
    var fluidUnitsArray;

    function reset()
    {
        rowSize = width + 2;
        size = (width+2)*(height+2);
        fluidUnitsArray = new Array(size);
        for (var i = 0; i < size; i++) {
            fluidUnitsArray[i] = new FluidUnit();
            fluidUnitsArray[i].dens_prev = fluidUnitsArray[i].u_prev = fluidUnitsArray[i].v_prev = fluidUnitsArray[i].dens = fluidUnitsArray[i].u = fluidUnitsArray[i].v = 0;
        }
    }
    this.reset = reset;
    this.setResolution = function (hRes, wRes)
    {
        var res = wRes * hRes;
        if (res > 0 && res < 1000000 && (wRes != width || hRes != height)) {
            width = wRes;
            height = hRes;
            reset();
            return true;
        }
        return false;
    }
    this.setResolution(64, 64);
}

