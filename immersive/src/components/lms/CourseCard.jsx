import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

function CourseCard(props) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState(''); // 'success' or 'error'

    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('id');

    const addToBookmarks = async (courseId) => {
        const formData = {
            idCourse: courseId,
            idStudent: id
        };
        try {
            const response = await fetch(`http://localhost:4200/courses/bookMarkedCourses/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to add to bookmarks');
            }

            setFeedbackMessage('Course added to bookmarks!');
            setFeedbackType('success');
            const jsonData = await response.json();
            console.log(jsonData);
        } catch (error) {
            setFeedbackMessage('Error adding course to bookmarks.');
            setFeedbackType('error');
            console.error('Error:', error);
        }
    };

    const deleteFromBookmarks = async (courseId) => {
        const formData = {
            idCourse: courseId,
            idStudent: id
        };
        try {
            const response = await fetch(`http://localhost:4200/courses/bookMarkedCourses/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to delete from bookmarks');
            }

            setFeedbackMessage('Course removed from bookmarks.');
            setFeedbackType('success');
            const jsonData = await response.json();
            console.log(jsonData);
        } catch (error) {
            setFeedbackMessage('Error removing course from bookmarks.');
            setFeedbackType('error');
            console.error('Error:', error);
        }
    };

    const checkIfBookmarked = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:4200/courses/bookMarkedCourses/get/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bookmarked courses');
            }

            const jsonData = await response.json();
            const isBookmarked = jsonData.response.some(course => course.idCourse === courseId);
            setIsBookmarked(isBookmarked);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        checkIfBookmarked(props.idCourse);
    }, [props.idCourse]);

    const handleSaveToBookmarks = (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (isBookmarked) {
            deleteFromBookmarks(props.idCourse);
        } else {
            addToBookmarks(props.idCourse);
        }

        setIsBookmarked(prevState => !prevState);
    };

    const [courseRatings , setCourseRatings] = useState([]);

  const getCourseRatings = async () => {
    try {
      const url = `http://localhost:4200/courseRates/course/${props.idCourse}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course ratings');
      }

      const jsonData = await response.json();
      setCourseRatings(jsonData.response);
    } catch (error) {
      console.error('Error:', error);
      setCourseRatings([]); // Set course ratings to an empty array on error
    }
  };
  useEffect(()=>{
    getCourseRatings();
  },[]);
  const getStarIcons = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStar = rating % 1 >= 0.5; // True if there should be a half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Number of empty stars

    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill"></i>);
    }

    // Add half star if needed
    if (halfStar) {
      stars.push(<i key="half" className="bi bi-star-half"></i>);
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }

    return stars;
  };
  const totalRating = courseRatings.length;

    const renderBookmarkIcon = () => {
        return isBookmarked ? <i className="bi bi-bookmark-fill text-primary" title="Unsave"></i> : <i className="bi bi-bookmark text-dark" title="Save to bookmarks"></i>;
    };

    return (
        <div className="lms-course-card rounded shadow small-scale-on-hover lms" style={{height:'330px'}}>
            {feedbackMessage && (
                <div className={`alert ${feedbackType === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {feedbackMessage}
                </div>
            )}
            <img className="rounded" src={props.previewimage} alt="course preview" />
            <div className="d-flex align-items-start mt-2">
                <img src={props.image} style={{ width: "25px", height: "25px" }} className='rounded-circle shadow-sm' alt="teacher profile" />
                <h5 className="teacher-name mt-1 ms-2 mb-3 ">{props.firstName} {props.lastName}</h5>
            </div>
            <h6 className="course-name mt-2 mb-3 fs-6">{props.category} Course: {props.name}</h6>
            <p className=' mt-2 '>{props.totalStudentsEnrolled} student(s) enrolled</p>
            <div className="d-flex justify-content-between align-items-center mt-2 ">
                <div className="rating text-warning">
                {getStarIcons(props.rating || 0)} <span className='fs-6 text-dark opacity-75'>({totalRating} Reviews)</span>
                </div>
                <button
                    style={{ border: "none",backgroundColor: "inherit", fontSize: "1.2em" }}
                    id='saveToBookmarksBtn'
                    onClick={handleSaveToBookmarks}
                >
                    {renderBookmarkIcon()}
                </button>
            </div>
        </div>
    );
}

CourseCard.propTypes = {
    idCourse: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    previewimage: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    bookmark: PropTypes.bool,
    rating: PropTypes.number.isRequired,
    totalStudentsEnrolled: PropTypes.number.isRequired,
};

CourseCard.defaultProps = {
    bookmark: false,
};

export default CourseCard;
