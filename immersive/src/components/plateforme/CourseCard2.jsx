import React , {useState, useEffect} from 'react';
import { FaUsers, FaStar } from 'react-icons/fa';
import categorie1 from '../../assets/plateforme/categorie1.jpg';
import person from '../../assets/plateforme/person1.jpg';
import { Link } from 'react-router-dom';


const CourseCard = ({ course }) => {
  
  const [courseRatings , setCourseRatings] = useState([]);

  const getCourseRatings = async () => {
    try {
      const url = `http://localhost:4200/courseRates/course/${course.idCourse}`;
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
      stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>);
    }

    return stars;
  };
  const totalRating = courseRatings.length;
  return (
    <div className="course-card2">
      <div className="card-image-wrapper">
        <img src={course.previewimage} alt={course.name} className="course-image" />
        {course.isNew && <span className="new-badge bg-primary">New</span>}
      </div>
      <div className="course-info p-3">
        <div className="course-rating mb-2 d-flex align-items-center text-warning">
        {getStarIcons(course.rating || 0)}
          <span className="course-reviews ms-2">({totalRating} Reviews)</span>
        </div>
        <h3 className="course-title mb-2">{course.name}</h3>
        <p className="course-enrolled mb-2 text-muted d-flex align-items-center">
          <FaUsers className="me-2" /> {course.totalStudentsEnrolled === null ? '0': course.totalStudentsEnrolled} student(s) enrolled
        </p>
        <div className="course-teacher d-flex align-items-center">
          <img src={course.image} alt={course.firstName + ' ' + course.lastName} className="teacher-image me-2" />
          <span>{course.firstName + ' ' + course.lastName}</span>
        </div>
        <a 
          href={`/course/${course.idCourse}`} 
          className="btn w-100 mt-3 btn-primary d-block text-center text-decoration-none fw-bolder text-white"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};

export default CourseCard;
