
import { SoloGame, Grid, StepShape, SquareShape, LShape } from './';

describe('SoloGame', () => {
    it('should toggle pause & unpause state', () => {
        const game = new SoloGame(() => {});

        expect(game.getGamePhase()).toBe(game.getGameState().initial);

        game.setGamePhase(game.getGameState().playing);
        expect(game.getGamePhase()).toBe(game.getGameState().playing);

        game.togglePause();
        expect(game.getGamePhase()).toBe(game.getGameState().paused);

    });

    it('should display Fretris! after destroying 4 consequent rows of blocks', () => {
        const grid = new Grid(0, 0, 0, "", undefined);
        
        expect(grid.isTetrisNotifiable(2)).toBeFalsy();

        expect(grid.isTetrisNotifiable(4)).toBeTruthy();
    });

    it('should set an appropriate color for the StepShape block for the both left & right-handed shapes', () => {
        const leftHandedBlock = new StepShape(true, 0);

        expect(leftHandedBlock.fillColor).toBe('#3e4377');

        const rightHandedBlock = new StepShape(false, 0);

        expect(rightHandedBlock.fillColor).toBe('#e9007f');
    });

    it('should set an appropriate color for the LShape block for the both left & right-handed shapes', () => {
        const leftHandedBlock = new LShape(true, 0);

        expect(leftHandedBlock.fillColor).toBe('#ff395e');

        const rightHandedBlock = new LShape(false, 0);

        expect(rightHandedBlock.fillColor).toBe('#0fc9e7');
    });

    it('should rotate a square shape by 90 degrees', () => {
        const square = new SquareShape(0);

        const originalPoints = square.points;
        const newPoints = square.rotate(true);

        expect(newPoints).toMatchObject(originalPoints);
    });

    it('should push the shape downwards by exactly 1', () => {
        const square = new SquareShape(10);

        const originalPoints = square.points;
        const newPoints = square.drop();

        for (let i = 0; i < originalPoints.length; i++) {
            expect(originalPoints[i].x).toBe(newPoints[i].x);
            expect(originalPoints[i].y + 1).toBe(newPoints[i].y);
        }
    });

    it('should push the shape to the right by exactly 1', () => {
        const square = new SquareShape(10);

        const originalPoints = square.points;
        const newPoints = square.moveRight();

        for (let i = 0; i < originalPoints.length; i++) {
            expect(originalPoints[i].x + 1).toBe(newPoints[i].x);
            expect(originalPoints[i].y).toBe(newPoints[i].y);
        }
    });
});
