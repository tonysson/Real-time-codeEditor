import React, { useState, useRef, useEffect } from 'react';
import {
	useLocation,
	useNavigate,
	Navigate,
	useParams,
} from 'react-router-dom';
import ACTIONS from '../Action';
import Client from './../components/Client';
import Editor from './../components/Editor';
import { initSocket } from './../socket';
import { toast } from 'react-hot-toast';

const EditorPage = () => {
	const socketRef = useRef(null);
	const codeRef = useRef(null);
	const reactNavigator = useNavigate();
	const location = useLocation();
	const { roomId } = useParams();

	//State
	const [clients, setClients] = useState([]);

	const handleErrors = (error) => {
		console.log(`Socket error`, error);
		toast.error('Socket connection failed , try later again');
		reactNavigator('/');
	};

	useEffect(() => {
		const init = async () => {
			// init the connection with socket client
			socketRef.current = await initSocket();
			socketRef.current.on(
				('connection_error', (error) => handleErrors(error)),
			);
			socketRef.current.on(
				('connection_failed', (error) => handleErrors(error)),
			);
			socketRef.current.emit(ACTIONS.JOIN, {
				roomId,
				username: location.state?.username,
			});

			//Listening for joined event
			socketRef.current.on(
				ACTIONS.JOINED,
				({ clients, username, socketId }) => {
					if (username !== location.state?.username) {
						toast.success(`${username} joined the room`);
					}

					setClients(clients);
					socketRef.current.emit(ACTIONS.SYNC_CODE, {
						code : codeRef.current,
						socketId
					});
				},
			);

			//Listening for disconected
			socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
				toast.success(`${username} left the room`);
				setClients((prev) => {
					return prev.filter((client) => client.socketId !== socketId);
				});
			});
		};

		init();

		// Clean up
		return () => {
			socketRef.current?.disconnect();
			socketRef.current?.off(ACTIONS.JOINED);
			socketRef.current?.off(ACTIONS.DISCONNECTED);
		};
	}, []);

	if (!location.state) {
		return <Navigate to='/' />;
	}

	async function copyRoomId() {
		try {
			await navigator.clipboard.writeText(roomId);
			toast.success(`Room ID has been copied to your clipboard`);
		} catch (error) {
			toast.error('Could not copy room id , Try again');
			console.error(error);
		}
	}

	function leaveRoom() {
		reactNavigator('/');
	}

	return (
		<div className='mainWrap'>
			<div className='aside'>
				<div className='asideInner'>
					<div className='logo'>
						<img src='/code-sync.png' alt='logo' className='logoImage' />
					</div>
					<h3>Connected</h3>
					<div className='clientsList'>
						{clients.map((client) => (
							<Client key={client.socketId} username={client.username} />
						))}
					</div>
				</div>
				<button className='btn copyBtn' onClick={copyRoomId}>
					Copy Room ID
				</button>
				<button className='btn leaveBtn' onClick={leaveRoom}>
					Leave
				</button>
			</div>
			<div className='editorWrap'>
				<Editor
					socketRef={socketRef}
					roomId={roomId}
					onCodeChange={(code) => {
						codeRef.current = code;
					}}
				/>
			</div>
		</div>
	);
};

export default EditorPage;
