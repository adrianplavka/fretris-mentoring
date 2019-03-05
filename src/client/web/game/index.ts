
import * as _ from 'lodash';
import * as io from 'socket.io-client';
import { store } from '../reducers/store';

import { setScore, setPause } from '../actions/playground';

// shim layer with setTimeout fallback
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        //window.mozRequestAnimationFrame    || 
        //window.oRequestAnimationFrame      ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

export class Point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Shape {
    public points: Point[]; // points that make up this shape
    public rotation = 0; // what rotation 0,1,2,3
    public fillColor: string | CanvasGradient;

    private move(x: number, y: number): Point[] {
        var newPoints = [];

        for (var i = 0; i < this.points.length; i++) {
            newPoints.push(new Point(this.points[i].x + x, this.points[i].y + y));
        }
        return newPoints;
    }

    public setPos(newPoints: Point[]) {
        this.points = newPoints;
    }

    // Return a set of points showing where this shape would be if we dropped it by one
    public drop(): Point[] {
        /**
         * #5 Bug:
         * 
         * User can move Tetris shapes to the left, right & down.
         * This method should move all the blocks of the shape downwards, but since it's missing,
         * it doesn't do anything.
         * 
         * 'this.move' is a method, that accepts x & y coordinates.
         * It will move all the blocks into certain directions, depending on the x & y coordinates.
         * 
         * Since downward movement is always changing the y coordinate, the x should remain zero.
         * Call this method, that will increase the y coordinates by 1 and then return the value of this method.
         */
    

        // Your code goes here.
        return this.move(0,1);
    }

    // Return a set of points showing where this shape would be if we moved left by one
    public moveLeft(): Point[] {
        return this.move(-1, 0);
    }

    // Return a set of points showing where this shape would be if we moved right by one
    public moveRight(): Point[] {
        /**
         * #7 Bug:
         * 
         * User can move Tetris shapes to the left, right & down.
         * This method should move all the blocks of the shape to the right, but since it's missing,
         * it doesn't do anything.
         * 
         * 'this.move' is a method, that accepts x & y coordinates.
         * It will move all the blocks into certain directions, depending on the x & y coordinates.
         * 
         * Since the right movement is always changing the x coordinate, the y should remain zero.
         * Call this method, that will increase the x coordinates by 1 and then return the value of this method.
         */

        // Your code goes here.
        return undefined;
    }

    // Return a set of points showing where this shape would be if we rotate it
    public rotate(clockwise: boolean): Point[] {
        throw new Error("This method is abstract");
    }
}

export class SquareShape extends Shape {
    constructor(cols: number) {
        super();
        this.fillColor = '#1dcd9f';
        var x = cols / 2;
        var y = -2;
        this.points = [];
        this.points.push(new Point(x, y));
        this.points.push(new Point(x + 1, y));
        this.points.push(new Point(x, y + 1));
        this.points.push(new Point(x + 1, y + 1));
    }

    public rotate(clockwise: boolean): Point[] {
        /**
         * #4 Bug:
         * 
         * Tetris blocks can rotate always by 90 degrees.
         * This square shape can't rotate, as of yet.
         * 
         * Calculate the new points of this shape, when it rotates.
         * After calculation, return the points.
         * 
         * (Hint: Since a square's shape doesn't change when rotating, 
         * then just simply return 'this.points' attribute).
         */

        // Your code goes here.
        return this.points;
    }
}

export class LShape extends Shape {
    public leftHanded: boolean;

    constructor(leftHanded: boolean, cols: number) {
        super();
        this.leftHanded = leftHanded;
        this.setFillColor(leftHanded);

        var x = cols / 2;
        var y = -2;
        this.points = [];

        this.points.push(new Point(x, y - 1));
        this.points.push(new Point(x, y)); // 1 is our base point
        this.points.push(new Point(x, y + 1));
        this.points.push(new Point(x + (leftHanded ? -1 : 1), y + 1));
    }

