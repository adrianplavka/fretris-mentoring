
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { connection } from '../../index';
import { CONTEXT_PLAYGROUND_SOLO, CONTEXT_PLAYGROUND_DUO } from '../../actions/app';
import './styles.css';

namespace Auth {
    export interface OwnProps { }

    export interface State {
        disabled: bool;
        context: str;
        duoContext: str;
        redirection: JSX.Element; 
    }

    export type Props = OwnProps & RouteComponentProps<{}>;
}

function mapStateToProps(state: any) {
    return {};
}

function mapDispatchToProps(dispatch: any) {
    return {}
}

export class AuthComponent extends React.Component<Auth.Props, Auth.State> {
    private usernameValue: str;
    private idValue: str;

    constructor(props: Auth.Props) {
        super(props);
        this.state = { 
            disabled: false, 
            context: CONTEXT_PLAYGROUND_SOLO, 
            duoContext: "join", 
            redirection: null 
        };

        this.usernameValue = "";
        this.idValue = "";
        this.submit = this.submit.bind(this);
        this.switch = this.switch.bind(this);
        this.duoSwitch = this.duoSwitch.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeID = this.onChangeID.bind(this);
        this.submitEventListener = this.submitEventListener.bind(this);
        document.addEventListener("keydown", this.submitEventListener, false);
    }

    private async submit() {
        // While the button is disabled, don't submit.
        if (this.state.disabled) return;
        // Otherwise, disable until finished.
        this.setState({
            ...this.state,
            disabled: true
        });

        if (this.state.context === CONTEXT_PLAYGROUND_SOLO) {
            this.setState({
                ...this.state,
                disabled: false,
                redirection: <Redirect to="/g/" push exact />
            });
            return;
        } else {
            if (this.usernameValue.length === 0) return;

            if (this.state.duoContext === "join" && this.idValue === "") return;

            // If the intent is to join a room.
            if (this.state.duoContext === "join") {
                connection.sck.once("check room", (available: bool) => {
                    if (available) {
                        this.setState({
                            ...this.state,
                            disabled: false,
                            redirection: <Redirect to={"/g/" + this.idValue + "/"} exact />
                        });
                    } else {
                        this.setState({
                            ...this.state,
                            disabled: false
                        });
                    }
                });
                connection.sck.emit("check room", this.idValue);
            // If the intent is to create a room.
            } else {
                connection.sck.once("create room", (id: string) => {
                    this.setState({
                        ...this.state,
                        disabled: false,
                        redirection: <Redirect to={"/g/" + id + "/"} exact />
                    });
                });
                connection.sck.emit("create room", connection.sck.id);
            }
        }
    }

    private switch(e: any) {
        const btn = e.target as HTMLButtonElement;
        if (btn.id === "solo") {
            this.setState({ ...this.state, context: CONTEXT_PLAYGROUND_SOLO });
        } else {
            this.setState({ ...this.state, context: CONTEXT_PLAYGROUND_DUO });
        }
    }

    private duoSwitch(e: any) {
        const btn = e.target as HTMLButtonElement;
        if (btn.id === "join") {
            this.setState({ ...this.state, duoContext: "join" });
        } else {
            this.setState({ ...this.state, duoContext: "create" });
        }
    }

    private onChangeUsername(e: any) {
        this.usernameValue = e.target.value;
    }

    private onChangeID(e: any) {
        this.idValue = e.target.value;
    }

    private submitEventListener(e: any) {
        // On ENTER keypress, trigger a submit.
        if (e.which === 13 || e.keyCode === 13) {
            this.submit();
        }
    }

    render() {
        return (
            <div className="container animated fadeIn">
                <h1 className="auth-title animated infinite pulse">
                    Fretris!
                </h1>
                <div className="auth-switch">
                    <button
                        id="solo"
                        className={this.state.context === CONTEXT_PLAYGROUND_SOLO ? "auth-btn selected" : "auth-btn"}
                        onClick={this.switch}
                    >
                        Solo
                    </button>
                    <button
                        id="duo"
                        className={this.state.context === CONTEXT_PLAYGROUND_DUO ? "auth-btn selected" : "auth-btn"}
                        onClick={this.switch}
                    >
                        Duo
                    </button>
                </div>

                {this.state.context === CONTEXT_PLAYGROUND_DUO
                    ?
                    <div className="auth-duo">
                        <input className="auth-input-username"
                            autoFocus
                            type="text"
                            placeholder="Username"
                            onInput={this.onChangeUsername} />
                        {this.state.duoContext === "join" ? <input className="auth-input-id"
                            type="text"
                            placeholder="Room ID"
                            onInput={this.onChangeID} /> : ""}
                        <div className="auth-duo-context">
                            <button
                                id="join"
                                className={this.state.duoContext === "join" ? "auth-btn selected" : "auth-btn"}
                                onClick={this.duoSwitch}
                            >
                                Join
                            </button>
                            <button
                                id="create"
                                className={this.state.duoContext === "create" ? "auth-btn selected" : "auth-btn"}
                                onClick={this.duoSwitch}
                            >
                                Create
                        </button>
                        </div>
                    </div>
                    : ""
                }

                <button
                    className="auth-btn"
                    disabled={this.state.disabled}
                    onClick={this.submit}
                >
                    <i className="fa fa-gamepad" aria-hidden="true" />
                    <span className="auth-space" />
                    Play!
                </button>
                <footer><i className="fa fa-code" aria-hidden="true" /> with <i className="fa fa-heart" aria-hidden="true" /> for the boys, who were there for me.</footer>
                {this.state.redirection}
            </div>
        );
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.submitEventListener, false);
    }
}

export const Auth = connect(mapStateToProps, mapDispatchToProps)(AuthComponent);
