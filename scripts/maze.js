//globális változók és képek
var context;
var canvas;
var maze;
var mazeHeight;
var mazeWidth;
var player;
var szamlalo;
var img1 = new Image();
var img2 = new Image();

img1.src = "../images/antman.png"; // játék karakter kép forrása
img2.src = "../images/safe.png"; //széf kép betöltése

class Player {

  constructor() {
    this.col = 0;
    this.row = 0;
    this.poscol=-1;
    this.posrow=-1;
  }

}

class MazeCell {

  constructor(col, row) {
    this.col = col;
    this.row = row;

    this.eastWall = true;
    this.northWall = true;
    this.southWall = true;
    this.westWall = true;

    this.visited = false;
  }

}

class Maze {

	constructor(cols, rows, cellSize) {
	//a labirintus konstruktora kezdőérték adás
    this.backgroundColor = "#9f9f9f";
    this.cols = cols;
    this.mazeColor = "#FFFFFF";
    this.rows = rows;
    this.cellSize = cellSize;

    this.cells = [];

    this.generate()

  }

  generate() {
	//a labirintus legenerálása
    mazeHeight = this.rows * this.cellSize;
    mazeWidth = this.cols * this.cellSize;

    canvas.height = mazeHeight;
    canvas.width = mazeWidth;
    canvas.style.height = mazeHeight;
    canvas.style.width = mazeWidth;

    for (var col = 0; col < this.cols; col++) {
      this.cells[col] = [];
      for (var row = 0; row < this.rows; row++) {
        this.cells[col][row] = new MazeCell(col, row);
      }
    }

    var rndCol = Math.floor(Math.random() * this.cols);
    var rndRow = Math.floor(Math.random() * this.rows);

    var stack = [];
    stack.push(this.cells[rndCol][rndRow]);

    var currCell;
    var dir;
    var foundNeighbor;
    var nextCell;

    while (this.hasUnvisited(this.cells)) {
      currCell = stack[stack.length - 1];
      currCell.visited = true;
      if (this.hasUnvisitedNeighbor(currCell)) {
        nextCell = null;
        foundNeighbor = false;
				
        do {
          dir = Math.floor(Math.random() * 4);
          switch (dir) {
            case 0:
              if (currCell.col !== (this.cols - 1) && !this.cells[currCell.col + 1][currCell.row].visited) {
                currCell.eastWall = false;
                nextCell = this.cells[currCell.col + 1][currCell.row];
                nextCell.westWall = false;
                foundNeighbor = true;
              }
              break;
            case 1:
              if (currCell.row !== 0 && !this.cells[currCell.col][currCell.row - 1].visited) {
                currCell.northWall = false;
                nextCell = this.cells[currCell.col][currCell.row - 1];
                nextCell.southWall = false;
                foundNeighbor = true;
              }
              break;
            case 2:
              if (currCell.row !== (this.rows - 1) && !this.cells[currCell.col][currCell.row + 1].visited) {
                currCell.southWall = false;
                nextCell = this.cells[currCell.col][currCell.row + 1];
                nextCell.northWall = false;
                foundNeighbor = true;
              }
              break;
            case 3:
              if (currCell.col !== 0 && !this.cells[currCell.col - 1][currCell.row].visited) {
                currCell.westWall = false;
                nextCell = this.cells[currCell.col - 1][currCell.row];
                nextCell.eastWall = false;
                foundNeighbor = true;
              }
              break;
          }
          if (foundNeighbor) {
            stack.push(nextCell);
          }
        } while (!foundNeighbor)
      } else {
        currCell = stack.pop();
      }
    }

    this.redraw();
	
  }

  hasUnvisited() {
    for (var col = 0; col < this.cols; col++) {
      for (var row = 0; row < this.rows; row++) {
        if (!this.cells[col][row].visited) {
          return true;
        }
      }
    }
    return false;
  }
  //ellenőrzi, hogy a jelenlegi cella mellett van-e olyan amiben még nem járt
  hasUnvisitedNeighbor(mazeCell) {
    return ((mazeCell.col !== 0               && !this.cells[mazeCell.col - 1][mazeCell.row].visited) ||
            (mazeCell.col !== (this.cols - 1) && !this.cells[mazeCell.col + 1][mazeCell.row].visited) ||
            (mazeCell.row !== 0               && !this.cells[mazeCell.col][mazeCell.row - 1].visited) ||
            (mazeCell.row !== (this.rows - 1) && !this.cells[mazeCell.col][mazeCell.row + 1].visited));
  }

  redraw() {
	//labirintus kirajzolása
    context.fillStyle = this.backgroundColor;
	context.fillRect(0, 0, mazeHeight, mazeWidth);
	
	context.drawImage(img2,(this.cols - 1) * this.cellSize, (this.rows - 1) * this.cellSize, this.cellSize, this.cellSize); //széf kirajzolása

    context.strokeStyle = this.mazeColor;
    context.strokeRect(0, 0, mazeHeight, mazeWidth);

    for (var col = 0; col < this.cols; col++) {
      for (var row = 0; row < this.rows; row++) {
        if (this.cells[col][row].eastWall) {
          context.beginPath();
          context.moveTo((col + 1) * this.cellSize, row * this.cellSize);
          context.lineTo((col + 1) * this.cellSize, (row + 1) * this.cellSize);
          context.stroke();
        }
        if (this.cells[col][row].northWall) {
          context.beginPath();
          context.moveTo(col * this.cellSize, row * this.cellSize);
          context.lineTo((col + 1) * this.cellSize, row * this.cellSize);
          context.stroke();
        }
        if (this.cells[col][row].southWall) {
          context.beginPath();
          context.moveTo(col * this.cellSize, (row + 1) * this.cellSize);
          context.lineTo((col + 1) * this.cellSize, (row + 1) * this.cellSize);
          context.stroke();
        }
        if (this.cells[col][row].westWall) {
          context.beginPath();
          context.moveTo(col * this.cellSize, row * this.cellSize);
          context.lineTo(col * this.cellSize, (row + 1) * this.cellSize);
          context.stroke();
        }
      }
    }
	
	context.drawImage(img1,(player.col * this.cellSize) + 2, (player.row * this.cellSize) + 2, this.cellSize - 4, this.cellSize - 4) 
	// karakter újrarajzolása
	
	}


}


function onLoad() {
	//betöltéskor példányosítja a labirintust, eventek kezelése
	canvas = document.getElementById("mainForm");
	context = canvas.getContext("2d");
	
	player = new Player();
	maze = new Maze(15, 15, 35);


	//document.addEventListener("keydown",finish);
	document.addEventListener("keydown", onKeyDown);
	document.getElementById("left").addEventListener("click", left);
	
	document.getElementById("up").addEventListener("click", up);
	
	document.getElementById("right").addEventListener("click", right);
	
	document.getElementById("down").addEventListener("click", down);
}