    public setFillColor(leftHanded: boolean): void {
        /**
         * #6 Bug:
         * 
         * Tetris blocks always have an appropriate color.
         * This method should set a specific color to this block, but currently, it is empty, 
         * so it won't assign any color.
         * 
         * There should exists a check, whether the parameter 'leftHanded' is true or false.
         * If it's true, then it should assign a string value '#ff395e' to the 'this.fillColor' attribute.
         * Otherwise, it should assign a string '#0fc9e7'.
         */

         // Your code goes here.
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 4;
        var newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? -1 : 1), this.points[1].y + 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y + (this.leftHanded ? -1 : 1)));
                break;
            case 2:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? 1 : -1), this.points[1].y - 1));
                break;
            case 3:
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y + (this.leftHanded ? 1 : -1)));
                break;
        }
        return newPoints;
    }
}

export class StepShape extends Shape {
    public leftHanded: boolean;

    constructor(leftHanded: boolean, cols: number) {
        super();
        this.setFillColor(leftHanded);

        this.leftHanded = leftHanded;
        var x = cols / 2;
        var y = -1;

        this.points = [];
        this.points.push(new Point(x + (leftHanded ? 1 : -1), y));
        this.points.push(new Point(x, y)); // point 1 is our base point
        this.points.push(new Point(x, y - 1));
        this.points.push(new Point(x + (leftHanded ? -1 : 1), y - 1));
    }

    public setFillColor(leftHanded: boolean): void {
        /**
         * #3 Bug:
         * 
         * Tetris blocks always have an appropriate color.
         * This method should set a specific color to this block, but currently, it is empty, 
         * so it won't assign any color.
         * 
         * There should exists a check, whether the parameter 'leftHanded' is true or false.
         * If it's true, then it should assign a string value '#3e4377' to the 'this.fillColor' attribute.
         * Otherwise, it should assign a string '#e9007f'.
         */

         // Your code goes here.
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;

        var newPoints = [];

        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? 1 : -1), this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? -1 : 1), this.points[1].y - 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + (this.leftHanded ? 1 : -1)));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y + (this.leftHanded ? -1 : 1)));
                break;
        }
        return newPoints;
    }
}

export class StraightShape extends Shape {
    constructor(cols: number) {
        super();
        this.fillColor = '#4a2c2c';
        var x = cols / 2;
        var y = -2;
        this.points = [];
        this.points.push(new Point(x, y - 2));
        this.points.push(new Point(x, y - 1));
        this.points.push(new Point(x, y)); // point 2 is our base point
        this.points.push(new Point(x, y + 1));
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;
        var newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints[0] = new Point(this.points[2].x, this.points[2].y - 2);
                newPoints[1] = new Point(this.points[2].x, this.points[2].y - 1);
                newPoints[2] = new Point(this.points[2].x, this.points[2].y);
                newPoints[3] = new Point(this.points[2].x, this.points[2].y + 1);
                break;
            case 1:
                newPoints[0] = new Point(this.points[2].x + 2, this.points[2].y);
                newPoints[1] = new Point(this.points[2].x + 1, this.points[2].y);
                newPoints[2] = new Point(this.points[2].x, this.points[2].y);
                newPoints[3] = new Point(this.points[2].x - 1, this.points[2].y);
                break;
        }
        return newPoints;
    }
}

export class TShape extends Shape {
    constructor(cols: number) {
        super();
        this.fillColor = '#ffd05b';
        this.points = [];
        var x = cols / 2;
        var y = -2;
        this.points.push(new Point(x - 1, y));
        this.points.push(new Point(x, y)); // point 1 is our base point
        this.points.push(new Point(x + 1, y));
        this.points.push(new Point(x, y + 1));
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 4;
        var newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                break;
            case 2:
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                break;
            case 3:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                break;
        }
        return newPoints;
    }
}

export class Grid {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private rows: number;
    public cols: number;
    public blockSize: number;
    private blockColor: any[][];
    public backColor: any;
    private xOffset: number;
    private yOffset: number;
    private tetrisNotifyCallback: () => void;

    constructor(rows: number, cols: number, blockSize: number, backColor: string | CanvasGradient, canvas: HTMLCanvasElement, tetrisNotifyCallback?: () => void) {
        this.canvas = canvas;
        this.context = this.canvas && canvas.getContext("2d") as CanvasRenderingContext2D;
        this.blockSize = blockSize;
        this.blockColor = new Array(rows);
        this.backColor = backColor;
        this.cols = cols;
        this.rows = rows;
        for (var r = 0; r < rows; r++) {
            this.blockColor[r] = new Array(cols);
        }
        this.xOffset = 20;
        this.yOffset = 20;
        this.tetrisNotifyCallback = tetrisNotifyCallback;
    }

