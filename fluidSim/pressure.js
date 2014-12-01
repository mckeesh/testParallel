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
    function addFields(x, s, dt)
    {
        for (var i=0; i<size ; i++ ) {
            x[i].val += dt * s[i].val;
        }

    }

    function set_bnd(b, x)
    {
        if (b===1) {
            for (var i = 1; i <= width; i++) {
                x[i].val =  x[i + rowSize].val;
                x[i + (height+1) *rowSize].val = x[i + height * rowSize].val;
            }

            for (var j = 1; i <= height; i++) {
                x[j * rowSize].val = -x[1 + j * rowSize].val;
                x[(width + 1) + j * rowSize].val = -x[width + j * rowSize].val;
            }
        } else if (b === 2) {
            for (var i = 1; i <= width; i++) {
                x[i].val = -x[i + rowSize].val;
                x[i + (height + 1) * rowSize].val = -x[i + height * rowSize].val;
            }

            for (var j = 1; j <= height; j++) {
                x[j * rowSize].val =  x[1 + j * rowSize].val;
                x[(width + 1) + j * rowSize].val =  x[width + j * rowSize].val;
            }
        } else {
            for (var i = 1; i <= width; i++) {
                x[i].val =  x[i + rowSize].val;
                x[i + (height + 1) * rowSize].val = x[i + height * rowSize].val;
            }

            for (var j = 1; j <= height; j++) {
                x[j * rowSize].val =  x[1 + j * rowSize].val;
                x[(width + 1) + j * rowSize].val =  x[width + j * rowSize].val;
            }
        }
        var maxEdge = (height + 1) * rowSize;
        x[0].val                 = 0.5 * (x[1].val + x[rowSize].val);
        x[maxEdge].val          = 0.5 * (x[1 + maxEdge].val + x[height * rowSize].val);
        x[(width+1)].val       = 0.5 * (x[width].val + x[(width + 1) + rowSize].val);
        x[(width+1)+maxEdge].val = 0.5 * (x[width + maxEdge].val + x[(width + 1) + height * rowSize].val);
    }

    function range(start, finish){
      var rangeArr = [];
      var count = 0;
      while(start < finish){rangeArr[count++] = start++;}
      return rangeArr;
    }

    function lin_solve(b, x, x0, a, c)
    {
        var rangeArr = range(1,height);

        if (a === 0 && c === 1) {
            for (var j=1 ; j<=height; j++) {
                var currentRow = j * rowSize;
                ++currentRow;
                for (var i = 0; i < width; i++) {
                    x[currentRow].val = x0[currentRow].val;
                    ++currentRow;
                }
            }
            set_bnd(b, x);
        } else {
            var invC = 1 / c;

            for (var k=0 ; k<iterations; k++) {

                rangeArr.map(function(j){
                    var lastRow = (j - 1) * rowSize;
                    var currentRow = j * rowSize;
                    var nextRow = (j + 1) * rowSize;
                    var lastX = x[currentRow].val;
                    ++currentRow;
                    for (var i=1; i<=width; i++)
                        lastX = x[currentRow].val = (x0[currentRow].val + a*(lastX+x[++currentRow].val+x[++lastRow].val+x[++nextRow].val)) * invC;
                });

                set_bnd(b, x);
            }
        }
    }
    
    function diffuse(b, x, x0)
    {
        var a = 0;
        lin_solve(b, x, x0, a, 1 + 4*a);
    }
    
    function lin_solve2(x, x0, y, y0, a, c)
    {

        if (a === 0 && c === 1) {
            for (var j=1 ; j <= height; j++) {
                var currentRow = j * rowSize;
                ++currentRow;
                for (var i = 0; i < width; i++) {
                    x[currentRow].val = x0[currentRow].val;
                    y[currentRow].val = y0[currentRow].val;
                    ++currentRow;
                }
            }
            set_bnd(1, x);
            set_bnd(2, y);
        } else {
            var rangeArr = range(1,height);
            //TODO: NEVER SEEMS TO SATISFY THIS CONDITION
            var invC = 1/c;

            for (var k=0 ; k<iterations; k++) {
                rangeArr.map(function (j) {
                    var lastRow = (j - 1) * rowSize;
                    var currentRow = j * rowSize;
                    var nextRow = (j + 1) * rowSize;
                    var lastX = x[currentRow].val;
                    var lastY = y[currentRow].val;
                    ++currentRow;
                    for (var i = 1; i <= width; i++) {
                        lastX = x[currentRow].val = (x0[currentRow].val + a * (lastX + x[currentRow].val + x[lastRow].val + x[nextRow].val)) * invC;
                        lastY = y[currentRow].val = (y0[currentRow].val + a * (lastY + y[++currentRow].val + y[++lastRow].val + y[++nextRow].val)) * invC;
                    }
                });
                set_bnd(1, x);
                set_bnd(2, y);
            }
        }
    }
    
    function diffuse2(x, x0, y, y0, dt)
    {
        var a = 0;
        lin_solve2(x, x0, y, y0, a, 1 + 4 * a);
    }
    
    function advect(b, d, d0, u, v, dt)
    {
        var rangeArr = range(1,height+1);
        var Wdt0 = dt * width;
        var Hdt0 = dt * height;
        var Wp5 = width + 0.5;
        var Hp5 = height + 0.5;

        rangeArr.map( function(j) {
            var pos = j * rowSize;
            for (var i = 1; i <= width; i++) {
                var x = i - Wdt0 * u[++pos].val;
                var y = j - Hdt0 * v[pos].val;
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
                d[pos].val = s0 * (t0 * d0[i0 + row1].val + t1 * d0[i0 + row2].val) + s1 * (t0 * d0[i1 + row1].val + t1 * d0[i1 + row2].val);
            }
        });

        set_bnd(b, d);
    }
    
    function project(u, v, p, div)
    {

        var rangeArr = range(1,height+1);

        var h = -0.5 / Math.sqrt(width * height);

        rangeArr.map(function(j){
            var row = j * rowSize;
            var previousRow = (j - 1) * rowSize;
            var prevValue = row - 1;
            var currentRow = row;
            var nextValue = row + 1;
            var nextRow = (j + 1) * rowSize;
            for (var i = 1; i <= width; i++ ) {
                div[++currentRow].val = h * (u[++nextValue].val - u[++prevValue].val + v[++nextRow].val - v[++previousRow].val);
                p[currentRow].val = 0;
            }
        });

        set_bnd(0, div);
        set_bnd(0, p);
        
        lin_solve(0, p, div, 1, 4 );
        var wScale = 0.5 * width;
        var hScale = 0.5 * height;

        rangeArr.map(function(j){
            var prevPos = j * rowSize - 1;
            var currentPos = j * rowSize;
            var nextPos = j * rowSize + 1;
            var prevRow = (j - 1) * rowSize;
            var currentRow = j * rowSize;
            var nextRow = (j + 1) * rowSize;

            for (var i = 1; i<= width; i++) {
                u[++currentPos].val -= wScale * (p[++nextPos].val - p[++prevPos].val);
                v[currentPos].val   -= hScale * (p[++nextRow].val - p[++prevRow].val);
            }
        });
        set_bnd(1, u);
        set_bnd(2, v);
    }
    
    function dens_step(x, x0, u, v, dt)
    {
        addFields(x, x0, dt);
        diffuse(0, x0, x, dt );
        advect(0, x, x0, u, v, dt );
    }
    
    function vel_step(u, v, u0, v0, dt)
    {
        addFields(u, u0, dt );
        addFields(v, v0, dt );
        var temp = u0; u0 = u; u = temp;
        var temp = v0; v0 = v; v = temp;
        diffuse2(u,u0,v,v0, dt);
        project(u, v, u0, v0);
        var temp = u0; u0 = u; u = temp; 
        var temp = v0; v0 = v; v = temp;
        advect(1, u, u0, u0, v0, dt);
        advect(2, v, v0, u0, v0, dt);
        project(u, v, u0, v0 );
    }
    var uiCallback = function(d,u,v) {};

    function Field(dens, u, v) {
        // Just exposing the fields here rather than using accessors is a measurable win during display (maybe 5%)
        // but makes the code ugly.
        this.setDensity = function(x, y, d) {
             dens[(x + 1) + (y + 1) * rowSize].val = d;
        }
        this.getDensity = function(x, y) {
             return dens[(x + 1) + (y + 1) * rowSize].val;
        }
        this.setVelocity = function(x, y, xv, yv) {
             u[(x + 1) + (y + 1) * rowSize].val = xv;
             v[(x + 1) + (y + 1) * rowSize].val = yv;
        }
        this.getXVelocity = function(x, y) {
             return u[(x + 1) + (y + 1) * rowSize].val;
        }
        this.getYVelocity = function(x, y) {
             return v[(x + 1) + (y + 1) * rowSize].val;
        }
        this.width = function() { return width; }
        this.height = function() { return height; }
    }
    function queryUI(d, u, v)
    {
        for (var i = 0; i < size; i++)
            u[i].val = v[i].val = d[i].val = 0.0;
        uiCallback(new Field(d, u, v));
    }

    this.update = function () {
        queryUI(dens_prev, u_prev, v_prev);
        vel_step(u, v, u_prev, v_prev, dt);
        dens_step(dens, dens_prev, u, v, dt);
        displayFunc(new Field(dens, u, v));
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
    var dens;
    var dens_prev;
    var u;
    var u_prev;
    var v;
    var v_prev;
    var width;
    var height;
    var rowSize;
    var size;
    var displayFunc;
    var Int32 = new TypedObject.StructType({val: TypedObject.int32});
    function reset()
    {
        rowSize = width + 2;
        size = (width+2)*(height+2);
        dens = new Array(size);
        dens_prev = new Array(size);
        u = new Array(size);
        u_prev = new Array(size);
        v = new Array(size);
        v_prev = new Array(size);

        for (var i = 0; i < size; i++){
            dens_prev[i] = u_prev[i] = v_prev[i] = dens[i] = u[i] = v[i] = new Int32();
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

