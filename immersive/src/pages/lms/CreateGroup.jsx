import { useState, useEffect } from 'react';
import defaultGroupProfile from '../../assets/lms/group-profiles/group.png';
import { useNavigate } from 'react-router-dom';


function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [image , setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [id, setId] = useState(null);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState('');
  const [step, setStep] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);

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
    setId(storedId);
  }, []);

  const handleNext = (event) => {
    event.preventDefault();
    const form = event.target.closest('form');
    if (form.checkValidity()) {
      setStep(step + 1);
    } else {
      form.reportValidity(); // Show built-in validation messages
    }
  };

  const handlePrev = () => setStep(step - 1);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const usernameList = users.split(',').map(user => user.trim().replace(/^@/, ''));

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('idTeacher', id);
      formData.append('groupName', groupName);
      formData.append('description', description);
      formData.append('studentsList', usernameList);
      formData.append('image', image);

      console.log(formData);
      const response = await fetch('http://localhost:4200/groups/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        console.log('Group created successfully');
        navigate('/groups');
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } 
  };

  const getUsers = async () => {
    try {
      const response = await fetch('http://localhost:4200/students/usernames', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAvailableUsers(data.students);
        console.log(data.students);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } 
  };

  useEffect(()=>{
    if(token){
    getUsers();
    }
  },[token]);

  console.log(availableUsers);

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('profileImage').src = reader.result;
      };
      reader.readAsDataURL(file);
      setProfileImage(file);
    }
  };

  const handleUserInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const lastAtIndex = value.lastIndexOf('@');
    const query = lastAtIndex !== -1 ? value.slice(lastAtIndex + 1).trim() : '';

    if (query.length > 0) {
      const filteredUsers = availableUsers.filter(user => user.includes(query));
      setSuggestions(filteredUsers);
    } else {
      setSuggestions([]);
    }

    setUsers(value);
  };

  const handleSuggestionClick = (suggestion) => {
    const lastAtIndex = inputValue.lastIndexOf('@');
    const updatedInput = `${inputValue.slice(0, lastAtIndex + 1)}${suggestion} `;
    setInputValue(updatedInput);
    setUsers(updatedInput);
    setSuggestions([]);
  };

  return (
    <div className="carousel create-group-carousel" id='create-group-carousel'>
    
      {step === 0 && (
        <div className="carousel-item active d-flex justify-content-center">
          <form className="p-4" >
            <div className="form-group">
              <label htmlFor="groupName">Group Name</label>
              <input
                type="text"
                className="form-control"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                required
              />
            </div>
            <button type="button" onClick={handleNext} className="btn custom-button3 btn-next">Next</button>
          </form>
        </div>
      )}
      {step === 1 && (
        <div className="carousel-item active d-flex justify-content-center">
          <form className="p-4" >
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter group description"
                required
              />
            </div>
            <button type="button" className="btn custom-button2 btn-prev" onClick={handlePrev}>Previous</button>
            <button type="button" onClick={handleNext} className="btn custom-button3 btn-next">Next</button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div className="carousel-item active d-flex justify-content-center">
          <form className="p-4" >
            <div className="form-group">
              <label htmlFor="users">Add Users</label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  id="users"
                  value={inputValue}
                  onChange={handleUserInputChange}
                  placeholder="Enter @usernames, separated by commas"
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} onClick={() => handleSuggestionClick(suggestion)}>{suggestion}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button type="button" className="btn custom-button2 btn-prev" onClick={handlePrev}>Previous</button>
            <button type="button" onClick={handleNext} className="btn custom-button3 btn-next">Next</button>
          </form>
        </div>
      )}
      {step === 3 && (
        <div className="carousel-item active d-flex justify-content-center">
          <form className="p-4" onSubmit={handleSubmit}>
            <h5>Review and Confirm</h5>
            <div className="profile-image-container">
              <img src={profileImage || defaultGroupProfile} id="profileImage" className="img-thumbnail shadow rounded-circle" alt="Profile Image" style={{ width: "100px", height: "100px" }} />
              <div className="edit-icon scale-on-hover" role="button">
                <label htmlFor="profileImageInput" role='button'>
                  <i className="bi bi-camera-fill fs-6 p-1"></i>
                </label>
                <input type="file" id="profileImageInput"  name="image" onChange={(e) => { handleImageChange(e); previewImage(e); }} style={{ display: 'none' }} />
              </div>
            </div>
            <p className='mt-2'><strong>Group Name:</strong> {groupName}</p>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Admin :</strong> You</p>
            <p><strong>Members :</strong> {users}</p>
            <button type="button" className="btn custom-button2 btn-prev" onClick={handlePrev}>Previous</button>
            <button type="submit" className="btn custom-button3 btn-next">Create Group</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateGroup;