    public draw(shape: Shape) {
        if (shape) {
            this.paintShape(shape, shape.fillColor);
        }
    }

    public erase(shape: Shape) {
        this.paintShape(shape, this.backColor);
    }

    private paintShape(shape: Shape, color: any) {
        shape.points.forEach(p => this.paintSquare(p.y, p.x, color));
    }

    public getPreferredSize(): Point {
        return new Point(this.blockSize * this.cols, this.blockSize * this.rows);
    }

    // check the set of points to see if they are all free
    public isPosValid(points: Point[]) {
        var valid: boolean = true;
        for (var i = 0; i < points.length; i++) {
            if ((points[i].x < 0) ||
                (points[i].x >= this.cols) ||
                (points[i].y >= this.rows)) {
                valid = false;
                break;
            }
            if (points[i].y >= 0) {
                if (this.blockColor[points[i].y][points[i].x] != this.backColor) {
                    valid = false;
                    break;
                }
            }
        }
        return valid;
    }

    public addShape(shape: Shape) {
        for (var i = 0; i < shape.points.length; i++) {
            if (shape.points[i].y < 0) {
                // a block has landed and it isn't even fully on the grid yet
                return false;
            }
            this.blockColor[shape.points[i].y][shape.points[i].x] = shape.fillColor;
        }
        return true;
    }

    public eraseGrid() {
        if (this.context) {
            this.context.fillStyle = this.backColor;
            var width = this.cols * this.blockSize;
            var height = this.rows * this.blockSize;
    
            this.context.fillRect(this.xOffset, this.yOffset, width, height);
        }
    }

    public clearGrid() {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                this.blockColor[row][col] = this.backColor;
            }
        }
        this.eraseGrid();
    }

    private paintSquare(row: any, col: any, color: string | CanvasGradient) {
        if (row >= 0 && this.context) { // don't paint rows that are above the grid
            this.context.fillStyle = color;
            this.context.fillRect(this.xOffset + col * this.blockSize, this.yOffset + row * this.blockSize, this.blockSize - 1, this.blockSize - 1);
        }
    }

    public drawGrid() {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                if (this.blockColor[row][col] !== this.backColor) {
                    this.paintSquare(row, col, this.blockColor[row][col]);
                }
            }
        }
    }

    public paint() {
        this.eraseGrid();
        this.drawGrid();
    }

    public isTetrisNotifiable(rowsRemoved: number): boolean {
        /**
         * #2 Bug:
         * 
         * After destroying 4 consequent rows of Tetris blocks, the logo 'Fretris!' should appear.
         * Unfortunately, it doesn't work right now.
         * 
         * Check, if the parameter 'rowsRemoved' is exactly 4 rows long and return 'true' value.
         * Otherwise, return 'false' value.
         */

         // Your code goes here.
         // Remove the 'return undefined' statement, before writing your own implementation.
         return undefined;
    }

    // only the rows in last shape could have been filled
    public checkRows(lastShape: Shape) {
        var rowMin = lastShape.points[0].y;
        var rowMax = lastShape.points[0].y;
        var rowComplete;
        var rowsRemoved = 0;
        for (var i = 1; i < lastShape.points.length; i++) {
            if (lastShape.points[i].y < rowMin) {
                rowMin = lastShape.points[i].y;
            }
            if (lastShape.points[i].y > rowMax) {
                rowMax = lastShape.points[i].y;
            }
        }
        if (rowMin < 0) {
            rowMin = 0;
        }

        while (rowMax >= rowMin) {
            rowComplete = true;
            for (var col = 0; col < this.cols; col++) {
                if (this.blockColor[rowMax][col] == this.backColor) {
                    rowComplete = false;
                    break;
                }
            }
            if (rowComplete) {
                rowsRemoved++;
                // shuffle down, stay on this row
                for (var r = rowMax; r >= 0; r--) {
                    for (col = 0; col < this.cols; col++) {
                        if (r > 0)
                            this.blockColor[r][col] = this.blockColor[r - 1][col];
                        else
                            this.blockColor[r][col] = this.backColor;
                    }
                }
                rowMin++;
            }
            else {
                // move up a row
                rowMax--;
            }
        }

        if (rowsRemoved > 0) {
            if (this.isTetrisNotifiable(rowsRemoved)) {
                // Tetris notification, when four rows were removed in one go.
                this.tetrisNotifyCallback();
            }  
            this.eraseGrid();
            this.paint();
        }
        return rowsRemoved;
    }
}

