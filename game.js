let canvas = document.getElementById('game'); //get canvas DOM object
let ctx = canvas.getContext("2d"); //get canvas context

canvas.height = window.innerHeight
canvas.width = window.innerHeight

let X = document.getElementById("size");
let Y = document.getElementById("moves");
let Z = document.getElementById("type");
//keyboard movement{
let xp = 0
let yp = 0
let moves
let mousedown = false;
let posx = 0;
let posy = 0;
let pposx = 0;
let pposy = 0;
let prposx = 0;

let scrambled = false;

let size = Number(X.value); //size x size
    let tsize = 1 / size * canvas.width; //height of the triangle
    
    let yoff = tsize / 2; //y offset of the board
    let xoff = size * tsize; //x offset of the board
    moves = 0;
    let board = [];
let ud
var selectdraw = function() {
    let j = (xp - yp) - 1
    let i = yp - 1
    n = j - ((2 * (i - 1) + 3 - 1) / 2)
    tri(xoff / 2 + tsize * n / 2, (tsize * i + yoff), tsize, ud[i][j])
}
var toggler = function() {
    ctx.globalAlpha = 0;
    ctx.globalAlpha = 1;

}
function bl2num(bl){
  if(bl){return(1)}
  if(!bl){return(-1)}
  
}

function testStart(){
  if (checkwin() && scrambled){
    scrambled = false;
    stop()
  }
  if (scrambled && !run){
    start()
  }
}

function keyboard() {
    document.addEventListener('keydown', function(event) {
        //arrow keys
        if (event.keyCode == 37) {
            xp--
            update()
        } else if (event.keyCode == 38) {
            yp--;
            xp--
            update()
        } else if (event.keyCode == 39) {
            xp++
            update()
        } else if (event.keyCode == 40) {
            yp++
            xp++
            update()

        //qeadzc movement  
        } else if (event.keyCode == 81) {
          move(4, size-(((size-yp+xp+ud[yp][xp]+(size-yp-1))+1)/2));
          //xp--
          //xp--
          //yp--
          update()
          testStart()
        } else if (event.keyCode == 65) {//works
            move(2, yp);
            xp--;
            update();
            testStart()
        } else if (event.keyCode == 90) {
          move(1,size-(((size-yp+yp*2-xp+ud[yp][xp]+(size-yp-1))+1)/2))
          //yp++
          update();
          testStart()
        } else if (event.keyCode == 67) {
            move(5, size-(((size-yp+xp+ud[yp][xp]+(size-yp-1))+1)/2));
          //xp++
          //xp++
          //yp++
            update();
            testStart()
        } else if (event.keyCode == 68) {//works
            move(3, yp);
            xp++;
            update();
            testStart()
        } else if (event.keyCode == 69) {
            move(0, size-(((size-yp+2*yp-xp+ud[yp][xp]+(size-yp-1))+1)/2))
            //xp++
            //yp--
            update();
            testStart()
        }
    });
}

function triangle(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.fill();
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function map(n, imin, imax, omin, omax) {
    return omin + (omax - omin) * (n - imin) / (imax - imin);
}

let tri = function(centerY, centerX, y, ud) {
    y = y / 2;
    if (ud == 0) {
        triangle(centerY, centerX - y, centerY - y, centerX + y, centerY + y, centerX + y)
    }
    if (ud == 1) {
        triangle(centerY, centerX + y, centerY - y, centerX - y, centerY + y, centerX - y)
    }
};

let width = 2 * (size - 1) + 1;

updatesize()

Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
};

Array.prototype.midpop = function(index) {
    this.splice(index, 1);
}

function rotateArr1D(a, b, c) { //define function. a means the amount of spaces to cycle, b is the direction, either 0 (left) or 1 (right), c is the array
    for (let i = 0; i < a; i++) { //for loop that runs as many times as the value of a
        if (b === 0) { //if b is 0, move left
            c.push(c.shift()); //takes the first one away and appends it to the end
        } else if (b === 1) { //if b is 1, move right
            c.unshift(c.pop()); //puts the last one onto the beginning and pops off the last one
        }
    }
    // console.log(c); //log the result
    return c;
};

