import  {useEffect , useState} from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

function ViewCourse() {

  const [token , setToken] = useState(null);

  const {courseId} = useParams() ;
  console.log(courseId);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        setToken(storedToken);
    }, []);
  const [course, setCourse] = useState({});
  
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
        console.log(jsonData);
        setCourse(jsonData.course);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    useEffect(()=>{
      getCourse();
    },[token]);


  return (
    <div className="view-course-container mt-5 mb-5 m-auto" style={{ maxWidth: '800px' }}>
      <div className="card shadow-sm">
        <div className="card-header">
          <h3 className="mb-0">{course.name}</h3>
          <p className="mb-0">Course ID: <strong className='text-blue'>#{course.idCourse}</strong></p>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-4 text-center">
              <img
                src={course.previewimage || 'https://via.placeholder.com/400'}
                alt={`${course.name} Preview`}
                style={{ maxWidth: '100%', maxHeight: '200px' }}
                className="img-thumbnail"
              />
            </div>
            <div className="col-md-8">
              <h5>Course Information</h5>
              <p><strong>Type:</strong> {course.privacy}</p>
              <p><strong>Category:</strong> {course.category}</p>
              <p><strong>Instructor:</strong> {course.firstName}  {course.lastName}</p>
              <p><strong>Description:</strong> {course.description}</p>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-12">
              <h5>Instructor Profile</h5>
              <div className="d-flex align-items-center">
                <img
                  src={course.image || 'https://via.placeholder.com/100'}
                  alt={`${course.firstName}  ${course.lastName}Profile`}
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  className="me-3"
                />
                <p className="mb-0"><strong>{course.firstName}  {course.lastName}</strong></p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h5>Rating Insights</h5>
              <div className="d-flex align-items-center mb-2">
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{}</div>
                <div className="ms-2">
                  <span className="text-warning">&#9733;</span>
                  <span className="text-warning">&#9733;</span>
                  <span className="text-warning">&#9733;</span>
                  <span className="text-warning">&#9733;</span>
                  <span className="text-muted">&#9733;</span> {/* Adjust stars based on averageRating */}
                </div>
                <div className="ms-2">
                  <strong>{course.rating} out of 5</strong>
                  <p className="text-muted">{course.rating} ratings</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default ViewCourse;
