import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import defaultGroupProfile from '../../assets/lms/group-profiles/group.png';
import defaultUserProfile from '../../assets/lms/group-profiles/user.avif';
import { useNavigate } from 'react-router-dom';

function GroupChat() {
    const { groupId, groupName , username , chatId} = useParams();
    const navigate = useNavigate();
    const [token] = useState(sessionStorage.getItem('token'));
    const [role] = useState(sessionStorage.getItem('role'));
    const [messages, setMessages] = useState([]);
    const [userImage, setUserImage] = useState('');
    const [group, setGroup] = useState({
        chat: [],
    });
    const messageEndRef = useRef(null);
    const inputRef = useRef(null);
    const socketRef = useRef();

    const getTeacher = async () => {
        if (!token) {
          navigate('/sign-in');
          return;
        }
        try {
          if( role ==='teacher'){
          const response = await fetch(`http://localhost:4200/teachers/getByUsername/${username}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch teacher');
          }
          const teacherData = await response.json();
          setUserImage(teacherData.image);
          
        }else if(role === 'student'){
          const response = await fetch(`http://localhost:4200/students/getByUsername/${username}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch student');
          }
          const studentData = await response.json();
          setUserImage(studentData.image);
        }else{
          throw new Error('Failed to fetch user');
        }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    useEffect(() => {
        if (token) {
            getTeacher();
        }
    }, [token]);

    useEffect(() => {
        socketRef.current = io('http://localhost:4200');
        const room = groupName;
        socketRef.current.emit('joinGroupRoom', { username, room , userImage });

        socketRef.current.on('groupMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [groupName, username , userImage]);

    useEffect(() => {
        let footer = document.querySelector("footer");
        if (footer) {
            footer.style.display = "none";
        }
    }, []);

    const getGroup = async () => {
        try {
            const response = await fetch(`http://localhost:4200/groups/getById/${groupId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch group data');
            }

            const jsonData = await response.json();
            const { chat } = jsonData.group || { chat: [] };
            setGroup(jsonData.group || { chat: [] });
            setMessages(chat || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        getGroup();
    }, [groupId]);

    // Scroll to bottom when messages are updated
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    function addMessage(e) {
        e.preventDefault();
        const message = inputRef.current.value;
        if (message.trim() === "") return; // Don't send empty messages
        socketRef.current.emit('groupChatMessage', message);
        inputRef.current.value = ''; // Clear the input field
    }

    return (
        <div className="group-chat mt-2 w-100">
            <div className="group-chat-head rounded">
                <div className="d-flex flex-row justify-content-between">
                    <div className="d-flex flex-row">
                        <img className="group-profile me-2" src={group.image || defaultGroupProfile} alt="group profile" />
                        <div className="d-flex flex-column ml-2">
                            <div className="group-name">{group.name}</div>
                        </div>
                    </div>
                    <div className="group-last-msg-time mt-4">{group.lastMessageTime}</div>
                </div>
            </div>
            <div className="group-chat-msgs">
                {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`msgs-pack ${msg.username === username ? 'current-user' : ''}`}>
                            {(msg.username !== username) && <img className="user-profile" src={msg.userImage || defaultUserProfile} alt="user" />}
                            <div className="msg-content">
                                <div className="user-name">
                                    {msg.username} {msg.username === username  && <img className="user-profile" src={msg.userImage || defaultUserProfile} alt="user" />}
                                </div>
                                <div className={`user-msg shadow ${msg.isCurrentUser ? 'current-user-msg' : ''}`}>
                                    {msg.text} <span className="msg-time">{msg.time}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
                <div ref={messageEndRef} />
            </div>
            <form className="group-chat-new-msg mx-5" onSubmit={addMessage}>
                <input type="text" name="message" className="mt-1 form-control shadow new-msg-input" placeholder="Type your message here..." ref={inputRef} />
                <button className="custom-button2" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                    </svg>
                </button>
            </form>
        </div>
    );
}

export default GroupChat;
