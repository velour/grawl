var tilesWide = 20;
var tilesHigh = 10;
var scale = 4;
var blocked = 0.15;
var numChests = 4;
var numUntis = 4;
var numRoyalty = 2;
var numBeers = 1;
var nerdPowerDuration = 250;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var worldStyle = Math.round(Math.random());

var unblockedTile = new Image();
var blockedTile = new Image();
var knight = new Image();
var chest = new Image();
var unti = new Image();
var royalty = new Image();
var beer = new Image();
var nerds = new Image();
var knightSprite = null;
var chestSprites = [];
var untiSprites = [];
var royaltySprites = [];
var beerSprites = [];
var nerdSprites = [];

var grid = [];
var chests = [];
var untis = [];
var royalties = [];
var beers = [];

function reshuffleGame() {
	grid = [];
	chests = [];
	untis = [];
	royalties = [];
	beers = [];

	generateWorld();

	drawGrid();

	knightSprite.goKnight();
	knightSprite.updateLocation(0, 0);


	for(var i = 0; i < numChests; i++) {
		chestSprites[i].hide = false;
		chestSprites[i].updateLocation(chests[i].x, chests[i].y);
	}

	for(var i = 0; i < numUntis; i++) {
		untiSprites[i].updateLocation(untis[i].x, untis[i].y);
	}

	for(var i = 0; i < numRoyalty; i++) {
		royaltySprites[i].updateLocation(royalties[i].x, royalties[i].y);
	}

	for(var i = 0; i < numBeers; i++) {
		beerSprites[i].updateLocation(beers[i].x, beers[i].y);
	}
}

function generateWorld() {
	var remainingChests = numChests;
	for(var r = 0; r < tilesWide; r++) {
		grid.push([]);
		for(var h = 0; h < tilesHigh; h++) {
			grid[r].push({
				blocked : Math.random() <= blocked && (r + h != 0),
				chest : false,
				unti : false,
				royalty : false
			})
		}
	}

	for(var i = 0; i < numChests; i++) {
		var x = Math.floor(Math.random() * tilesWide);
		var y = Math.floor(Math.random() * tilesHigh);
		
		if(!grid[x][y].blocked && !grid[x][y].chest && (x + y != 0)) {
			grid[x][y].chest = true;
			chests.push({ x : x, y: y});
		} else {
			i--;
		}
	}

	for(var i = 0; i < numUntis; i++) {
		var x = Math.floor(Math.random() * tilesWide);
		var y = Math.floor(Math.random() * tilesHigh);
		
		if(!grid[x][y].blocked && !grid[x][y].chest && !grid[x][y].unti && (x + y != 0)) {
			grid[x][y].unti = true;
			untis.push({ x : x, y: y});
		} else {
			i--;
		}
	}

	for(var i = 0; i < numRoyalty; i++) {
		var x = Math.floor(Math.random() * tilesWide);
		var y = Math.floor(Math.random() * tilesHigh);
		
		if(!grid[x][y].blocked && !grid[x][y].chest && !grid[x][y].unti && !grid[x][y].royalty && (x + y != 0)) {
			grid[x][y].royalty = true;
			royalties.push({ x : x, y: y});
		} else {
			i--;
		}
	}

	for(var i = 0; i < numBeers; i++) {
		var x = Math.floor(Math.random() * tilesWide);
		var y = Math.floor(Math.random() * tilesHigh);
		
		if(!grid[x][y].blocked && !grid[x][y].chest && !grid[x][y].unti && !grid[x][y].royalty && (x + y != 0)) {
			grid[x][y].beer = true;
			beers.push({ x : x, y: y});
		} else {
			i--;
		}
	}	
}