function rotateArr2DHoriz(a, b, c) { //define function. a means which row, b means how much to rotate, c is the direction, either 0 (left) or 1 (right)
    if (a === 0) {
        return;
    }
    for (let i = 0; i < b; i++) { //for loop that runs as many times as the value of a
        if (c === 0) { //if b is 0, move left
            // console.log(board[a]);
            for (let j = 0; j < board[a].length; j++) {
                // console.log(board[a][j]);
                if (board[a][j] == null) {
                    var nullSpot = j - 1;
                    break;
                }
            }
            if (!nullSpot) {
                var nullSpot = board[a].length - 1;
            }
            // console.log(nullSpot)
            board[a].insert(nullSpot, board[a].shift()); //takes the first one away and inserts it in
        } else if (b === 1) { //if b is 1, move right
            for (let j = 0; j < board[a].length; j++) {
                // console.log(board[a][j]);
                if (board[a][j] == null) {
                    var nullSpot = j;
                    break;
                }
            }
            if (!nullSpot) {
                var nullSpot = 2*(size-1)+1
            }
            board[a].unshift(board[a][nullSpot - 1])
            board[a].midpop(nullSpot);
        }
    }
    // console.log(board);

};

function rotateArr2DVerti(a, b, c) { //define function. a means which column, b means how much to rotate, c is the direction, either 0 (up) or 1 (down)
    let tempArr = [];
    // if (a === 0) {
    //   a = 0.5;
    // }
    for (let i = 0; i < board.length; i++) {
        if (board[i][a * 2] != null && board[i][a * 2 + 1] != null) {
            tempArr.push(board[i][a * 2]);
            tempArr.push(board[i][a * 2 + 1])
        } else if (board[i][a * 2] != null) {
            tempArr.push(board[i][a * 2])
        }
    }
    // console.log(tempArr)
    if (c === 0) {
        rotateArr1D(b * 2, 0, tempArr);
    } else if (c === 1) {
        rotateArr1D(b * 2, 1, tempArr);
    }
    // console.log(tempArr)
    let vnullSkipped = 0;
    let hnullSkipped = 0;
    for (let i = 0; i < board.length; i++) {
        // console.log("Testcase: " + board[i][a])
        if (board[i][a * 2] === null) {
            vnullSkipped++;
            continue;
        } else if (board[i][a * 2] != null) {
            // console.log("Testcase: " + i + "|" + vnullSkipped)
            board[i][a * 2] = tempArr[(i - vnullSkipped) * 2 - hnullSkipped];
            // board[i][a * 2] = tempArr[i * 2 - nullSkipped];
            if (board[i][a * 2 + 1]) {
                board[i][a * 2 + 1] = tempArr[(i - vnullSkipped) * 2 + 1 - hnullSkipped]
            } else {
                hnullSkipped++;
            }
        }
    }
}

