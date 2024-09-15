import React, { useState } from 'react';
import SuccessModal from '../../components/lms/SuccessModal';
const ParentComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleShowModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  return (
    <div>
      <button onClick={handleShowModal} className="custom-button2">Create Course</button>
      <SuccessModal
        show={modalVisible}
        onClose={handleCloseModal}
        roomCode="ABC123"
      />
    </div>
  );
};

export default ParentComponent;