export class SoloGame {
    private canvas: HTMLCanvasElement;
    private nextCanvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private running: boolean = false;
    private currentShape: Shape;
    private nextShape: Shape;
    private _nextShape: Shape;
    private grid: Grid;
    private nextGrid: Grid;
    private speed: number; // in milliseconds
    private level: number;
    private rowsCompleted: number;
    private gameState = { initial: 0, playing: 1, paused: 2, gameover: 3 };
    private phase = this.gameState.initial;
    private score: number;
    private timerToken: number;
    private pausedImage: HTMLImageElement;
    private randomShapes: string[] = [];
    private tetrisNotifyCallback: () => void;

    constructor(tetrisNotifyCallback: () => void) {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.nextCanvas = document.getElementById('nextCanvas') as HTMLCanvasElement;
        this.context = this.canvas && this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.grid = new Grid(16, 10, 20, '#f5f5f5', this.canvas, tetrisNotifyCallback);
        this.nextGrid = new Grid(16, 10, 20, '#f5f5f5', this.nextCanvas);
        this.grid.eraseGrid();
        this.nextGrid.eraseGrid();
        this.speed = 1000;
        var x = this;
        this.keyhandler = this.keyhandler.bind(this);
        document.addEventListener("keydown", this.keyhandler);

        this.tetrisNotifyCallback = tetrisNotifyCallback;
    }

    private draw() {
        if (this.phase == this.gameState.playing) {
            this.grid.paint();
            this.grid.draw(this.currentShape);
            // recursive render loop
            requestAnimFrame((function (self) {
                return function () { self.draw(); };
            })(this));
        }
    }

    public newGame() {
        this.grid.clearGrid();
        this.currentShape = this.newShape();
        this._nextShape = this.newShape();
        this.nextShape = _.cloneDeep(this._nextShape)
        this.showNextShape();

        this.rowsCompleted = 0;
        this.score = 0;
        this.level = -1;
        this.speed = 900;
        this.phase = this.gameState.playing;
        this.randomShapes = [];
        store.dispatch(setPause(false));
        store.dispatch(setScore(this.score));

        // kick off the render loop
        requestAnimFrame((function (self) {
            return function () { self.draw(); };
        })(this));
        this.incrementLevel(); // will start the game timer & update the labels
    }

    public cancel() {
        window.clearInterval(this.timerToken);
        document.removeEventListener("keydown", this.keyhandler);
        requestAnimationFrame((self) => {});
    }

    public showNextShape() {
        this.nextGrid.clearGrid();
        var points = this.nextShape.drop();
        this.nextShape.setPos(points);
        var points = this.nextShape.drop();
        this.nextShape.setPos(points);
        var points = this.nextShape.drop();
        this.nextShape.setPos(points);
        var points = this.nextShape.drop();

        switch (this.nextShape.constructor) {
            case SquareShape:
                points.forEach((point) => {
                    point.x -= 3;
                });
                this.nextShape.setPos(points);
                break;
            case TShape:
                points.forEach((point) => {
                    point.x -= 2;
                });
                this.nextShape.setPos(points);
                break;
            case LShape:
                let typo = this.nextShape as any;
                if (typo.leftHanded) {
                    points.forEach((point) => {
                        point.x -= 2;
                    });
                    this.nextShape.setPos(points);
                } else {
                    points.forEach((point) => {
                        point.x -= 3;
                    });
                    this.nextShape.setPos(points);
                }
                break;
            case StepShape:
                let typ = this.nextShape as any;
                if (typ.leftHanded) {
                    points.forEach((point) => {
                        point.x -= 3;
                    });
                    this.nextShape.setPos(points);
                } else {
                    points.forEach((point) => {
                        point.x -= 2;
                    });
                    this.nextShape.setPos(points);
                }
                break;
            case StraightShape:
                points.forEach((point) => {
                    point.x -= 3;
                });
                this.nextShape.setPos(points);
                break;
        }
        this.nextGrid.paint();
        this.nextGrid.draw(this.nextShape);
    }

