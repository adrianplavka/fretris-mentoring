
import * as path from 'path';
import * as Express from 'express';
import * as http from 'http';
import * as socket from 'socket.io';

import { GameNamespace } from './game';

export const app = Express();
export const server = http.createServer(app);
export const io = socket(server);

// Serve static files.
app.use(Express.static("src/client/web/.dist/"));

// Serve the index page.
app.get("*", (req, res) => {
    res.status(200).sendFile(
        `${process.cwd()}/src/client/web/.dist/`
    );
});

export const players: Map<str, str> = new Map();
const games: Map<str, GameNamespace> = new Map();

io.on("connection", (sck) => {
    sck.emit("connection");

    sck.on("join", (name: any) => {
        players.set(sck.id, name);
        sck.broadcast.emit("join", name);
    });

    sck.on("chat message", (msg: any) => {
        io.emit("chat message", { sender: players.get(sck.id), msg: msg });
    });

    sck.on("check room", (id: string) => {
        let check = true;
        const game = games.get(id);
        if (!game || (game.player1 && game.player2)) {
            check = false;
        }
        sck.emit("check room", check);
    });

    sck.on("create room", () => {
        const id = Math.random().toString(36).substr(2, 5);
        const nsp = io.of(id);
        games.set(id, new GameNamespace(id, nsp));
        sck.emit("create room", id);
    });
});
