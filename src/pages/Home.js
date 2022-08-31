import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import  {useNavigate} from'react-router-dom'

const Home = () => {

    //Redirection
    const navigate = useNavigate()

	//State
	const [roomId, setRoomId] = useState('');
	const [username, setUsername] = useState('');

	const createNewRoom = (e) => {
		e.preventDefault();
		const id = uuidV4();
		setRoomId(id);
        toast.success('New room Created')
	};

    const joinRoom = () => {
        if(!roomId || !username) {
            toast.error('Room ID and username is required');
            return
        }
        navigate(`/editor/${roomId}`,{state : {username}})

    }


    const handleInputEnter = (e) => {
        e.preventDefault()
        if(e.code === 'Enter'){
            joinRoom()
        }
    }

	return (
		<div className='homePageWrapper'>
			<div className='formWrapper'>
				<img
					className='homePageLogo'
					src='/code-sync.png'
					alt='code-sync-logo'
				/>
				<h4 className='mainLabel'>Paste invitation ROOM ID</h4>
				<div className='inputGroup'>
					<input
						value={roomId}
						onChange={(e) => setRoomId(e.target.value)}
						type='text'
						className='inputBox'
						placeholder='ROOM ID'
						onKeyUp={handleInputEnter}
					/>
					<input
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						type='text'
						className='inputBox'
						placeholder='USERNAME'
						onKeyUp={handleInputEnter}
					/>
					<button className='btn joinBtn' onClick={joinRoom}>
						Join
					</button>
					<span className='createInfo'>
						If you don't have an invitation then create &nbsp;
						<a onClick={createNewRoom} href='/' className='createNewBtn'>
							new room
						</a>
					</span>
				</div>
			</div>
			<footer>
				<h4>
					Built by <a href='https://github.com/tonysson'> Teyi Lawson</a>
				</h4>
			</footer>
		</div>
	);
};

export default Home;
