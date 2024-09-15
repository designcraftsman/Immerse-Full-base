import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const OffCanvasCourse = ({ show, onClose, course, id }) => {
  const navigate = useNavigate();
  if (!course) return null;
 
  const token = sessionStorage.getItem('token');
  const idUser = sessionStorage.getItem('id');

  console.log(course.environment);
  const addToEnrolledCourses = async (idCourse) => {
    const formData = {
      idCourse: idCourse,
      idStudent: idUser
    };
    try {
      const response = await fetch(`http://localhost:4200/courses/enrolledCourses/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add to enrolled courses');
      }

      const jsonData = await response.json();

      if( course.environment === 'lab'){
        navigate(`/immersive-space/labCourse/${idCourse}`);
      }else if (course.environment === 'school'){
        navigate(`/immersive-space/schoolCourse/${idCourse}`);
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteEnrolledCourses = async (idCourse) => {
    const formData = {
      idCourse: idCourse,
      idStudent: idUser
    };
    try {
      const response = await fetch(`http://localhost:4200/courses/enrolledCourses/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to delete from enrolled courses');
      }

      const jsonData = await response.json();
      console.log(jsonData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className={`z-5 offcanvas course-offcanvas offcanvas-end ${show ? 'show' : ''}`}
      tabIndex="-1"
      id={id}
      aria-labelledby="offCanvasCourseLabel"
      style={{ visibility: show ? 'visible' : 'hidden' }}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offCanvasCourseLabel">Course Details</h5>
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body">
        <img src={course.previewimage} alt={course.name} className="img-fluid mb-3 rounded shadow" />
        <h6 className="fw-bold fs-5 mb-3"><em>{course.name}</em></h6>
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Privacy:</strong> {course.privacy}</p>
        <p><strong>Creator:</strong> <span className='underline'>{course.firstName} {course.lastName}</span></p>
        <div className="text-warning underline">
          <strong><i><a href={`rate/${course.idCourse}`}>Rate</a></i></strong>
        </div>

        <button 
          onClick={() => addToEnrolledCourses(course.idCourse)} 
          type="button" 
          className="btn custom-button2 d-flex justify-content-center mt-3 px-5 w-100 fw-bold text-white"
        >
          Start the course
        </button>
      </div>
    </div>
  );
};

OffCanvasCourse.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  course: PropTypes.shape({
    idCourse: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string.isRequired,
    teacher: PropTypes.string,
    previewimage: PropTypes.string,
    category: PropTypes.string,
    privacy: PropTypes.string, // public or private
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  id: PropTypes.number.isRequired, // PropTypes for `id` passed as prop
};

export default OffCanvasCourse;