function rotateArr2DDiag(a, b, c) { //define function. a means which column, b means how much to rotate, c is the direction, either 0 (left up) or 1 (right down)
    let tempArr = [];
    for (let i = 0; i < board.length - a; i++) {
        // console.log(board[i + a]);
        // console.log ("Test: " + (i + a) + '|' + board.length)
        if (!board[i + a]) {
            break;
        }
        if (board[i + a][i * 2] != null && board[i + a][i * 2 - 1] != null) {
            tempArr.push(board[i + a][i * 2 - 1]);
            tempArr.push(board[i + a][i * 2]);
        } else if (board[i + a][i] != null) {
            tempArr.push(board[i + a][i * 2])
        }
    }
    //   console.log(tempArr)
    if (c === 0) {
        rotateArr1D(b * 2, 0, tempArr);
    } else if (c === 1) {
        rotateArr1D(b * 2, 1, tempArr);
    }
    // console.log(tempArr)
    let nullSkipped = 0;
    for (let i = 0; i < board.length - a; i++) {
        // console.log("Testcase: " + board[i][a])
        if (board[i + a][(i * 2)] == null) {
            nullSkipped++;
            continue;
        } else if (board[i + a][(i * 2)] != null) {
            //   console.log("Testcase: " + i + "|" + nullSkipped + '|' + board[i][a] + '|' + tempArr[i - nullSkipped])
            board[i + a][(i * 2)] = tempArr[i * 2 - nullSkipped];
            if (board[i + a][i * 2 - 1]) {
                board[i + a][i * 2 - 1] = tempArr[i * 2 - 1 - nullSkipped]
            }
        }
    }

}

// rotateArr2DDiag(2, 1, 1);

function move(a, b) { //0 is rup, 1 is ldown, 2 is left, 3 is right, 4 is uleft, 5 is dright, b is the depth
    switch (a) {
        case 0:
            rotateArr2DVerti(b, 1, 0);
            break;
        case 1:
            rotateArr2DVerti(b, 1, 1);
            break;
        case 2:
            rotateArr2DHoriz(b, 1, 0);
            break;
        case 3:
            rotateArr2DHoriz(b, 1, 1);
            break;
        case 4:
            rotateArr2DDiag(b, 1, 0);
            break;
        case 5:
            rotateArr2DDiag(b, 1, 1);
    }

    moves++
    Y.innerText = moves + " moves";
}

var n = 0
var len = [1, 3, 5, 7]

var drawboard = function(itext) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j <= 2 * (i - 1) + 2; j++) {
            n = j - ((2 * (i - 1) + 3 - 1) / 2)

            if (j == xp && i == yp) {
                ctx.globalAlpha = 1
            } else {
                ctx.globalAlpha = 1
            }
            ctx.fillStyle = board[i][j][1];
            tri(xoff / 2 + tsize * n / 2, (tsize * i + yoff), tsize, ud[i][j])
        }
    }
    if (itext) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < 2 * (i - 1) + 3; j++) {

                ctx.fillStyle = "rgb(0,0,0)"
                ctx.font = tsize / 4 + "px Arial";
                n = j - ((2 * (i - 1) + 3 - 1) / 2)
                ctx.textAlign = "center";
                ctx.fillText(board[i][j][0], xoff / 2 + tsize * n / 2, tsize * i + yoff);
            }
        }
    }
    for (let i = 0; i < size; i++) {
        for (let j = 0; j <= 2 * (i - 1) + 2; j++) {
            n = j - ((2 * (i - 1) + 3 - 1) / 2)

            if (j == xp && i == yp) {
                ctx.globalAlpha = 0.375
            } else {
                ctx.globalAlpha = 0
            }
            ctx.fillStyle = "rgb(255,255,255)";
            tri(xoff / 2 + tsize * n / 2, (tsize * i + yoff), tsize, ud[i][j])
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.height, canvas.height);
    if (yp < 0) {
        yp = size - 1;
        xp = yp
    }
    if (yp > size-1) {
        yp = 0
    }
    if (xp < 0) {
        xp = yp * 2
    }
    if (xp > yp * 2) {
        xp = 0
    }
    drawboard(true);
}