    private gameTimer() {
        if (this.phase == this.gameState.playing) {
            var points = this.currentShape.drop();
            if (this.grid.isPosValid(points)) {
                this.currentShape.setPos(points);
            }
            else {
                this.shapeFinished();
            }
        }
    }

    private keyhandler(event: KeyboardEvent) {
        var points: Point[] = [];
        if (this.phase == this.gameState.playing) {
            switch (event.keyCode) {
                case 39: // right
                case 68: // D
                    this.moveRight();
                    break;
                case 37: // left
                case 65: // A
                    this.moveLeft();
                    break;
                case 38: // up arrow
                case 87: // W
                case 32: // spacebar
                    this.rotate();
                    break;
                case 40: // down arrow
                case 83: // S
                    this.moveDown();
                    break;
            }
        }

        if (event.keyCode == 113) { // F2
            this.newGame();
        }
        else if (event.keyCode == 80) { // P = Pause
            this.togglePause();
        }
        else if (event.keyCode == 70) { // F = Faster
            if ((this.level < 10) && (this.phase == this.gameState.playing) || (this.phase == this.gameState.paused)) {
                this.incrementLevel();
            }
        }
    }

    public moveLeft() {
        var points: Point[] = [];
        if (this.phase == this.gameState.playing) {
            points = this.currentShape.moveLeft();

            if (this.grid.isPosValid(points)) {
                this.currentShape.setPos(points);
            }
        }
    }

    public moveRight() {
        var points: Point[] = [];
        if (this.phase == this.gameState.playing) {
            points = this.currentShape.moveRight();

            if (this.grid.isPosValid(points)) {
                this.currentShape.setPos(points);
            }
        }
    }

    public rotate() {
        var points: Point[] = [];
        if (this.phase == this.gameState.playing) {
            points = this.currentShape.rotate(true);

            if (this.grid.isPosValid(points)) {
                this.currentShape.setPos(points);
            }
        }
    }

    public moveDown() {
        var points: Point[] = [];
        if (this.phase == this.gameState.playing) {
            points = this.currentShape.drop();
            if (this.grid.isPosValid(points)) {
                this.currentShape.setPos(points);
            }
        }
    }

    public getGameState() {
        return this.gameState;
    }

    public getGamePhase() {
        return this.phase;
    }

    public setGamePhase(state) {
        this.phase = state;
    }

    public togglePause(): void {
        /**
         * #1 Bug:
         * 
         * Users can pause & unpause the game, whenever they press a 'P' key. 
         * Unfortunately, this function is empty, therefore it doesn't do anything!
         * 
         * In order to fix this bug, we have to check, if the game is in either 'pause' or 'playing' state.
         * The current state of the game is stored in 'this.phase' attribute.
         * 
         * We have to compare 'this.phase' with an attribute, which is stored in 'this.gameState'.
         * 
         * If we then find out, that the game is in 'this.gameState.paused' state, we have to call a method, that will resume the game
         * (which is the method 'this.setPlayingState').
         * 
         * Otherwise, if the game is in 'this.gameState.playing' state, we have to call a method, that will pause the game
         * (which is the method 'this.setPausedState').
         */

         // Your code goes here.
    }

    private setPlayingState() {
        this.phase = this.gameState.playing;
        // Kick the render loop off again.
        store.dispatch(setPause(false));
        this.draw();
    }

    private setPausedState() {
        this.phase = this.gameState.paused;
        store.dispatch(setPause(true));
    }

    private incrementLevel() {
        if (this.level < 7) {
            this.level++;
            this.speed -= 100;

            clearTimeout(this.timerToken);
            this.timerToken = window.setInterval((function (self) {
                return function () { self.gameTimer(); };
            })(this), this.speed);
        }
    }

