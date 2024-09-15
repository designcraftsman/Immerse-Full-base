import { useState, useEffect } from 'react';
import defaultGroupProfile from '../../assets/lms/group-profiles/group.png';
import { useNavigate } from 'react-router-dom';

function CreateSession() {
  const [sessionName, setSessionName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]); // State for groups
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [id, setId] = useState(null);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState('');
  const [step, setStep] = useState(0);
  const [course, setCourse] = useState(null);
  const [group, setGroup] = useState(null); // State for selected group
  const [code, setCode] = useState(''); // State for code input

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (!storedToken) {
      navigate('/sign-in');
    } else {
      setToken(storedToken);
      getCourses();
      getGroups(); // Fetch groups along with courses
    }
  }, [navigate, token]);

  useEffect(() => {
    const storedId = sessionStorage.getItem('id');
    setId(storedId);
  }, []);

  const getCourses = async () => {
    try {
      const response = await fetch(`http://localhost:4200/courses/get/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const jsonData = await response.json();
      setCourses(jsonData.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const getGroups = async () => {
    try {
      const response = await fetch(`http://localhost:4200/groups/get/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const jsonData = await response.json();
      setGroups(jsonData.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleNext = (event) => {
    event.preventDefault();
    const form = event.target.closest('form');
    if (form.checkValidity()) {
      setStep(step + 1);
    } else {
      form.reportValidity();
    }
  };

  const handlePrev = () => setStep(step - 1);



  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
       const formData = {
        idTeacher: id,
        sessionName: sessionName,
        description: description,
        course: course,
        group : group,
        code: code
        };
        console.log(formData);
      const response = await fetch('http://localhost:4200/sessions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        navigate('/my-space/sessions');
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error submitting session:', error);
    }
  };
  console.log(id,sessionName,group,code,course,description);

  return (
    <div className="carousel create-group-carousel" id="create-group-carousel">
      {step === 0 && (
        <div className="carousel-item active d-flex justify-content-center">
          <form className="p-4">
            <div className="form-group">
              <label htmlFor="groupName">Session Name</label>
              <input
                type="text"
                className="form-control"
                id="groupName"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Enter session name"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary text-white fw-bold position-absolute"
              style={{ right: '40px', bottom: '100px' }}
            >
              Next
            </button>
          </form>
        </div>
      )}

      {step === 1 && (
        <div className="carousel-item active d-flex justify-content-center">
          <form className="p-4">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter session description"
                required
              />
            </div>
            <button
              type="button"
              className="btn btn-primary text-white fw-bold position-absolute"
              onClick={handlePrev}
              style={{ left: '40px', bottom: '100px' }}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary text-white fw-bold position-absolute"
              style={{ right: '40px', bottom: '100px' }}
            >
              Next
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="carousel-item active d-flex justify-content-center">
          <form className="p-4">
            <div className="form-group">
              <label htmlFor="course">Course</label>
              <select
                className="form-control"
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.idCourse} value={course.idCourse}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="group">Group</label>
              <select
                className="form-control"
                id="group"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                required
              >
                <option value="">Select a group</option>
                {groups.map((group) => (
                  <option key={group.idGroupe} value={group.idGroupe}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="code">Session Code</label>
              <input
                type="text"
                className="form-control"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter session code"
                required
              />
            </div>
            <button
              type="button"
              className="btn btn-primary text-white fw-bold position-absolute"
              onClick={handlePrev}
              style={{ left: '40px', bottom: '100px' }}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary text-white fw-bold position-absolute"
              style={{ right: '40px', bottom: '100px' }}
            >
              Next
            </button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="carousel-item active d-flex justify-content-center">
          <form className="p-4" onSubmit={handleSubmit}>
            <h5 className='fs-4'>Review and Confirm</h5>
            <hr />
            <p className="mt-2 fs-6">
              <strong><u>Session Name:</u> </strong> {sessionName}
            </p>
            <p className="mt-2 fs-6">
              <strong><u>Description:</u></strong> {description}
            </p >
            <p className="mt-2 fs-6">
              <strong><u>Course:</u></strong> {course}

            </p>
            <p className="mt-2 fs-6">
              <strong><u>Group:</u></strong> {group}
            </p>
            <p className="mt-2 fs-6">
               <strong><u>Session Code:</u></strong>  {code}
            </p>
            <button
              type="button"
              className="btn btn-primary text-white fw-bold position-absolute"
              onClick={handlePrev}
              style={{ left: '40px', bottom: '100px' }}
            >
              Previous
            </button>
            <button
              type="submit"
              className="btn btn-primary text-white fw-bold position-absolute"
              style={{ right: '40px', bottom: '100px' }}
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateSession;
