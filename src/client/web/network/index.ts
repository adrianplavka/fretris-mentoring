
import * as io from 'socket.io-client';

import { isDevMode } from '../utils/dev';

export default class Connection {
    public sck: SocketIOClient.Socket;

    constructor() {
        this.sck = isDevMode
            ? io("http://" + window.location.hostname + ":8000")
            : io("https://" + window.location.hostname);

        this.sck.on("connection", () => {

        });
    }

    public join(name: str) {
        this.sck.emit("join", name);
    }

    public chatMessage(msg: str) {
        this.sck.emit("chat message", msg);
    }
}

export class GameConnection {
    public sck: SocketIOClient.Socket;

    constructor(id: string) {
        this.sck = isDevMode
            ? io("http://" + window.location.hostname + ":8000/" + id)
            : io("https://" + window.location.hostname + "/" + id);
    }
}
