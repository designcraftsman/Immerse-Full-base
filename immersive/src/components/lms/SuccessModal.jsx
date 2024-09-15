import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaClipboard } from 'react-icons/fa';
import checkedAnimation from '../../assets/lms/animations/checkedAnimation.gif';

const SuccessModal = ({ show, onClose, roomCode }) => {
  const [copied, setCopied] = useState(false);
  const [gifSrc, setGifSrc] = useState('');

  useEffect(() => {
    if (show) {
      setGifSrc(checkedAnimation); // Set the GIF source when the modal is shown
    }
  }, [show]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 500); // Reset copied status after 2 seconds
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block "  tabIndex="-1" role="dialog" >
      <div className="modal-dialog modal-dialog-centered " style={{maxWidth:"300px"}} role="document">
        <div className="modal-content shadow">
          <div className="modal-body text-center">
            <img src={gifSrc} alt="Checked Animation" />
            <h4 className="mt-3">Course Created Successfully</h4>
            <div className="mt-3">
              <span className="fw-bold">Room Code: </span>
              <span className="room-code">{roomCode}</span>
              <button type="button" onClick={copyToClipboard} className="btn btn-link p-0 ms-2 text-black">
                <FaClipboard size={20} />
              </button>
              {copied && <span className="text-success ms-2">Copied!</span>}
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

SuccessModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  roomCode: PropTypes.string.isRequired,
};

export default SuccessModal;
