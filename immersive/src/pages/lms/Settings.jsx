import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { settingShape } from '../../types/types.js';

function Settings(props) {
  const [recoveryEmailOption, setRecoveryEmailOption] = useState('');
  const [showRecoveryEmailInput, setShowRecoveryEmailInput] = useState(false);
  const [collapseStates, setCollapseStates] = useState({
    recoveryEmailCollapse: false,
    themeCollapse: false,
    languageCollapse: false,
    notificationsCollapse: false,
    twoFactorAuthCollapse: false,
  });

  useEffect(() => {
    if (recoveryEmailOption === '1') {
      setShowRecoveryEmailInput(true);
    } else {
      setShowRecoveryEmailInput(false);
    }
  }, [recoveryEmailOption]);

  const removeExploreButton = () => {
    let exploreBtn = document.querySelector('.explore-button');
    if (exploreBtn) {
      exploreBtn.style.display = 'none';
    }
  };

  useEffect(() => {
    removeExploreButton();
  }, []);

  const handleSelectChange = (event) => {
    setRecoveryEmailOption(event.target.value);
  };

  const handleCollapseToggle = (collapseKey) => {
    setCollapseStates((prevState) => ({
      ...prevState,
      [collapseKey]: !prevState[collapseKey],
    }));
  };

  const settingsUpdatesAlert = () => {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    if (alertPlaceholder) {
      const alert = document.createElement('div');
      alert.className = 'alert alert-success alert-dismissible fade show';
      alert.role = 'alert';
      alert.innerHTML = `
        <strong>Success!</strong> Settings updates saved!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      alertPlaceholder.appendChild(alert);
    }
  };

  return (
    <div className="settings mt-0 mt-md-3">
      <div className="alert alert-success  fade show" role="alert" id="myAlert">
        <strong>Success!</strong> Settings updates saved! &nbsp; &nbsp;
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>

      <form className="row">
        {/* Recovery Email */}
        <div className="col-12 col-md-6 setting p-2">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Recovery Email</h5>
            <button
              className="btn btn-light"
              type="button"
              onClick={() => handleCollapseToggle('recoveryEmailCollapse')}
              aria-expanded={collapseStates.recoveryEmailCollapse}
              aria-controls="recoveryEmailCollapse"
            >
              <i className={`bi ${collapseStates.recoveryEmailCollapse ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </button>
          </div>
          {collapseStates.recoveryEmailCollapse && (
            <div id="recoveryEmailCollapse" className="collapse show">
              <fieldset>
                <label htmlFor="recoveryEmailSelect" className="form-label">
                  Select Recovery Email Option
                </label>
                <select
                  id="recoveryEmailSelect"
                  className="form-select"
                  onChange={handleSelectChange}
                  value={recoveryEmailOption}
                >
                  <option value="">Choose...</option>
                  <option value="1" selected={props.settings.recoveryEmailSett}>
                    Enable
                  </option>
                  <option value="2" selected={!props.settings.recoveryEmailSett}>
                    Disable
                  </option>
                </select>
              </fieldset>
              {showRecoveryEmailInput && (
                <div id="recoveryEmailInputContainer fade" className="mt-3">
                  <label htmlFor="recoveryEmailInput" className="form-label">
                    Recovery Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="recoveryEmailInput"
                    placeholder="Enter your recovery email"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Selection */}
        <div className="col-12 col-md-6 setting p-2">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Theme</h5>
            <button
              className="btn btn-light"
              type="button"
              onClick={() => handleCollapseToggle('themeCollapse')}
              aria-expanded={collapseStates.themeCollapse}
              aria-controls="themeCollapse"
            >
              <i className={`bi ${collapseStates.themeCollapse ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </button>
          </div>
          {collapseStates.themeCollapse && (
            <div id="themeCollapse" className="collapse show">
              <fieldset>
                <legend className="form-label">Select Theme</legend>
                <div className="form-check">
                  <input
                    type="radio"
                    name="themeOptions"
                    id="lightTheme"
                    value="light"
                    defaultChecked={props.settings.theme === 'light'}
                  />
                  <label className="form-check-label" htmlFor="lightTheme">
                    Light
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    name="themeOptions"
                    id="darkTheme"
                    value="dark"
                    defaultChecked={props.settings.theme === 'dark'}
                  />
                  <label className="form-check-label" htmlFor="darkTheme">
                    Dark
                  </label>
                </div>
              </fieldset>
            </div>
          )}
        </div>

        {/* Language Selection */}
        <div className="col-12 col-md-6 setting p-2">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Language</h5>
            <button
              className="btn btn-light"
              type="button"
              onClick={() => handleCollapseToggle('languageCollapse')}
              aria-expanded={collapseStates.languageCollapse}
              aria-controls="languageCollapse"
            >
              <i className={`bi ${collapseStates.languageCollapse ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </button>
          </div>
          {collapseStates.languageCollapse && (
            <div id="languageCollapse" className="collapse show">
              <fieldset>
                <label htmlFor="languageSelect" className="form-label">
                  Select Language
                </label>
                <select id="languageSelect" className="form-select" value={props.settings.language}>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                </select>
              </fieldset>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="col-12 col-md-6 setting p-2">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Notifications</h5>
            <button
              className="btn btn-light"
              type="button"
              onClick={() => handleCollapseToggle('notificationsCollapse')}
              aria-expanded={collapseStates.notificationsCollapse}
              aria-controls="notificationsCollapse"
            >
              <i className={`bi ${collapseStates.notificationsCollapse ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </button>
          </div>
          {collapseStates.notificationsCollapse && (
            <div id="notificationsCollapse" className="collapse show">
              <fieldset>
                <legend className="form-label">Select Notifications</legend>
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    defaultChecked={props.settings.emailNotification}
                  />
                  <label className="form-check-label" htmlFor="emailNotifications">
                    Email Notifications
                  </label>
                </div>
                <div className="form-check">
                  <input type="checkbox" id="smsNotifications" />
                  <label className="form-check-label" htmlFor="smsNotifications">
                    SMS Notifications
                  </label>
                </div>
              </fieldset>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="col-12 col-md-6 setting p-2">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Two-Factor Authentication</h5>
            <button
              className="btn btn-light"
              type="button"
              onClick={() => handleCollapseToggle('twoFactorAuthCollapse')}
              aria-expanded={collapseStates.twoFactorAuthCollapse}
              aria-controls="twoFactorAuthCollapse"
            >
              <i className={`bi ${collapseStates.twoFactorAuthCollapse ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </button>
          </div>
          {collapseStates.twoFactorAuthCollapse && (
            <div id="twoFactorAuthCollapse" className="collapse show">
              <fieldset>
                <label className="form-label">Enable Two-Factor Authentication</label>
                <div className="form-check form-switch">
                  <input type="checkbox" id="twoFactorAuth" defaultChecked={props.settings.twoFactorAuth} />
                  <label className="form-check-label" htmlFor="twoFactorAuth">
                    Enable
                  </label>
                </div>
              </fieldset>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-12 mb-5 mt-3">
          <div id="liveAlertPlaceholder"></div>
          <button type="button" onClick={settingsUpdatesAlert} className="btn custom-button2 small-scale-on-hover w-75 m-auto d-flex justify-content-center" id="liveAlertBtn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

Settings.propTypes = {
  settings: settingShape.isRequired, // Correct PropTypes usage
};

export default Settings;