function loadImagesThenGo() {
	function knightReady() {
		nerds.addEventListener("load", nerdsReady);
		nerds.src = "img/nerds.png";
	}

	function nerdsReady() {
		beer.addEventListener("load", beerReady);
		beer.src = "img/drink.png";
	}

	function beerReady() {
		unti.addEventListener("load", untiReady);
		unti.src = "img/unti.png";
	}

	function untiReady() {
		royalty.addEventListener("load", royaltyReady);
		royalty.src = "img/royalty.png";
	}

	function royaltyReady() {
		chest.addEventListener("load", chestReady);
		chest.src = "img/chest.png";
	}

	function chestReady() {
		unblockedTile.addEventListener("load", unblockedReady);
		unblockedTile.src = "img/floor-" + worldStyle + ".png";
	}

	function unblockedReady() {
		blockedTile.addEventListener("load", blockedReady);
		blockedTile.src = "img/wall-" + worldStyle + ".png";
	}

	function blockedReady() {
		drawGrid();

		knightSprite = sprite({
			context: context,
			image: knight,
			numberOfHorizontalFrames : 2,
			numberOfVerticalFrames : 1,
			ticksPerFrame : 20,
			loop : true,
			knight: true
		});

		nerdSprite = sprite({
			context: context,
			image: knight,
			numberOfHorizontalFrames : 2,
			numberOfVerticalFrames : 2,
			ticksPerFrame : 20,
			loop : true,
			knight : true,
			nerd : true,
			frameIndexMin : Math.floor(Math.random() * 2) * 2,
			frameIndexMax : Math.floor(Math.random() * 2) * 2 + 2
		});

		for(var i = 0; i < numChests; i++) {
			chestSprites.push(sprite({
				context: context,
				image: chest,
				numberOfHorizontalFrames : 2,
				numberOfVerticalFrames : 1,
				gridX : chests[i].x,
				gridY : chests[i].y,
				ticksPerFrame : 20,
				loop : true
			}));
		}

		for(var i = 0; i < numUntis; i++) {
			untiSprites.push(sprite({
				context: context,
				image: unti,
				numberOfHorizontalFrames : 2,
				numberOfVerticalFrames : 1,
				gridX : untis[i].x,
				gridY : untis[i].y,
				ticksPerFrame : 20,
				loop : true,
				unti : true
			}));
		}

		for(var i = 0; i < numRoyalty; i++) {
			royaltySprites.push(sprite({
				context: context,
				image: royalty,
				numberOfHorizontalFrames : 2,
				numberOfVerticalFrames : 2,
				gridX : royalties[i].x,
				gridY : royalties[i].y,
				ticksPerFrame : 20,
				loop : true,
				frameIndexMin : i * 2,
				frameIndexMax : i * 2 + 2
			}));
		}

		for(var i = 0; i < numBeers; i++) {
			beerSprites.push(sprite({
				context: context,
				image: beer,
				numberOfHorizontalFrames : 1,
				numberOfVerticalFrames : 1,
				gridX : beers[i].x,
				gridY : beers[i].y,
				ticksPerFrame : 20,
				loop : true
			}));
		}

		gameLoop();
	}

	generateWorld();

	knight.addEventListener("load", knightReady);
	knight.src = "img/knight.png";
}

function drawGrid() {
	var canvas1 = document.getElementById("canvas");

	var canvas = document.getElementById("background");
	var context = canvas.getContext("2d");
	context.imageSmoothingEnabled = false;
	canvas.width = canvas1.width = unblockedTile.width * tilesWide * scale;
	canvas.height = canvas1.height = unblockedTile.height * tilesHigh * scale;

	function drawImage(img,x,y) {
		context.imageSmoothingEnabled = false;
		context.drawImage(img, x, y, img.width * scale, img.height * scale);
	}

	for(var r = 0; r < tilesWide; r++) {
		for(var h = 0; h < tilesHigh; h++) {
			if(grid[r][h].blocked) {
				drawImage(blockedTile, blockedTile.width * r * scale, blockedTile.height * h * scale);
			} else {
				drawImage(unblockedTile, unblockedTile.width * r * scale, unblockedTile.height * h * scale);
			}
		}
	}
}

