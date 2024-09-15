import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { studentShape } from '../../types/types.js';
import defaultUserProfile from '../../assets/lms/group-profiles/user.avif';

const Students = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [students, setStudents] = useState([]);
  const [idTeacher, setIdTeacher] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (!storedToken) {
        navigate('/sign-in');
    } else {
        setToken(storedToken);
    }
  }, [navigate]);

  useEffect(() => {
      const storedIdTeacher = sessionStorage.getItem('idteacher');
      setIdTeacher(storedIdTeacher);
  }, []);
  console.log(idTeacher);

  const getStudents = async () => {
      try {
          const response = await fetch('http://localhost:4200/students', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
          });

          if (!response.ok) {
              throw new Error('Failed to fetch students');
          }

          const jsonData = await response.json();
          setStudents(jsonData.students);
      } catch (error) {
          console.error('Error:', error);
          
      }
  };

  useEffect(() => {
      if (token) {
          getStudents();
      }
  }, [token]);
  return (
    <div   className="students mt-5">
      <table   className="table shadow">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Id</th>
            <th scope="col">Email</th>
            <th scope="col">Courses Attended</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr scope="row"   className="small-scale-on-hover" key={index}>
              <td>
                <img   className="profile-img" src={student.image || defaultUserProfile} alt="profile" />
                <span   className="ms-2">{student.firstname} {student.lastname} </span>
              </td>
              <td>{student.idStudent}</td>
              <td>{student.email}</td>
              <td>10</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Students.propTypes = {
  students: PropTypes.arrayOf(studentShape).isRequired,
};

export default Students;