    private shapeFinished() {
        if (this.grid.addShape(this.currentShape)) {
            this.grid.draw(this.currentShape);
            const completed = this.grid.checkRows(this.currentShape); // and erase them
            this.rowsCompleted += completed;
            this.score += (completed * (this.level + 1) * 10);
            store.dispatch(setScore(this.score));

            if (this.rowsCompleted > ((this.level + 1) * 10)) {
                this.incrementLevel();
            }

            this.currentShape = this._nextShape;
            this._nextShape = this.newShape();
            this.nextShape = _.cloneDeep(this._nextShape);
            this.showNextShape();
        }
        else {
            // Game over!
            this.phase = this.gameState.gameover;
            clearTimeout(this.timerToken);
        }
    }

    private newShape(): Shape {
        if (this.randomShapes.length === 0) {
            this.randomShapes = [
                'L', 'L', 'L', 'L',
                'LR', 'LR', 'LR', 'LR',
                'T', 'T', 'T', 'T',
                'SS', 'SS', 'SS', 'SS',
                'SZ', 'SZ', 'SZ', 'SZ',
                'S', 'S', 'S', 'S',
                'I', 'I', 'I', 'I'
            ];
        }

        var randomIndex = Math.floor(Math.random() * this.randomShapes.length - 1);
        var newShape: Shape | string = this.randomShapes.splice(randomIndex, 1)[0];
        switch (newShape) {
            case 'L':
                newShape = new LShape(false, this.grid.cols);
                break;
            case 'LR':
                newShape = new LShape(true, this.grid.cols);
                break;
            case 'T':
                newShape = new TShape(this.grid.cols);
                newShape.setPos(newShape.rotate(true));
                break;
            case 'SS':
                newShape = new StepShape(false, this.grid.cols);
                break;
            case 'SZ':
                newShape = new StepShape(true, this.grid.cols);
                break;
            case 'S':
                newShape = new SquareShape(this.grid.cols);
                break;
            case 'I':
                newShape = new StraightShape(this.grid.cols);
                newShape.setPos(newShape.rotate(true));
                break;
            default:
                newShape = new LShape(false, this.grid.cols);
                break;
        }
        return newShape;
    }
}

export class DuoGame {
    public canvas: HTMLCanvasElement;
    public nextCanvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public running: boolean = false;
    public currentShape: Shape;
    public nextShape: Shape;
    public _nextShape: Shape;
    public grid: Grid;
    public nextGrid: Grid;
    static gameState = { initial: 0, playing: 1, paused: 2, gameover: 3 };
    public phase = DuoGame.gameState.initial;
    public score: number;
    public socket: SocketIOClient.Socket;
    public mine: bool;
    private tetrisNotifyCallback: () => void;

    constructor(socket: SocketIOClient.Socket, mine: bool, tetrisNotifyCallback: () => void) {
        this.socket = socket;
        this.mine = mine;
        if (this.mine) {
            this.canvas = document.getElementById('myGameCanvas') as HTMLCanvasElement;
            this.nextCanvas = document.getElementById('myNextCanvas') as HTMLCanvasElement;
        } else {
            this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
            this.nextCanvas = document.getElementById('nextCanvas') as HTMLCanvasElement;
        }
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.grid = new Grid(16, 10, 20, '#f5f5f5', this.canvas, tetrisNotifyCallback);
        this.nextGrid = new Grid(16, 10, 20, '#f5f5f5', this.nextCanvas);
        this.grid.eraseGrid();
        this.nextGrid.eraseGrid();
        this.keyhandler = this.keyhandler.bind(this);
        var x = this;
        if (mine) {
            document.onkeydown = this.keyhandler;
        }
        this.tetrisNotifyCallback = tetrisNotifyCallback;
    }

    public shapeFinished(shape: string) {
        if (this.grid.addShape(this.currentShape)) {
            this.grid.draw(this.currentShape);
            const completed = this.grid.checkRows(this.currentShape); // and erase them

            this.currentShape = this._nextShape;
            this._nextShape = this.newShape(shape);
            this.nextShape = _.cloneDeep(this._nextShape);
            this.showNextShape();
        }
        else {
            // Game over!
            this.phase = DuoGame.gameState.gameover;
        }
    }