function sprite (options) {

	var that = {};
	that.image = options.image;
	that.knight = options.knight;
	that.unti = options.unti;
	if(that.knight) that.nerd = 0;

	that.numberOfHorizontalFrames = options.numberOfHorizontalFrames || 1;
	that.numberOfVerticalFrames = options.numberOfVerticalFrames || 1;
	that.numberOfFrames = that.numberOfHorizontalFrames * that.numberOfVerticalFrames;

	that.frameIndexMin = options.frameIndexMin || 0;
	that.frameIndexMax = options.frameIndexMax || that.numberOfFrames;
	that.frameIndex = that.frameIndexMin;
	that.tickCount = 0;
	that.ticksPerFrame = options.ticksPerFrame || 0;
	
	that.loop = options.loop;
	that.context = options.context;
	that.width = that.image.width;
	that.height = that.image.height;
	that.frameWidth = that.width / that.numberOfHorizontalFrames;
	that.frameHeight = that.height / that.numberOfVerticalFrames;
	that.lastRow = 0;
	that.column = 0;
	that.gridX = options.gridX || 0;
	that.gridY = options.gridY || 0;
	that.x = that.gridX * that.frameWidth * scale;
	that.y = that.gridY * that.frameHeight * scale;

	that.goNerd = function() {
		knightSprite.image = nerds;
		var randomNerd = Math.floor(Math.random() * 2);
		knightSprite.frameIndex = randomNerd * 2;
		knightSprite.frameIndexMin = randomNerd * 2;
		knightSprite.frameIndexMax = randomNerd * 2 + 2;
		knightSprite.nerd = nerdPowerDuration;
	};

	that.goKnight = function() {
		knightSprite.image = knight;
		knightSprite.nerd = 0;
		knightSprite.frameIndexMin = 0;
		knightSprite.frameIndexMax = 2;
	};

	that.update = function () {
		if(typeof that.nerd !== 'undefined') {
			that.nerd--;
			if(that.nerd < 0) {
				that.nerd = 0;
				that.goKnight();
			}
		}
		that.tickCount += 1;
		if (that.tickCount > that.ticksPerFrame) {
			that.tickCount = 0;
			// If the current frame index is in range
			if (that.frameIndex < that.frameIndexMax - 1) {	
				// Go to the next frame
				that.frameIndex += 1;
			} else if (that.loop) {
				that.frameIndex = that.frameIndexMin;
			}

			that.context.clearRect(that.x, that.y, that.frameWidth * scale, that.frameHeight * scale);

			if(that.unti) {
				grid[that.gridX][that.gridY].unti = false;
			} else if(grid[that.gridX][that.gridY].unti && that.knight) {
				if(that.nerd <= 0)
					that.updateLocation(0,0);
			}

			if((keyPressed && that.knight) || that.unti) {
				switch(that.move) {
					case 0:
						if(that.gridX <= 0) break;
						
						that.gridX -= 1;

						if(grid[that.gridX][that.gridY].blocked) { that.gridX += 1; break; }

						that.x -= unblockedTile.width * scale;
						break;
					case 1:
						if(that.gridY <= 0) break;

						that.gridY -= 1;

						if(grid[that.gridX][that.gridY].blocked) { that.gridY += 1; break; }

						that.y -= unblockedTile.height * scale;
						break;
					case 2:
						if(that.gridX >= tilesWide - 1) break;

						that.gridX += 1;

						if(grid[that.gridX][that.gridY].blocked) { that.gridX -= 1; break; }

						that.x += unblockedTile.width * scale;
						break;
					case 3:
						if(that.gridY >= tilesHigh - 1) break;

						that.gridY += 1;

						if(grid[that.gridX][that.gridY].blocked) { that.gridY -= 1; break; }

						that.y += unblockedTile.height * scale;
						break;
					default:
				}
			}

			if(that.unti) {
				grid[that.gridX][that.gridY].unti = true;
			} else if(that.knight) {
				if(grid[that.gridX][that.gridY].unti && that.nerd <= 0) {
					that.updateLocation(0,0);
				} else if(grid[that.gridX][that.gridY].beer && that.nerd <= 0) {
					that.goNerd();
				} else if(grid[that.gridX][that.gridY].chest) {
					grid[that.gridX][that.gridY].chest = false;
					for(var i = 0; i < chestSprites.length; i++) {
						if(chestSprites[i].gridX == that.gridX && chestSprites[i].gridY == that.gridY) {
							chestSprites[i].hide = true;
							break;
						}
					}
				}
			}
		}
	}; 
	that.render = function () {
		var xOff = Math.floor(that.frameIndex % that.numberOfHorizontalFrames) * that.frameWidth;
		var yOff = Math.floor(that.frameIndex / that.numberOfHorizontalFrames) * that.frameHeight;

		// Draw the animation
		if(!that.hide) {
			that.context.imageSmoothingEnabled = false;
			that.context.drawImage(
				that.image,
				xOff,
				yOff,
				that.frameWidth,
				that.frameHeight,
				that.x,
				that.y,
				that.frameWidth * scale,
				that.frameHeight * scale
			);
		}

	};
	that.updateLocation = function(gridX, gridY) {
		that.gridX = gridX;
		that.gridY = gridY;
		that.x = that.gridX * that.frameWidth * scale;
		that.y = that.gridY * that.frameHeight * scale;
	}
	return that;
}

loadImagesThenGo();

function gameLoop() {

  window.requestAnimationFrame(gameLoop);
  
  var theyWon = true;
  for(var i = 0; i < chestSprites.length; i++) {
  	if(!chestSprites[i].hide) theyWon = false;
  	chestSprites[i].update();
  	chestSprites[i].render();
  }

  for(var i = 0; i < untiSprites.length; i++) {
  	untiSprites[i].move = Math.floor(Math.random() * 4);
  	untiSprites[i].update();
  	untiSprites[i].render();
  }

  for(var i = 0; i < royaltySprites.length; i++) {
  	royaltySprites[i].update();
  	royaltySprites[i].render();
  }

  for(var i = 0; i < beerSprites.length; i++) {
  	beerSprites[i].update();
  	beerSprites[i].render();
  }

  knightSprite.update();
  knightSprite.render();

  if(theyWon) {
  	reshuffleGame();
  }
}

var keyPressed = false;
function doKeyDown(e) {
	switch(e.keyCode) {
		case 37: //left
		knightSprite.move = 0;
		break;
		case 38: //up
		knightSprite.move = 1;
		break;
		case 39: //right
		knightSprite.move = 2;
		break;
		case 40: //down
		knightSprite.move = 3;
		break;
		default:
		return;
	}
	keyPressed = true;
}
window.addEventListener("keydown", doKeyDown, true);

function doKeyUp(e) {
	keyPressed = false;
}
window.addEventListener("keyup", doKeyUp, true);