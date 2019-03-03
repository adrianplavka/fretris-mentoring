
import * as React from 'react';
import { connect } from 'react-redux';
import * as Hammer from 'hammerjs';

import { SoloGame as Tetris } from '../../game/index';
import { RootState } from '../../reducers/store';
import { isMobile } from '../../utils';

import './styles.css';

namespace SoloPlayground {
    export interface StateProps {
        score: number;
        pause: bool;
    }

    export type Props = StateProps;

    export interface State {
        tetrisNotify: JSX.Element;
    }
}

function mapStateToProps(state: RootState) {
    return {
        score: state.playground.score,
        pause: state.playground.pause
    };
}

function mapDispatchToProps(dispatch: any) {
    return {};
}

class SoloPlaygroundComponent extends React.Component<SoloPlayground.Props, SoloPlayground.State> {
    private game: Tetris;
    private swipeDelay: number = 0;
    private readonly swipeDelayMax: number = 3;
    private swipeAction: number;
    private mc: HammerManager;

    constructor(props: SoloPlayground.Props) {
        super(props);
        this.state = { tetrisNotify: null };

        this.tetrisNotify = this.tetrisNotify.bind(this);
    }

    componentDidMount() {
        this.game = new Tetris(this.tetrisNotify);
        this.game.newGame();

        this.mountSwipe();
    }

    render() {
        return (
            <div className="container animated fadeIn">
                <div id="solo-playground">
                    <div className="playground-header">
                        <h1 className="playground-title animated infinite pulse">
                            Fretris!
                        </h1>
                        <h3 className="playground-mode">
                            Solo Mode
                        </h3>
                    </div>
                    <div className="playground">
                        <canvas id="gameCanvas" width="240" height="360"></canvas>
                        <div className="playground-viewbar">
                            <canvas id="nextCanvas" width="135" height="135"></canvas>
                            <h2 className="playground-score">Score: {this.props.score}</h2>
                            {this.props.pause ? <h2 className="playground-pause animated infinite pulse">Paused!</h2> : ""}
                        </div>
                    </div>
                </div>
                {this.state.tetrisNotify}
            </div>
        );
    }

    componentWillUnmount() {
        this.game.cancel();
        this.unmountSwipe();
    }

    mountSwipe() {
        if (isMobile()) {
            this.mc = new Hammer.Manager(document.getElementById("root"), {});
            this.mc.add(new Hammer.Pan({ 
                direction: Hammer.DIRECTION_ALL, 
                threshold: 10, 
                posThreshold: 300 
            }));
            this.mc.add(new Hammer.Tap());

            this.mc.on('pan', (ev) => {
                switch (ev.direction) {
                    case Hammer.DIRECTION_LEFT:
                        if (this.swipeDelay >= this.swipeDelayMax && this.swipeAction == Hammer.DIRECTION_LEFT) {
                            this.game.moveLeft();
                            this.swipeDelay = 0;
                        }
                        this.swipeAction = Hammer.DIRECTION_LEFT;
                        this.swipeDelay++;
                        break;
                    case Hammer.DIRECTION_RIGHT:
                        if (this.swipeDelay >= this.swipeDelayMax && this.swipeAction == Hammer.DIRECTION_RIGHT) {
                            this.game.moveRight();
                            this.swipeDelay = 0;
                        }
                        this.swipeAction = Hammer.DIRECTION_RIGHT;
                        this.swipeDelay++;
                        break;
                    case Hammer.DIRECTION_UP:
                        break;
                    default:
                        if (this.swipeDelay >= this.swipeDelayMax && this.swipeAction == Hammer.DIRECTION_DOWN) {
                            this.game.moveDown();
                            this.swipeDelay = 0;
                        }
                        this.swipeAction = Hammer.DIRECTION_DOWN;
                        this.swipeDelay++;
                        break;
                }
            });

            this.mc.on('tap', (ev) => {
                this.game.rotate();
            });
        }
    }

    unmountSwipe() {
        if (isMobile()) {
            this.mc.destroy();
        }
    }

    tetrisNotify() {
        this.setState({ 
            ...this.state, 
            tetrisNotify:
                <div className="animated playground-notify"><p unselectable>Fretris!</p></div>
        });
        setTimeout(() => {
            this.setState({
                ...this.state,
                tetrisNotify: null
            });
        }, 1500);
    }
}

export const SoloPlayground = connect(mapStateToProps, mapDispatchToProps)(SoloPlaygroundComponent);
