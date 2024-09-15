import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import defaultImage from '../../assets/lms/group-profiles/user.avif' ;
import { studentShape } from '../../types/types.js';

function Profile() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [teacher, setTeacher] = useState({});
  const [id, setIdTeacher] = useState(null);
  const [imgurl, setImgUrl] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthDate] = useState('');
  const [specialisation, setSpecialization] = useState('');
  const [gender, setGender] = useState('');
  const [role , setRole] = useState('');


  useEffect(() => {
    const storedRole = sessionStorage.getItem('role');
    setRole(storedRole);
  }, []);
  const dateConverter = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (!storedToken) {
      navigate('/sign-in');
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  useEffect(() => {
    const storedId = sessionStorage.getItem('id');
    setIdTeacher(storedId);
  }, []);

  useEffect(() => {
    if (token) {
      getTeacher();
    }
  }, [token]);

  const getTeacher = async () => {
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
      setImgUrl(teacherData.image);
      setTeacher(teacherData);
      setFirstName(teacherData.firstName);
      setLastName(teacherData.lastName);
      setEmail(teacherData.email);
      setBirthDate(dateConverter(teacherData.birthDate));
      setSpecialization(teacherData.specialization);
      setGender(teacherData.gender);
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
      const teacherData = await response.json();
      setImgUrl(teacherData.image);
      setTeacher(teacherData);
      setFirstName(teacherData.firstName);
      setLastName(teacherData.lastName);
      setEmail(teacherData.email);
      setBirthDate(dateConverter(teacherData.birthDate));
      setGender(teacherData.gender);
    }else{
      throw new Error('Failed to fetch user');
    }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('profileImage').src = reader.result;
      };
      reader.readAsDataURL(file);
      setImgUrl(file);  // Store the file object
    }
  };

  const handleSubmit = async () => {
    try {
      if (role === 'teacher') {
      const formData = new FormData();
      formData.append('image', imgurl);
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('email', email);
      formData.append('birthdate', birthdate);
      formData.append('specialisation', specialisation);
      formData.append('gender', gender);

      const response = await fetch(`http://localhost:4200/teachers/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log('Info updated successfully');
      }
    }else if (role ==='student'){
      const formData = new FormData();
      formData.append('image', imgurl);
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('email', email);
      formData.append('birthdate', birthdate);
      formData.append('gender', gender);
      const response = await fetch(`http://localhost:4200/students/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log('Info updated successfully');
      }
    }else{
      throw new Error('Failed to fetch user');
    }
    } catch (error) {
      console.log("error:", error.message);
    }
  };
  console.log(imgurl);

  return (
    <div className="profile ms-0 ms-md-5 mt-3">
      <div>
        <div className="d-flex flex-row align-items-start">
          <div className="profile-image-container">
            <img src={imgurl || defaultImage} id="profileImage" className="img-thumbnail shadow" alt="Profile Image" />
            <div className="edit-icon scale-on-hover" role="button">
              <label htmlFor="profileImageInput" role='button'>
                <i className="bi bi-camera-fill fs-6 p-1"></i>
              </label>
              <input type="file" id="profileImageInput" name="image"  onChange={(e) => previewImage(e)} style={{ display: 'none' }} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-9">
            <div className="user-id-container mt-1">
              Your user id is: <span className="user-id" role="button">{id}</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group row mt-2">
                <div className="col-6">
                  <label htmlFor="firstname" className="col-form-label">Firstname</label>
                  <input type="text" name="firstname" onChange={(e) => setFirstName(e.target.value)} className="form-control shadow-sm" id="firstname" value={firstname} />
                </div>
                <div className="col-6">
                  <label htmlFor="lastname" className="col-form-label">Lastname</label>
                  <input type="text" className="form-control shadow-sm" onChange={(e) => setLastName(e.target.value)} name="lastname" id="lastname" value={lastname} />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-6">
                  <label htmlFor="gender" className="col-form-label">Gender</label>
                  <select name="gender" id="gender" onChange={(e) => setGender(e.target.value)} className="form-select shadow-sm" aria-label="Default select example" value={gender} required>
                    <option value="" disabled selected>Select...</option>
                    <option value="homme">Male</option>
                    <option value="femme">Female</option>
                    <option value="autre">Other</option>
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label htmlFor="birthdate" className="col-form-label">Birthdate</label>
                  <input type="date" name="birthdate" onChange={(e) => setBirthDate(e.target.value)} className="form-control shadow-sm" id="birthdate" value={birthdate} />
                </div>
                { role === 'teacher' && (
                <div className="col-6">
                  <select name="specialization" id="specialization" onChange={(e) => setSpecialization(e.target.value)} className="form-control text-secondary custom-select p-0 ps-2" value={specialisation} required>
                    <option value="Mecanics">Mechanics</option>
                    <option value="Maths">Maths</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Software">Software</option>
                    <option value="Geology">Geology</option>
                    <option value="Physics">Physics</option>
                  </select>
                </div>
                 )}
              </div>
              <div className="form-group row">
                <div className="col-12" title="You cannot change the email you signed up with">
                  <label htmlFor="email" className="col-form-label">Email <span className="text-danger"><b>*</b></span></label>
                  <input type="email" name="email" className="form-control shadow-sm" onChange={(e) => setEmail(e.target.value)} value={email} id="email" disabled />
                </div>
              </div>
              <button type="button" className="btn custom-button2 px-5 mt-2" data-bs-toggle="modal" data-bs-target="#confirmSave">Save</button>
              <div className="modal fade" id="confirmSave" tabIndex="-1" aria-labelledby="confirmSaveLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="confirmSaveLabel">Confirm updates</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                      <button type="submit" className="btn btn-success">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

Profile.propTypes = {
  teacher: PropTypes.shape(studentShape).isRequired,
};

export default Profile;
