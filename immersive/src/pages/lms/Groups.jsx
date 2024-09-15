import PropTypes from 'prop-types';
import { groupShape } from '../../types/types.js';
import defaultGroupProfile from '../../assets/lms/group-profiles/group.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Groups() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [token, setToken] = useState(null);
    const [id, setId] = useState(null);
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState(null);

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
          if( role ==='teacher'){
          const response = await fetch(`http://localhost:4200/teachers/get/${id}`, {
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
          setUsername(teacherData.username);
          
        }else if(role === 'student'){
          const response = await fetch(`http://localhost:4200/students/get/${id}`, {
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
          setUsername(studentData.username);
        }else{
          throw new Error('Failed to fetch user');
        }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    const getGroups = async () => {
        try {
            if (role === 'teacher') {
                const response = await fetch(`http://localhost:4200/groups/get/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const jsonData = await response.json();
                setGroups(jsonData.groups);
            } else if (role === 'student') {
                const response = await fetch(`http://localhost:4200/groups/getByStudent/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const jsonData = await response.json();
                setGroups(jsonData.groups);
            } else {
                throw new Error('Invalid role');
            }
        } catch (error) {
            console.error('Error:', error);
            setGroups([]); // Set groups to an empty array on error
        }
    };

    useEffect(() => {
        if (token && role && id) {
            getUser();
        }
    }, [token, role, id]);

    useEffect(() => {
        if (username) {
            getGroups();
        }
    }, [username]);

    const changeExploreToMakeGroup = () => {
        let exploreBtn = document.querySelector(".explore-button");
        if (exploreBtn) {
            exploreBtn.textContent = "Make a new group";
            exploreBtn.setAttribute("href", "make-group");
        }
    };

    useEffect(() => {
        changeExploreToMakeGroup();
    }, []);

    return (
        <div className="groups">
            <div className="d-flex flex-row justify-content-between">
                <h4 className="mt-2">Groups</h4>
                { role === 'teacher' && (
                <div className='my-auto'>
                    <a href="create-group" className='btn btn-primary  fw-bold  text-light'>Create Group</a>
                </div>
                )}
            </div>
            <hr />
            {groups.map(group => (
                <div key={group.idGroupe} className="group rounded shadow small-scale-on-hover mt-2">
                    <a href={`./group-chat/${group.idGroupe}/${group.name}/${username}/14`} className="group-link">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="d-flex flex-row">
                                <img className="group-profile me-2" src={group.image || defaultGroupProfile} alt="group profile" />
                                <div className="d-flex flex-column ml-2">
                                    <div className="group-name">{group.name}</div>
                                    <div className="group-last-msg">{}</div>
                                </div>
                            </div>
                            <div className="group-last-msg-time mt-4">{}</div>
                        </div>
                    </a>
                </div>
            ))}
        </div>
    );
}

Groups.propTypes = {
    groups: PropTypes.arrayOf(groupShape).isRequired,
};

export default Groups;
