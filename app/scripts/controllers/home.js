'use strict';

/**
 * @ngdoc function
 * @name simApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the simApp
 */
 angular.module('Sim')
 .controller('HomeCtrl', function ($scope) {
 	var stage;
 	var queue;
 	var circle;
 	var LOADER_WIDTH = 400;
 	var stage, loaderBar, loadInterval;
 	var percentLoaded = 0;

 	function init() {
 		queue = new createjs.LoadQueue(false);
 		queue.installPlugin(createjs.Sound);
 		queue.addEventListener("complete", loadComplete);

 		queue.loadManifest([
 		{
 			id: 'butterfly', 
 			src:'images/butterfly.png'
 		}
 		]);
 	}	

	/**
	 * Runs when the queue has been completly loaded
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	 function loadComplete(event) {
	 	setupStage();
	 	setUpTicker();
	 	buildLoaderBar();
	 	startLoad();
	 	createSquare();
	 	createTriangle();
	 	createCircle();
	 	createScreenCover();
	 }

	 function buildLoaderBar() {
	 	loaderBar = new createjs.Shape();
	 	loaderBar.x = loaderBar.y = 100;
	 	loaderBar.graphics.setStrokeStyle(2);
	 	loaderBar.graphics.beginStroke('#000');
	 	loaderBar.graphics.drawRect(0, 0, LOADER_WIDTH, 40);
	 	stage.addChild(loaderBar);
	 }

	 function updateLoaderBar() {
	 	loaderBar.graphics.clear();
	 	loaderBar.graphics.beginFill('#00ff00');
	 	loaderBar.graphics.drawRect(0, 0, LOADER_WIDTH * percentLoaded, 40);
	 	loaderBar.graphics.endFill();
	 	loaderBar.graphics.setStrokeStyle(2);
	 	loaderBar.graphics.beginStroke('#000');
	 	loaderBar.graphics.drawRect(0, 0, LOADER_WIDTH, 40);
	 	loaderBar.graphics.endStroke();
	 }

	 function startLoad() {
	 	loadInterval = setInterval(updateLoad, 50);
	 }

	 function updateLoad() {
	 	percentLoaded += .005;
	 	updateLoaderBar();
	 	if (percentLoaded >= 1) {
	 		clearInterval(loadInterval);
	 		stage.removeChild(loaderBar);
	 	}
	 }

	/**
	 * This function creates a simple red square
	 * @return {[type]} [description]
	 */
	 function createSquare() {
		var g = new createjs.Graphics()  //The actualy reg square
		.beginStroke('#000')
		.beginFill('#FF0000')
		.drawRect(0, 0, 100, 100);

		var square = new createjs.Shape(g);  //Creates vessel for Graphic

		square.regX = square.regY =50; //Sets the center of the square
		square.x = square.y = 100;
		stage.addChild(square);
		rotateItem(square, 360);
	}

	/**
	 * Will do the work to find the next position of the ball, and whether to turn its direction around
	 * @return {[type]} [description]
	 */
	function updateCircle() {
		var nextX = circle.x + (circle.speed * circle.direction);
		if(nextX > stage.canvas.width - circle.radius) {
			nextX = stage.canvas.width - circle.radius;
			circle.direction *= -1;
		} else if (nextX < circle.radius) {
			nextX = circle.radius;
			circle.direction *= -1;
		}

		circle.nextX = nextX;
	}

	/**
	 * This will actually move the ball
	 * @return {[type]} [description]
	 */
	function renderCircle () {
		circle.x = circle.nextX;
	}

	/**
	 * Creates a Circle
	 * @return {[type]} [description]
	 */
	 function createCircle() {
	 	circle = new createjs.Shape();
	 	circle.radius = 50;
	 	circle.graphics.beginStroke('#000');
	 	circle.graphics.beginFill('#FFF000');
		circle.graphics.drawCircle(0, 0, circle.radius); //Used to draw a circle
		circle.x = 250;
		circle.y = 70;
		circle.speed = 10;
		circle.direction = 1;
		stage.addChild(circle);
	}

	/**
	 * A function that will rotate a graphical item to the passed rotation amount.
	 * @param  {[type]} item     [description]
	 * @param  {[type]} rotation [description]
	 * @return {[type]}          [description]
	 */
	 function rotateItem(item, rotation) {
	 	createjs.Tween.get(item).to({'rotation':rotation}, 3000);
	 }

	/**
	 * This function creates a semi transparent shape over the entrie canvas
	 * @return {[type]} [description]
	 */
	 function createScreenCover() {
	 	var screen = new createjs.Shape();
	 	screen.graphics.beginFill(createjs.Graphics.getRGB(0, 0, 0, .6));
	 	screen.graphics.drawRect(0, 0, stage.canvas.width, stage.canvas.height);
	 	stage.addChild(screen);
	 }

	/**
	 * Creates a green triangle on screen
	 * @return {[type]} [description]
	 */
	 function createTriangle() {
	 	var tri = new createjs.Shape();
	 	tri.graphics.beginStroke('#000');
	 	tri.graphics.beginFill('#00FF00');

	 	tri.graphics.moveTo(50, 0)
	 	.lineTo(0, 100)
	 	.lineTo(100, 100)
	 	.lineTo(50, 0);
	 	tri.x = 100;
	 	tri.y = 250;
	 	stage.addChild(tri);
	 }

	/**
	 * Simple set up function for the sage and ticker
	 * @return {[type]} [description]
	 */
	 function setupStage() {
	 	stage = new createjs.Stage('myCanvas');
	 }

	 /**
	  * This function sets up your ticker for the game
	  */
	 function setUpTicker() {
	 	createjs.Ticker.setFPS(60);
	 	createjs.Ticker.addEventListener('tick', updateLoop);
	 }

	/**
	 * This function is the loop that runs trhough the game
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	 function updateLoop(e) {
	 	if(!e.paused){
	 		updateCircle();
	 		renderCircle();
	 		stage.update();
	 	}
	 }

	 init();
	});
