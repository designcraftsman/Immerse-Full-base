import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logo from '../../assets/lms/logo.png';
import { useNavigate , Link } from 'react-router-dom';
import { SiGoogleclassroom } from "react-icons/si";
import { HiMiniUserGroup } from "react-icons/hi2";

function Nav(props) {
    return (
        <>
            {/* Offcanvas Sidebar */}
            <div className="offcanvas offcanvas-start d-md-none lms" tabIndex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasSidebarLabel">Menu</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body" id='sidebar2'>
                    {RenderSidebarLinks(props)}
                </div>
            </div>

            {/* Sidebar for larger devices */}
            <nav id="lms-sidebar" className="d-none d-md-block ">
                {RenderSidebarLinks(props)}
            </nav>
        </>
    );
}

function RenderSidebarLinks(props) {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = sessionStorage.getItem('role');
        setRole(storedRole);
    }, []);

    // Signout function
    const handleSignout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('role');
        navigate('/');
    };

    return (
        <ul className="list-unstyled my-3 components ">
            <li className="logo-link mb-3 ">
                <Link to="/" role="button" className="nav-link">
                    <img src={logo} width="25" height="25" alt="logo" />
                    <span className="logo-text ms-4 ps-3 fs-5">Immerse</span>
                </Link>
            </li>
            <li>
                <a onClick={() => navigate('/my-space/dashboard')} role="button" className={`nav-link ${props.currentLink === "dashboard" ? "current-link" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-bar-chart-fill" viewBox="0 0 16 16">
                        <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" />
                    </svg>
                    <span>My Dashboard</span>
                </a>
            </li>
            <li>
                <a onClick={() => navigate('/my-space/courses')} role="button" className={`nav-link ${props.currentLink === "courses" ? "current-link" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="shadow bi bi-mortarboard-fill" viewBox="0 0 16 16">
                        <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917z" />
                        <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466z" />
                    </svg>
                    <span>Courses</span>
                </a>
            </li>
            <li>
                <a onClick={() => navigate('/my-space/groups')} role="button" className={`nav-link ${props.currentLink === "groups" ? "current-link" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                    </svg>
                    <span>Groups</span>
                </a>
            </li>
            
                    <li>
                        <a onClick={() => navigate('/my-space/sessions')} role="button" className={`nav-link m-0 ${props.currentLink === "sessions" ? "current-link" : ""}`}>
                             <span className='fs-3 m-0 p-0'><HiMiniUserGroup /></span>
                            <span>Sessions</span>
                        </a>
                    </li>
                    {role === "teacher" && (
                        <>  
                    <li>
                        <a onClick={() => navigate('/my-space/students')} role="button" className={`nav-link ${props.currentLink === "students" ? "current-link" : ""}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                            </svg>
                            <span>Students</span>
                        </a>
                    </li>
                    
                    <li>
                        <a onClick={() => navigate('/my-space/assets')} role="button" className={`nav-link ${props.currentLink === "assets" ? "current-link" : ""}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-archive-fill" viewBox="0 0 16 16">
                                <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z"/>
                                <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5v-2A1.5 1.5 0 0 0 14.5 1h-13A1.5 1.5 0 0 0 0 2.5v2z"/>
                            </svg>
                            <span>Assets</span>
                        </a>
                    </li>
                </>
            )}
            <hr />
            <li>
                <a onClick={() => navigate('/my-space/profile')} role="button" className={`nav-link ${props.currentLink === "profile" ? "current-link" : ""}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
</svg>
                    <span>Profile</span>
                </a>
            </li>
            <li>
                <a onClick={() => navigate('/my-space/settings')} role="button" className={`nav-link ${props.currentLink === "settings" ? "current-link" : ""}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                </svg>
                    <span>Settings</span>
                </a>
            </li>
            <li>
                <a onClick={handleSignout} role="button" className="nav-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                </svg>
                <span>Sign out</span>
                </a>
            </li>
        </ul>
    );
}

Nav.propTypes = {
    currentLink: PropTypes.string.isRequired,
};

export default Nav;