    private draw() {
        if (this.phase == DuoGame.gameState.playing) {
            this.grid.paint();
            this.grid.draw(this.currentShape);
            // recursive render loop
            requestAnimFrame((function (self) {
                return function () { self.draw(); };
            })(this));
        }
    }

    public newGame(currentShape: string, nextShape: string) {
        this.grid.clearGrid();
        store.dispatch(setScore(0));
        store.dispatch(setPause(false));
        this.phase = DuoGame.gameState.playing;
        this.currentShape = this.newShape(currentShape);
        this._nextShape = this.newShape(nextShape);
        this.nextShape = _.cloneDeep(this._nextShape)
        this.showNextShape();

        // kick off the render loop
        requestAnimFrame((function (self) {
            return function () { self.draw(); };
        })(this));
    }

    public showNextShape() {
        this.nextGrid.clearGrid();
        var points = this.nextShape.drop();
        this.nextShape.setPos(points);
        var points = this.nextShape.drop();
        this.nextShape.setPos(points);
        var points = this.nextShape.drop();
        this.nextShape.setPos(points);
        var points = this.nextShape.drop();

        switch (this.nextShape.constructor) {
            case SquareShape:
                points.forEach((point) => {
                    point.x -= 3;
                });
                this.nextShape.setPos(points);
                break;
            case TShape:
                points.forEach((point) => {
                    point.x -= 2;
                });
                this.nextShape.setPos(points);
                break;
            case LShape:
                let typo = this.nextShape as any;
                if (typo.leftHanded) {
                    points.forEach((point) => {
                        point.x -= 2;
                    });
                    this.nextShape.setPos(points);
                } else {
                    points.forEach((point) => {
                        point.x -= 3;
                    });
                    this.nextShape.setPos(points);
                }
                break;
            case StepShape:
                let typ = this.nextShape as any;
                if (typ.leftHanded) {
                    points.forEach((point) => {
                        point.x -= 3;
                    });
                    this.nextShape.setPos(points);
                } else {
                    points.forEach((point) => {
                        point.x -= 2;
                    });
                    this.nextShape.setPos(points);
                }
                break;
            case StraightShape:
                points.forEach((point) => {
                    point.x -= 3;
                });
                this.nextShape.setPos(points);
                break;
        }
        this.nextGrid.paint();
        this.nextGrid.draw(this.nextShape);
    }

    private keyhandler(event: KeyboardEvent) {
        var points: Point[] = [];
        if (this.phase == DuoGame.gameState.playing) {
            switch (event.keyCode) {
                case 39: // right
                case 68: // D
                    this.socket.emit("move", "right");
                    break;
                case 37: // left
                case 65: // A
                    this.socket.emit("move", "left");
                    break;
                case 38: // up arrow
                case 87: // W
                case 32: // spacebar
                    this.socket.emit("move", "up");
                    break;
                case 40: // down arrow
                case 83: // S
                    this.socket.emit("move", "down");
                    break;
            }
            if (event.keyCode == 113) { // F2
                this.socket.emit("start game");
            }
            else if (event.keyCode == 80) { // P = Pause
                this.socket.emit("toggle pause");
            }
            else if (event.keyCode == 70) { // F = Faster
                this.socket.emit("increment level");
            }
        }
    }

    private newShape(s: string) {
        let newShape: Shape;
        switch (s) {
            case 'L':
                newShape = new LShape(false, this.grid.cols);
                break;
            case 'LR':
                newShape = new LShape(true, this.grid.cols);
                break;
            case 'T':
                newShape = new TShape(this.grid.cols);
                newShape.setPos(newShape.rotate(true));
                break;
            case 'SS':
                newShape = new StepShape(false, this.grid.cols);
                break;
            case 'SZ':
                newShape = new StepShape(true, this.grid.cols);
                break;
            case 'S':
                newShape = new SquareShape(this.grid.cols);
                break;
            case 'I':
                newShape = new StraightShape(this.grid.cols);
                newShape.setPos(newShape.rotate(true));
                break;
            default:
                newShape = new LShape(false, this.grid.cols);
                break;
        }
        return newShape;
    }
}
