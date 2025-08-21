import {io} from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://perfectochat.perfectobd.com/';

export const socket = io(URL);