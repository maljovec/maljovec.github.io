(function animation() {
    //// frame setup
    var canvasWidth = document.getElementById('animation').offsetWidth;
    var canvasHeight = document.getElementById('animation').offsetHeight;

    var dt = 0.5;
    var X0 = [], Y0 = []; // to store initial starting locations
    var X  = [], Y  = []; // to store current point for each curve

    //// curve ////
    var N = 50; // 25^2 curves
    // discretize the vfield coords
    var xp = d3.range(N).map(
            function (i) {
                return (gridWidth-1)*(i/N);
            });
    var yp = d3.range(N).map(
            function (i) {
                return (gridHeight-1)*(i/N);
            });
    // array of starting positions for each curve on a uniform grid
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            X.push(xp[j]), Y.push(yp[i]);
            X0.push(xp[j]), Y0.push(yp[i]);
        }
    }

    function F(x, y) {
        //Locate the grid cell we are in
        xIdx = Math.floor(x);
        yIdx = Math.floor(y);
        // Now determine the linear coeffiecients from the four triangles, and
        // bilinearly interpolate from them
        f1 = foo[yIdx*gridWidth+xIdx];
        f2 = foo[yIdx*gridWidth+xIdx+1];
        f3 = foo[(yIdx+1)*gridWidth+xIdx];
        f4 = foo[(yIdx+1)*gridWidth+xIdx+1];

        u =  x - xIdx;
        v =  y - yIdx;

        //Bilinear Interpolation:
        return (1-v)*(u*f2+(1-u)*f1) + v*(u*f4+(1-u)*f3);
    }

    function gradF(x, y) {
        //Locate the grid cell we are in
        xIdx = Math.floor(x);
        yIdx = Math.floor(y);

        x0y0 = yIdx*gridWidth+xIdx;
        x1y0 = yIdx*gridWidth+xIdx+1;
        x0y1 = (yIdx+1)*gridWidth+xIdx;
        x1y1 = (yIdx+1)*gridWidth+xIdx+1;

        // Use central differencing if we are on the interior, otherwise we will
        // wrap the boundary
        if (xIdx > 0) {
            x_1y0 = yIdx*gridWidth+xIdx-1;
            x_1y1 = (yIdx+1)*gridWidth+xIdx-1;
        }
        else {
            //Boundary wrapping
            x_1y0 = yIdx*gridWidth+gridWidth-1;
            x_1y1 = (yIdx+1)*gridWidth+gridWidth-1;
        }
        dx1 = (foo[x1y0]-foo[x0y0] + foo[x0y0]-foo[x_1y0]) / 2.;
        dx3 = (foo[x1y1]-foo[x0y1] + foo[x0y1]-foo[x_1y1]) / 2.;

        if (yIdx > 0) {
            x0y_1 = (yIdx-1)*gridWidth+xIdx;
            x1y_1 = (yIdx-1)*gridWidth+xIdx+1;
        }
        else {
            //Boundary wrapping
            x0y_1 = (gridHeight-1)*gridWidth+xIdx;
            x1y_1 = (gridHeight-1)*gridWidth+xIdx;
        }
        dy1 = (foo[x0y1]-foo[x0y0] + foo[x0y0]-foo[x0y_1]) / 2.;
        dy2 = (foo[x1y1]-foo[x1y0] + foo[x1y0]-foo[x1y_1]) / 2.;

        // Use central differencing if we are on the interior, otherwise we will
        // wrap the boundary
        if (xIdx < gridWidth-2) {
            x2y0 = yIdx*gridWidth+xIdx+2;
            x2y1 = (yIdx+1)*gridWidth+xIdx+2;
        }
        else {
            //Boundary wrapping
            x2y0 = yIdx*gridWidth;
            x2y1 = (yIdx+1)*gridWidth;
        }
        dx2 = (foo[x2y0]-foo[x1y0] + foo[x1y0]-foo[x0y0]) / 2.;
        dx4 = (foo[x2y1]-foo[x1y1] + foo[x1y1]-foo[x0y1]) / 2.;
        if (yIdx < gridHeight-2) {
            x0y2 = (yIdx+2)*gridWidth+xIdx;
            x1y2 = (yIdx+2)*gridWidth+xIdx+1;
        }
        else {
            //Boundary wrapping
            x0y2 = xIdx;
            x1y2 = xIdx+1;
        }
        dy3 = (foo[x0y2]-foo[x0y1] + foo[x0y1]-foo[x0y0]) / 2.;
        dy4 = (foo[x1y2]-foo[x1y1] + foo[x1y1]-foo[x1y0]) / 2.;

        u =  x - xIdx;
        v =  y - yIdx;

        //Bilinear Interpolation:
        dx = (1-v)*(u*dx2+(1-u)*dx1) + v*(u*dx4+(1-u)*dx3);
        dy = (1-v)*(u*dy2+(1-u)*dy1) + v*(u*dy4+(1-u)*dy3);
        return [dx,dy];
    }

    var g = d3.select("#animation").node().getContext("2d"); // initialize a "canvas" element
    g.fillStyle = "rgba(0, 0, 0, 0.05)"; // for fading curves
    g.lineWidth = 0.7;
    g.strokeStyle = "#FF8000"; // html color code
    //// mapping from vfield coords to web page coords
    var xMap = d3.scaleLinear()
        .domain([0, gridWidth-1])
        .range([0, canvasWidth]);
    var yMap = d3.scaleLinear()
        .domain([0, gridHeight-1])
        .range([0, canvasHeight]);
    //// animation setup
    var frameRate = 300; // ms per timestep (yeah I know it's not really a rate)
    var M = X.length;
    var MaxAge = 200; // # timesteps before restart
    var age = [];
    for (var i=0; i<M; i++) {
        age.push(randage());
    }
    var drawFlag = true;
    // setInterval(function () {if (drawFlag) {draw();}}, frameRate);
    d3.timer(function () {if (drawFlag) {draw();}}, frameRate);
    d3.select("#animation")
        .on("click", function() {drawFlag = (drawFlag) ? false : true;})
    function randage() {
        // to randomize starting ages for each curve
        return Math.round(Math.random()*100);
    }
    // for info on the global canvas operations see
    // http://bucephalus.org/text/CanvasHandbook/CanvasHandbook.html#globalcompositeoperation
    g.globalCompositeOperation = "source-over";
    function draw() {
        g.fillRect(0, 0, canvasWidth, canvasHeight); // fades all existing curves by a set amount determined by fillStyle (above), which sets opacity using rgba
        for (var i=0; i<M; i++) { // draw a single timestep for every curve
            var dr = gradF(X[i], Y[i]);

            xIdx = Math.floor(X[i]);
            yIdx = Math.floor(Y[i]);
            currentIdx =        (yIdx*gridWidth+xIdx).toString()
                         + '_' +(yIdx*gridWidth+xIdx+1).toString()
                         + '_' +((yIdx+1)*gridWidth+xIdx).toString()
                         + '_' +((yIdx+1)*gridWidth+xIdx+1).toString();
            minIdx = getMin(currentIdx);
            maxIdx = getMax(currentIdx);
            idx = minIdx.toString() + '_' + maxIdx.toString();
            if (!(idx in colorDict)) {
                colorDict[idx] = myColors[nextColor];
                nextColor = nextColor + 1;
                if (nextColor > myColors.length) {
                    nextColor = 0;
                }
            }
            g.strokeStyle = colorDict[idx];//cMap(F(X[i],Y[i]));

            g.beginPath();
            g.moveTo(xMap(X[i]), yMap(Y[i])); // the start point of the path
            g.lineTo(xMap(X[i]+=dr[0]*dt), yMap(Y[i]+=dr[1]*dt)); // the end point
            g.stroke(); // final draw command
            if (age[i]++ > MaxAge) {
                // increment age of each curve, restart if MaxAge is reached
                age[i] = randage();
                X[i] = X0[i], Y[i] = Y0[i];
            }
        }
    }
})()
