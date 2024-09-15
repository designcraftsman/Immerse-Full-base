import React , {useState, useEffect} from "react";
import categorie1 from '../../assets/plateforme/categorie1.jpg';
import { FaUsers, FaBookmark, FaStar } from "react-icons/fa";


const CourseCard = ({ id, name, firstName, lastName, teacherProfile, type, previewImg, bookmark, rating, totalStudentsEnrolled }) => {
  const [courseRatings , setCourseRatings] = useState([]);

  const getCourseRatings = async () => {
    try {
      const url = `http://localhost:4200/courseRates/course/${id}`;
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
  return (
    <a role="button" className="text-decoration-none" href={`/course/${id}`}>
    <div className="course-card">
      {/* Badge for course type */}
      {type && <div className={`badge ${type.toLowerCase()}`}>{type}</div>}
      
      {/* Course preview image */}
      <img src={previewImg} alt={name} className="course-image" />

      <div className="course-info">
        {/* Bookmark icon */}
        {bookmark && (
          <div className="bookmark">
            <FaBookmark />
          </div>
        )}

        {/* Course rating */}
        <div className="rating text-warning">
        {getStarIcons(rating || 0)}
        <span className="course-reviews ms-2 text-dark">({totalRating} Reviews)</span>
        </div>

        {/* Course title */}
        <h3 className="title fs-6">{name}</h3>
        <p className="course-enrolled mb-2 text-muted d-flex align-items-center">
          <FaUsers className="me-2" /> {totalStudentsEnrolled === null ? '0': totalStudentsEnrolled} student(s) enrolled
        </p>
        {/* Teacher profile and name */}
        <div className="instructor">
          <img src={teacherProfile} alt={firstName+lastName} className="teacher-image" />
          <p>{firstName + ' '+ lastName}</p>
        </div>
      </div>
    </div>
    </a>
  );
};

export default CourseCard;
