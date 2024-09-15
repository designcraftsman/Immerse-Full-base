import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CgDanger } from 'react-icons/cg';

function Sessions() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [token, setToken] = useState(null);
    const [id, setId] = useState(null);
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState(null);
    const [inputCode, setInputCode] = useState('');
    const [wrongCode, setWrongCode] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        const storedRole = sessionStorage.getItem('role');
        setRole(storedRole);
    }, []);

    useEffect(() => {
        const storedId = sessionStorage.getItem('id');
        setId(storedId);
    }, []);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (!storedToken) {
            navigate('/sign-in');
        } else {
            setToken(storedToken);
        }
    }, [navigate]);

    const getUser = async () => {
        if (!token) {
            navigate('/sign-in');
            return;
        }
        try {
            let response;
            if (role === 'teacher') {
                response = await fetch(`http://localhost:4200/teachers/get/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
            } else if (role === 'student') {
                response = await fetch(`http://localhost:4200/students/get/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
            }

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const userData = await response.json();
            setUsername(userData.username);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getSessions = async () => {
        try {
            let response;
            if (role === 'teacher') {
                response = await fetch(`http://localhost:4200/sessions/getByTeacher/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
            } else if (role === 'student') {
                response = await fetch(`http://localhost:4200/sessions/getByStudent/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
            }

            const jsonData = await response.json();
            setSessions(jsonData.sessions);
            console.log(jsonData.sessions);
        } catch (error) {
            console.error('Error:', error);
            setSessions([]);
        }
    };

    const StudentCode = () => {
        if (inputCode === selectedSession.code) {
            const path =
                selectedSession.environment === 'lab'
                    ? `/immersive-space/labSession/${selectedSession.name}/${selectedSession.idCourse}/${username}`
                    : `/immersive-space/schoolSession/${selectedSession.name}/${selectedSession.idCourse}/${username}`;
            navigate(path);
        } else {
            setWrongCode(true);
        }
    };

    useEffect(() => {
        if (token && role && id) {
            getUser();
        }
    }, [token, role, id]);

    useEffect(() => {
        if (username) {
            getSessions();
        }
    }, [username]);

    return (
        <div className="groups">
            <div className="d-flex flex-row justify-content-between">
                <h4 className="mt-2">Sessions</h4>
                <div className='my-auto'>
                    {role === 'teacher' && (
                        <a href="create-session" className='btn btn-primary fw-bold text-light'>
                            Create Session
                        </a>
                    )}
                </div>
            </div>
            <hr />
            <table className="table shadow">
                <thead>
                    <tr>
                        <th scope="col">Id Session</th>
                        <th scope="col">Title</th>
                        <th scope="col">Course</th>
                        { role === 'teacher' && (
                        <th scope="col">Code</th>
                        )}
                        {role === 'student' &&(
                        <th scope="col">Intructor</th>
                        )}
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.length <= 0 && (
                        <tr>
                            <td colSpan="5">No sessions found</td>
                        </tr>
                    )}
                    {sessions.map((session, index) => (
                        <tr scope="row" className="small-scale-on-hover" key={index}>
                            <td>{session.idSession}</td>
                            <td>{session.name}</td>
                            <td>{session.cname}</td>
                            {role === 'teacher'&&(
                            <td>{session.code}</td>
                            )}
                            {role === 'student'&&(
                            <td>{session.firstName} {session.lastName}</td>
                            )}
                            {session.environment === 'lab' && role === 'teacher' && (
                            <td>
                                
                                <a href={`/immersive-space/labSession/${session.name}/${session.idCourse}/${username}`} 
                                className='btn btn-transparent text-primary border border-1 border-primary fw-bold'>
                                Launch session
                                </a>
                            </td>
                            )}
                            {session.environment === 'school' && role === 'teacher' && (
                            <td>
                                <a href={`/immersive-space/schoolSession/${session.name}/${session.idCourse}/${username}`} 
                                className='btn btn-transparent text-primary border border-1 border-primary fw-bold'>
                                Launch session
                                </a>
                            </td>
                            )}
                            {session.environment === 'lab' && role === 'student' && (
                            <td>
                                <button data-toggle="modal"
                                    data-target="#exampleModal"
                                    onClick={() => setSelectedSession(session)} 
                                className='btn btn-transparent text-primary border border-1 border-primary fw-bold'>
                                Join session
                                </button>
                            </td>
                            )}
                            {session.environment === 'school' && role === 'student' && (
                            <td>
                                <button data-toggle="modal"
                                    data-target="#exampleModal"
                                    onClick={() => setSelectedSession(session)}
                                className='btn btn-transparent text-primary border border-1 border-primary fw-bold'>
                                Join session
                                </button>
                            </td>
                            )}

    
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal moved outside of the loop */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between">
                            <h5 className="modal-title fw-bold" id="exampleModalLabel">Enter the session code</h5>
                            <button type="button" className="close p-0 text-dark bg-white" data-dismiss="modal">
                                <span aria-hidden="true" className='bg-white fs-4'>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body border-none">
                            <label htmlFor="code" className='mb-2'>Code :</label>
                            <input
                                type="text"
                                name="code"
                                id="code"
                                onChange={(e) => setInputCode(e.target.value)}
                                className='form-control mb-3'
                            />
                            {wrongCode && (
                                <p className='text-danger m-0'>
                                    <CgDanger /> Wrong code!
                                </p>
                            )}
                        </div>
                        <div className="modal-footer border-none">
                            <button data-dismiss="modal" type="button" onClick={StudentCode} className="btn btn-primary text-white fw-bold w-100">
                                Enter session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sessions;
