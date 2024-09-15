import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';


function EditCourse() {
  const {courseId} = useParams();
  const [course, setCourse] = useState({});
  const [token , setToken] = useState(sessionStorage.getItem('token'));

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        setToken(storedToken);
    }, []);
  
    const getCourse = async () => {
      try {
        const response = await fetch(`http://localhost:4200/courses/get/course/${courseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
        });
      if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const jsonData = await response.json();
        setCourse(jsonData.course);
      } catch (error) {
        console.error('Error:', error);
      }
    };



    useEffect(()=>{
      getCourse();
    },[token]);

  const [formData, setFormData] = useState({
    name: '',
    privacy: '',
    category: '',
    previewImg: '',
    description: '',
  });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || '',
        privacy: course.privacy || '',
        category: course.category || '',
        previewImg: course.previewimage || '',
        description: course.description || '',
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          previewImg: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const updateCourse = async (formData) => {
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('privacy', formData.privacy);
      data.append('category', formData.category);
      data.append('image', formData.previewImg);
      data.append('description', formData.description);
      const response = await fetch(`http://localhost:4200/courses/update/${courseId}`, {
        method: 'PUT',
        headers: {
          'authorization': `Bearer ${token}`,
        },
        body : data
      });
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      const jsonData = await response.json();
      setCourse(jsonData.course);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Form data:', formData); // Log the form data to check if it's correct
    updateCourse(formData); // Call the onSave function passed as a prop
    setShowAlert(true); // Show the success alert
    setTimeout(() => setShowAlert(false), 3000); // Hide the alert after 3 seconds
  };
  

  return (
    <div className="edit-course-container mt-5 mb-5 m-auto" style={{ maxWidth: '800px' }}>
      <h2>Edit Course</h2>

      {showAlert && (
        <div className="alert alert-success" role="alert">
          Course details have been successfully saved!
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <div className="d-flex flex-row align-items-start">
              <div className="profile-image-container m-auto text-center mb-3">
                <p><i>Remember, a good course preview image means more traffic for your course</i></p>
                <img
                  src={formData.previewImg || 'https://via.placeholder.com/400'}
                  id="profileImage"
                  style={{minWidth: '250px' ,  maxWidth: '400px' , maxHeight: '200px', minHeight: '150px' }}
                  className="img-thumbnail shadow"
                  alt="Profile"
                />
                <div className="edit-icon small-scale-on-hover" role="button">
                  <label htmlFor="profileImageInput" className="camera-previewImg-button rounded-circle" role="button">
                    <i className="bi bi-camera-fill fs-6 p-1"></i>
                  </label>
                  <input
                    type="file"
                    id="profileImageInput"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                </div>
                <div className="mt-2 text-start">
                  Course ID: <p className="text-blue text-decoration-underline">#{course.idCourse}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mt-5">
            <div className="col-12 mb-2">
              <label htmlFor="name" className="form-label"><b>Course Name</b></label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="type" className="form-label"><b>Course Type</b></label>
              <select
                id="type"
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="col-12 mb-2">
              <label htmlFor="category" className="form-label"><b>Course Category</b></label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="software">Software</option>
                <option value="mechanics">Mechanics</option>
              </select>
            </div>
          </div>
          
          
          
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label"><b>Course Description</b></label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn custom-button3 px-3"><b>Save Changes</b></button>
      </form>
    </div>
  );
}

EditCourse.propTypes = {
  course: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    previewImg: PropTypes.string,
    teacher: PropTypes.string,
    teacherProfile: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditCourse;
