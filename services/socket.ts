
import { io, Socket } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// For dev, we point to the Express server port 3001
const URL = import.meta.env.PROD ? undefined : 'http://localhost:3001';

export const socket: Socket = io(URL, {
    autoConnect: true
});
