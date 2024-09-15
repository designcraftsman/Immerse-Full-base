import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Nav from './components/lms/Nav';
import Footer from './components/lms/Footer';
import ContextMenu from './components/lms/ContextMenu';
import Y from './assets/lms/Y.png'; // Import your image
import Loader from './components/lms/loader';

function Lms() {
  // User Info
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [role, setRole] = useState(sessionStorage.getItem('role'));
  const [id, setId] = useState(sessionStorage.getItem('id'));
  const [imgurl, setImage] = useState('');
  const [firstname, setFirstName] = useState(sessionStorage.getItem('firstName'));
  const [lastname, setLastName] = useState(sessionStorage.getItem('lastName'));
  const [notificationCount, setNotificationCount] = useState(0);
  const [contextMenu, setContextMenu] = useState({ isVisible: false, position: { x: 0, y: 0 } });
  const [showUserCollapse, setShowUserCollapse] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data , setData] =  useState(null);
  const location = useLocation();
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Youssef : Future data source , which is probabčy the API of the backend , 
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const result = await response.json();
        setData(result); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Hide the loader when data is fetched
      }
    };

    fetchData();
  }, []); 
  
  const getUser = async () => {
    try {
      let response;
      if (role === 'student') {
        response = await fetch(`http://localhost:4200/students/get/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } else if (role === 'teacher') {
        response = await fetch(`http://localhost:4200/teachers/get/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } else {
        throw new Error('Invalid role');
      }
  
      if (response.ok) {
        const userData = await response.json();
        
        // Update state values with the fetched data
        setImage(userData.image || ''); // Update image URL
        setFirstName(userData.firstName || ''); // Update first name
        setLastName(userData.lastName || ''); // Update last name
        setNotificationCount(userData.notification_count || 0); // Update notification count
  
        // Optionally update sessionStorage if you want to persist the changes
        sessionStorage.setItem('image', userData.image || '');
        sessionStorage.setItem('firstName', userData.firstName || '');
        sessionStorage.setItem('lastName', userData.lastName || '');
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedRole = sessionStorage.getItem('role');
    const storedId = sessionStorage.getItem('id');
    
    setToken(storedToken);
    setRole(storedRole);
    setId(storedId);
    
    if (storedToken && storedRole && storedId) {
      getUser();
    }
  }, [token, role, id , getUser]); // Add `role` and `id` to the dependencies array
  
  

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent the default context menu
    setContextMenu({
      isVisible: true,
      position: { x: event.pageX, y: event.pageY },
    });
  };

  const handleCloseMenu = () => {
    setContextMenu({ isVisible: false, position: { x: 0, y: 0 } });
  };

  const handleExploreClick = (e) => {
    e.preventDefault(); // Prevent the default action of the link
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleToggle = () => {
    setShowUserCollapse(!showUserCollapse);
  };

  const handleSignout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const currentLink = location.pathname.split('/')[1] || 'dashboard'; // Default to 'dashboard' if path is '/'
  const noNavFooter = location.pathname === '/my-space/sign-in' || location.pathname === '/my-space/sign-up' || location.pathname === '/my-space/make-course';

  useEffect(() => {
    if (noNavFooter) {
      document.body.classList.add('sign-up-body');
    } else {
      document.body.classList.remove('sign-up-body');
    }
  }, [noNavFooter]);

  // Return only Outlet if noNavFooter is true
  if (noNavFooter) {
    return <Outlet />;
  }

  if(loading)
    return <Loader />;
  return (
    <div className="container-fluid  " data-bs-theme="light" onContextMenu={handleContextMenu}>
      <ContextMenu isVisible={contextMenu.isVisible} position={contextMenu.position} onClose={handleCloseMenu} />
      <div >
        <Nav currentLink={currentLink} />
        <div className="content with-nav-footer ">
          <div className="d-flex flex-row mb-3 justify-content-between">
            <div className="search-box d-flex flex-row mt-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                fill="currentColor"
                className="bi bi-search me-2"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
              <form action="./search" method="post">
                <input type="text" placeholder="Search" ref={inputRef} id="search" />
              </form>
            </div>
            <div className="p-2">
              <a
                className="text-secondary notifications-icon position-relative me-1 me-md-3"
                onClick={() => navigate('/my-space/notifications')}
                role="button"
                style={{ cursor: 'pointer' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-bell-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                </svg>
                <span className="notifications-number position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notificationCount}
                  <span className="visually-hidden">unread messages</span>
                </span>
              </a>
              <a
                type="button"
                id="toggleUserCollapse"
                className="user btn btn-link p-0"
                onClick={handleToggle}
                role="button"
                style={{ cursor: 'pointer' }}
              >
            {(!imgurl || imgurl === '' || imgurl === 'null') ? (
                <img src={Y} alt="profile" className="profile-img me-3" />
              ) : (
                <img src={imgurl} alt="profile" className="profile-img me-3" />
              )}
            
              </a>

              <div
                className={`z-3 collapse ${showUserCollapse ? 'show' : ''}`}
                id="userCollapse"
                style={{ position: 'absolute', top: '10%', right: '4%' }}
              >
                <div className="card card-body p-2 shadow-lg user-menu">
                  <h2 className="fw-normal p-3 fs-5">
                    Hello<span> {firstname + ' ' + lastname}!</span>
                  </h2>
                  <hr className="m-1" />
                  <nav className="p-0">
                    <ul className="list-unstyled m-0 p-0 fs-6">
                      <li className="border-dark m-0 p-0 rounded-top">
                        <a
                          className="text-decoration-none d-block m-1 p-3 bg-dark3-on-hover"
                          onClick={() => navigate('/my-space/dashboard')}
                          role="button"
                          style={{ cursor: 'pointer' }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-house me-3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2 13.5V7h12v6.5a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5zm11-7V5.122l-5-4.2-5 4.2V6.5h10zM8 1.625 13.2 5.5H2.8L8 1.625z" />
                          </svg>
                          Dashboard
                        </a>
                      </li>
                      <li className="border-dark m-0 p-0 rounded-top">
                        <a
                          className="text-decoration-none d-block m-1 p-3 bg-dark3-on-hover"
                          onClick={() => navigate('/settings')}
                          role="button"
                          style={{ cursor: 'pointer' }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-gear me-3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M9.667.18a1 1 0 0 1 .986.835l.28 1.1a5.507 5.507 0 0 1 1.734 1.002l1.09-.439a1 1 0 0 1 1.065.268l.89.89a1 1 0 0 1 .268 1.065l-.439 1.09a5.505 5.505 0 0 1 0 2.768l.439 1.09a1 1 0 0 1-.268 1.065l-.89.89a1 1 0 0 1-1.065.268l-1.09-.439a5.507 5.507 0 0 1-1.002 1.734l-.28 1.1a1 1 0 0 1-.986.835H6.333a1 1 0 0 1-.986-.835l-.28-1.1a5.507 5.507 0 0 1-1.734-1.002l-1.09.439a1 1 0 0 1-1.065-.268l-.89-.89a1 1 0 0 1-.268-1.065l.439-1.09a5.505 5.505 0 0 1 0-2.768l-.439-1.09a1 1 0 0 1 .268-1.065l.89-.89a1 1 0 0 1 1.065-.268l1.09.439a5.507 5.507 0 0 1 1.002-1.734l.28-1.1a1 1 0 0 1 .986-.835h2.334zm-2.6 9.88a2.5 2.5 0 1 0 2.866-4.13 2.5 2.5 0 0 0-2.866 4.13z" />
                          </svg>
                          Settings
                        </a>
                      </li>
                      <li className="border-dark m-0 p-0 rounded-top">
                        <a
                          className="text-decoration-none d-block m-1 p-3 bg-dark3-on-hover"
                          onClick={handleSignout}
                          role="button"
                          style={{ cursor: 'pointer' }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-box-arrow-right me-3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M10 13a.5.5 0 0 1-.5.5h-4a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 5.5 2h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 .5.5zm5.854-6.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L14.293 6H5.5a.5.5 0 0 0 0 1h8.793l-2.647 2.646a.5.5 0 0 0 .708.708l3-3z" />
                          </svg>
                          Sign Out
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Lms;
