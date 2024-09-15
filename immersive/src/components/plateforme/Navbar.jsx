import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Import Bootstrap JS for dropdown functionality
import logo from '../../assets/plateforme/logo.png';
import Y from '../../assets/lms/Y.png'; // Import your image
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [role, setRole] = useState(sessionStorage.getItem('role'));
  const [id, setId] = useState(sessionStorage.getItem('id'));
  const [imgurl, setImage] = useState('');
  const [firstname, setFirstName] = useState(sessionStorage.getItem('firstName'));
  const [lastname, setLastName] = useState(sessionStorage.getItem('lastName'));
  const [showUserCollapse, setShowUserCollapse] = useState(false);

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

  const handleToggle = () => {
    setShowUserCollapse(!showUserCollapse);
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


  const handleSignout = () => {
    sessionStorage.clear();
    window.location.reload(); // Change from `location.reload()` to `window.location.reload()`
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/courses/search/${query}`);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid mx-3 position-relative">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img src={logo} alt="Immerse Logo" style={{ height: '40px' }} />
          <span className="immerse m-2">Immerse</span>
        </a>

        {/* Large Dropdown Menu */}
        <div className="dropdown mx-5 d-lg-inline d-none">
          <Link
          to="courses/all"
            className="text-decoration-none text-white dropdown-toggle" 
            type="button" 
            id="browseDropdown" 
            aria-expanded="false"
          >
            Browse
          </Link>
          <div className="dropdown-menu" aria-labelledby="browseDropdown" style={{ minWidth: '600px' }}>
            <div className="row g-0">
              {/* Column 1 */}
              <div className="col-4 p-3">
                <h6 className="dropdown-header">Technology</h6>
                <Link className="dropdown-item" to="/courses/web-development">Web Development</Link>
                <Link className="dropdown-item" to="/courses/data-science">Data Science</Link>
                <Link className="dropdown-item" to="/courses/artificial-intelligence">Artificial Intelligence</Link>
                <Link className="dropdown-item" to="/courses/cybersecurity">CyberSecurity</Link>
              </div>
              {/* Column 2 */}
              <div className="col-4 p-3">
                <h6 className="dropdown-header">Business</h6>
                <Link className="dropdown-item" to="/courses/marketing">Marketing</Link>
                <Link className="dropdown-item" to="/courses/finance">Finance</Link>
                <Link className="dropdown-item" to="/courses/project-management">Project Management</Link>
              </div>
              {/* Column 3 */}
              <div className="col-4 p-3">
                <h6 className="dropdown-header">Science</h6>
                <Link className="dropdown-item" to="/courses/biology">Biology</Link>
                <Link className="dropdown-item" to="/courses/chemistry">Chemistry</Link>
                <Link className="dropdown-item" to="/courses/geology">Geology</Link>
                <Link className="dropdown-item" to="/courses/physics">Physics</Link>
              </div>
            </div>
          </div>
        </div>

        <form className="d-flex position-relative mx-5 order-lg-1 d-lg-inline d-none" role="search" style={{ width: '400px' }} onSubmit={handleSearch}>
          <input 
            className="form-control pe-5 bg-transparent text-white border-white placeholder-white" 
            type="search" 
            placeholder="What do you wanna learn?" 
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="fa-solid fa-magnifying-glass position-absolute fa-lg text-white bg-transparent border-0"
            style={{ right: '-20px', top: '15%', cursor: 'pointer' }}
          ></button>
        </form>

        <div className="collapse navbar-collapse order-lg-2" id="navbarNav">
          <ul className="navbar nav ms-auto align-items-center">
            { !token && !id && !role &&(
              <React.Fragment>
            <li className="nav-item fs-6 px-3">
              <Link className="nav-link sign-in " to="/my-space/sign-in">Sign In</Link>
            </li>
            <li className="nav-item bg-primary rounded">
              <Link className="nav-link sign-up fs-6 " to="/my-space/sign-up">Sign Up</Link>
              
            </li>
            </React.Fragment>
            )}
            {token && id && role && (
            <li className="nav-item">
              <a
                  type="button"
                  id="toggleUserCollapse"
                  className="user btn btn-link p-0 "
                  onClick={handleToggle}
                  role="button"
                  style={{ cursor: 'pointer' }}
                >
              {(!imgurl || imgurl === '' || imgurl === 'null') ? (
                  <img src={Y} alt="profile" className=" mx-3 profile-img  " />
                ) : (
                  <img src={imgurl} alt="profile" className=" mx-3 profile-img " />
                )}
              
                </a>
                
            </li>
            )}
          </ul>
        </div>
        <div
                className={`z-3 collapse ${showUserCollapse ? 'show' : ''}`}
                id="userCollapse"
                style={{ position: 'absolute', top: '90%', right: '4%' }}
              >
                <div className="card card-body p-2 shadow-lg user-menu">
                  <h2 className="fw-normal p-3 fs-5">
                    Hello<span> {firstname + ' ' + lastname}!</span>
                  </h2>
                  <hr className="m-1" />
                  <nav className="p-0">
                    <ul className="list-unstyled m-0 p-0 fs-6 ">
                      <li className="border-dark m-0 p-0 rounded-top ">
                        <a
                          className="text-decoration-none d-block m-1 p-3 bg-dark3-on-hover text-dark"
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
                          className="text-decoration-none d-block m-1 p-3 bg-dark3-on-hover text-dark"
                          onClick={() => navigate('/my-space/settings')}
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
                          className="text-decoration-none d-block m-1 p-3 bg-dark3-on-hover text-dark"
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
    </nav>
  );
}

export default Navbar;