function scramble() {
    for (let i = 0; i <= 1000; i++) {
        moves = -1
        move(Math.floor(Math.random() * 6), Math.floor(Math.random() * n))
    }
    scrambled = true;
    reset()
    update()
}
function updatesize() {
    reset()
    let X = document.getElementById("size");
    size = Number(X.value); //size x size
    tsize = 1 / size * canvas.width; //height of the triangle
    
    yoff = tsize / 2; //y offset of the board
    xoff = size * tsize; //x offset of the board
    moves = 0;
    board = [];
    width =  2*(size-1)+1
    let counter = 1;
    for (let i = 0; i < size; i++) {
        board.push([]);
        for (let j = 0; j < 2 * size - 1; j++) {
            if (j < 2 * i + 1) {
                let r = 255 - Math.round(map((size - i) + (width - j), size + width, 0, 0, 255));
                let g = 255 - Math.round(map(i, size, 0, 0, 255));
                let b = 255 - Math.round(map((size - i) + (j), size + width, 0, 0, 255));
                board[i].push([counter, rgbToHex(r, g, b), xoff / 2 + tsize * (j - ((2 * (i - 1) + 3 - 1) / 2)) / 2, j]);
                counter++;
            } else {
                board[i].push(null);
            }
        }
    }
    ud = []
    for (let i = 0; i < size; i++) {
        ud.push([])
        for (let j = 0; j < 2 * size - 1; j++) {
            if (j % 2 == 0) {
                ud[i].push(0)
            } else {
                ud[i].push(1)
            }
        }
    }

}

function checkwin(){
  let X = document.getElementById("size");
  size = Number(X.value); //size x size
  tsize = 1 / size * canvas.width; //height of the triangle
  
  yoff = tsize / 2; //y offset of the board
  xoff = size * tsize; //x offset of the board
  moves = 0;
  newboard = [];
  width =  2*(size-1)+1
  let counter = 1;
  for (let i = 0; i < size; i++) {
      newboard.push([]);
      for (let j = 0; j < 2 * size - 1; j++) {
          if (j < 2 * i + 1) {
              let r = 255 - Math.round(map((size - i) + (width - j), size + width, 0, 0, 255));
              let g = 255 - Math.round(map(i, size, 0, 0, 255));
              let b = 255 - Math.round(map((size - i) + (j), size + width, 0, 0, 255));
              newboard[i].push([counter, rgbToHex(r, g, b)]);
              counter++;
          } else {
              newboard[i].push(null);
          }
      }
  }
  for (row in newboard){
    for (col in newboard[0]){
      if(newboard[row][col] == null){
        continue;
      }
      if (newboard[row][col][0] != board[row][col][0]){
        return false;
      }
    }
  }
  return true;
}

update()
keyboard()

mousecheck()

function mousecheck(){
    window.addEventListener('mousemove', function(e){
        let pos = getMousePos(canvas, e);
        posy = Math.floor(pos.y/tsize);

        let distrec = 1000000;
        posx = null;
        for (cell in board[posy]){
            if (board[posy][cell] != null){
                let dist = Math.abs(board[posy][cell][2]-pos.x);
                if (dist < distrec){
                    distrec = dist;
                    posx = board[posy][cell][3];
                }
            }
        }
        if (mousedown){
            if (posx != prposx || posy != Math.floor(pposy/tsize)){
                console.log('moved')
                //if (Math.abs(posx - prposx) > 10 && Math.abs(posy - Math.floor(pposy/tsize)) > 10){
                    let theta = Math.round((Math.atan2(pposy-pos.y,pos.x-pposx)*180/Math.PI+180)/60)%6;
                    switch(theta){
                        case 0:
                            //console.log('left')
                            move(2, Math.floor(pposy/tsize))
                            break;
                        case 3:
                            //console.log('right')
                            move(3, Math.floor(pposy/tsize))
                            break;
                        case 4:
                            //console.log('up-right', size-(((size-posy+2*posy-posx+ud[posy][posx]+(size-posy-1))+1)/2))
                            //move(0, size-(((size-posy+2*posy-posx+ud[posy][posx]+(size-posy-1))+1)/2))
                    }
                    update()
                //}
            }
        }

        pposx = pos.x;
        pposy = pos.y;
        prposx = posx;
    });
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

canvas.onmousedown = () => {
    mousedown = true; 
}

canvas.onmouseup = () => {
    mousedown = false;
}