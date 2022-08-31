import {io} from 'socket.io-client'

// connection socket-client to backend
export const initSocket = async () => {
    
    const options = {
        'force new connection' : true,
        reconnectionAttempt : true,
        timeout : 10000,
        transports : ['websocket']
    }

    return io(process.env.REACT_APP_BACKEND_URL , options)
}