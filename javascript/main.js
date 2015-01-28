(function()
{
    var mazeCanvas;
    var pathCanvas;
    var MAZE = maze;
    
    var start = {x:255,y:361};
    var end = {x:255,y:214};
    
    var DIRS = {
        TOP : {x:0,y:-1},
        BOTTOM : {x:0,y:1},
        LEFT : {x:-1,y:0},
        RIGHT : {x:1,y:0}
    }
    
    var scale = 1;
    var width;
    var height;
    
    var reached = false;
    
    var queue = [start];
    
    var distanceTravelled = 2;
    var wayBackLengther;
    var wayBackLengtherPos;
    
    function addPos(pos1,pos2)
    {
        return {x:pos1.x + pos2.x,y:pos1.y + pos2.y};
    }
    
    function updatePathfinder()
    {
        var newQueue = [];
        for(var i in queue)
        {
            var cPos = {x:queue[i].x,y:queue[i].y};
            
            var newPos;
            for(var j = 0; j < 4; j++)
            {
                newPos = addPos(cPos,DIRS[['TOP','BOTTOM','LEFT','RIGHT'][j]]);
                if(newPos.x < 0 || newPos.y < 0 || newPos.x >= width/scale || newPos.y > height/scale)continue;
                var dest = MAZE[newPos.x][newPos.y];
                if(newPos.x == end.x && newPos.y == end.y)
                {
                    wayBackLengtherPos = newPos;
                    wayBackLengther = distanceTravelled;
                    reached = true;
                }
                if(dest == 0)
                {
                    MAZE[newPos.x][newPos.y] = distanceTravelled;
                    newQueue.push(newPos);
                }
            }
        }
        distanceTravelled++;
        queue = newQueue;
    }
    
    function updateWayBack()
    {
        var ctx = pathCanvas.getContext("2d");
        ctx.fillStyle = "#602";
        var cPos = wayBackLengtherPos;
        for(var j = 0; j < 4; j++)
        {
            newPos = addPos(cPos,DIRS[['TOP','BOTTOM','LEFT','RIGHT'][j]]);
            if(newPos.x < 0 || newPos.y < 0 || newPos.x >= width/scale || newPos.y > height/scale)continue;
            var dest = MAZE[newPos.x][newPos.y];
            if(newPos.x == start.x && newPos.y == start.y)
            {
                alert("oi m8");
            }
            else if(dest == wayBackLengther-1)
            {
                wayBackLengther--;
                wayBackLengtherPos = newPos;
                ctx.fillRect(newPos.x*scale,newPos.y*scale,scale,scale);
                return;
            }
        }
    }
    
    function renderPathfinder()
    {
        var ctx = pathCanvas.getContext("2d");
        var iN = width/scale;
        var jN = height/scale;
        ctx.fillStyle = "#828";
        for(var i in queue)
        {
            var pos = queue[i];
            ctx.fillRect(pos.x*scale,pos.y*scale,scale,scale);
        }
    }
    
    function renderMaze()
    {
        var ctx = mazeCanvas.getContext("2d");
        ctx.fillStyle = "#414";
        var iN = width/scale;
        var jN = height/scale;
        for(var i = 0; i < iN; i++)
        {
            for(var j = 0 ; j < jN; j++)
            {
                if(MAZE[i][j])ctx.fillRect(i*scale,j*scale,scale,scale);
            }
        }
        
        var cSize = scale*1.5;
        
        var posX = (start.x + 0.5)*scale;
        var posY = (start.y + 0.5)*scale;
        
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(posX,posY,cSize + 4,0,Math.PI*2);
        ctx.closePath();
        ctx.fillStyle = "#101";
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(posX,posY,cSize,0,Math.PI*2);
        ctx.closePath();
        ctx.fillStyle = "#f90";
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(posX,posY,cSize + 2,0,Math.PI*2);
        ctx.closePath();
        ctx.strokeStyle = "#f90";
        ctx.stroke();
        
        posX = (end.x + 0.5)*scale;
        posY = (end.y + 0.5)*scale;
        
        ctx.beginPath();
        ctx.arc(posX,posY,cSize + 4,0,Math.PI*2);
        ctx.closePath();
        ctx.fillStyle = "#101";
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(posX,posY,cSize,0,Math.PI*2);
        ctx.closePath();
        ctx.fillStyle = "#f00";
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(posX,posY,cSize + 2,0,Math.PI*2);
        ctx.closePath();
        ctx.strokeStyle = "#f00";
        ctx.stroke();
    }
    
    function generateCanvases()
    {
        var doc = document.getElementById("display");
        mazeCanvas = document.createElement("canvas");
        pathCanvas = document.createElement("canvas");
        
        mazeCanvas.id = "mazeCanvas";
        pathCanvas.id = "pathCanvas";
        
        height = scale*(MAZE[0].length);
        width = scale*(MAZE.length);
        
        mazeCanvas.width = width;
        mazeCanvas.height = height;
        pathCanvas.width = width;
        pathCanvas.height = height;
        
        doc.appendChild(pathCanvas);
        doc.appendChild(mazeCanvas);
        
        resize();
    }
    
    function resize()
    {
        var posX = window.innerWidth/2 - width/2;
        var posY = window.innerHeight/2 - height/2;
        mazeCanvas.style.left = posX + "px";
        mazeCanvas.style.top = posY + "px";
        pathCanvas.style.left = posX + "px";
        pathCanvas.style.top = posY + "px";
    }
    
    function main()
    {
        if(queue.length != 0)
        {
            updatePathfinder();
            renderPathfinder();
        }
        if(reached)
        {
            updateWayBack();
        }
        requestAnimationFrame(main);
    }
    
    function init()
    {
        generateCanvases();
        window.addEventListener("resize",resize);
        renderMaze();
        main();
    }
    
    init();
})();