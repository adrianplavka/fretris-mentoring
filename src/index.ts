
import { server } from './app';

const port = 8000;
server.listen(process.env.PORT || port);
console.log("<Tetris Online> @ Index > Started on port", port);
