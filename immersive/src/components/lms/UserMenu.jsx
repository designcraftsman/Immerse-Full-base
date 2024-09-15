// UserMenu.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { studentShape , teacherShape} from '../../types/types';

const UserMenu = (props) => {
  const [showUserCollapse, setShowUserCollapse] = useState(false);

  const handleToggle = () => {
    setShowUserCollapse(!showUserCollapse);
  };

  return (
      <div
        className={`z-3 collapse ${showUserCollapse ? 'show' : ''}`}
        id="userCollapse"
        style={{ position: 'absolute', top: '10%', right: '10%' }}
      >
        <div className="card card-body p-2 shadow-lg">
          <h2 className="fw-normal p-3 fs-5">
            Hi<span> {props.firstname} !</span>
            <p>{props.email}</p>
          </h2>
          <hr className="m-1" />
          <nav className="p-0">
            <ul className="list-unstyled m-0 p-0 fs-6">
              <li className="border-dark m-0 p-0 rounded-top">
                <a
                  className="text-decoration-none d-block m-1 p-3 bg-dark3-on-hover"
                  href="profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="shadow bi bi-person-fill-lock"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5v-1a2 2 0 0 1 .01-.2 4.49 4.49 0 0 1 1.534-3.693Q8.844 9.002 8 9c-5 0-6 3-6 4m7 0a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
                  </svg>
                  Profile
                </a>
              </li>
              <li className="border-dark m-0 p-0 rounded-top">
                <a
                  className="text-decoration-none d-block m-1 p-3 bg-dark3-on-hover"
                  href="settings"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-gear-wide"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z" />
                  </svg>
                  Settings
                </a>
              </li>
              <hr className="m-1" />
              <li className="m-0 p-0 rounded-bottom">
                <a
                  className="text-decoration-none d-block m-1 p-3 bg-dark3-on-hover"
                  href=""
                >
                  <i className="bi bi-box-arrow-left me-2"></i> Se déconnecter
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
  );
};

UserMenu.propTypes = {
  userProfileImg: PropTypes.string.isRequired,
};

export default UserMenu;
