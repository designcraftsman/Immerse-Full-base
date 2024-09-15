import { useEffect, useState } from 'react';
import CourseCard from '../../components/lms/CourseCard.jsx';
import AssignementCard from '../../components/lms/AssignementCard.jsx';
import OffCanvasCourse from '../../components/lms/OffCanvasCourse.jsx';
import PropTypes from 'prop-types';
import { courseShape, assignmentShape } from '../../types/types.js';

  // Dashboard inner components : 
  import Overview from "../../components/lms/DashboardComponents/Overview";
  import Enrollment from "../../components/lms/DashboardComponents/Enrollment";
  import CommitmentInsight from "../../components/lms/DashboardComponents/CommitmentInsight";
  import ContinentInsights from "../../components/lms/DashboardComponents/ContinentInsights";
  import CountryInsights from "../../components/lms/DashboardComponents/CountryInsights";

const Dashboard = () => {
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [visibleEnrolledCourses, setVisibleEnrolledCourses] = useState(4);
  const [visibleBookmarksCourses, setVisibleBookmarksCourses] = useState(4);
  const [visibleRecommendedCourses, setVisibleRecommendedCourses] = useState(4);
  const [showMoreEnrolled, setShowMoreEnrolled] = useState(true);
  const [showMoreBookmarks, setShowMoreBookmarks] = useState(true);
  const [showMoreRecommended, setShowMoreRecommended] = useState(true);

  //Api start
  const [role, setRole] = useState(sessionStorage.getItem('role'));
  const [id, setId] = useState(sessionStorage.getItem('id'));
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [bookMarkedCourses, setBookMarkedCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    setId(sessionStorage.getItem('id'));
    setToken(sessionStorage.getItem('token'));
    setRole(sessionStorage.getItem('role'));
  }, []);

  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const response = await fetch(`http://localhost:4200/courses/enrolledCourses/get/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const jsonData = await response.json();
        setEnrolledCourses(jsonData.response);
      } catch (error) {
        console.error('Error:', error);
        setEnrolledCourses([]); // Set courses to an empty array on error
      }
    };

    if (token && id) {
      getEnrolledCourses();
    }
  }, [id, token]);

  useEffect(() => {
    const getBookMarkedCourses = async () => {
      try {
        const response = await fetch(`http://localhost:4200/courses/bookMarkedCourses/get/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const jsonData = await response.json();
        setBookMarkedCourses(jsonData.response);
        console.log(jsonData);
      } catch (error) {
        console.error('Error:', error);
        setBookMarkedCourses([]); // Set courses to an empty array on error
      }
    };

    if (token && id) {
      getBookMarkedCourses();
    }
  }, [id, token]);


  useEffect(() => {
    const getRecommendedCourses = async () => {
      try {
        const response = await fetch(`http://localhost:4200/courses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const jsonData = await response.json();
        console.log(jsonData);
        setRecommendedCourses(jsonData.courses);
      } catch (error) {
        console.error('Error:', error);
        setRecommendedCourses([]); // Set courses to an empty array on error
      }
    };

    if (token && id) {
      getRecommendedCourses();
    }
  }, [id, token]);

  //Api end


  //student dashboard


  const handleShow = (course) => {
    setCurrentCourse(course);
    setShowOffCanvas(true);
  };

  const handleClose = () => {
    setShowOffCanvas(false);
    setCurrentCourse(null);
  };

  const handleLoadMore = (category) => {
    if (category === "enrolled") {
      if (showMoreEnrolled) {
        setVisibleEnrolledCourses(prev => prev + 4);
        if (visibleEnrolledCourses >= enrolledCourses.length) {
          setShowMoreEnrolled(false);
        }
      } else {
        setVisibleEnrolledCourses(4);
        setShowMoreEnrolled(true);
      }
    } else if (category === "bookmarks") {
      if (showMoreBookmarks) {
        setVisibleBookmarksCourses(prev => prev + 4);
        if (visibleBookmarksCourses >= bookMarkedCourses.length) {
          setShowMoreBookmarks(false);
        }
      } else {
        setVisibleBookmarksCourses(4);
        setShowMoreBookmarks(true);
      }
    } else if (category === "recommended") {
      if (showMoreRecommended) {
        setVisibleRecommendedCourses(prev => prev + 4);
        if (visibleRecommendedCourses >= recommendedCourses.length) {
          setShowMoreRecommended(false);
        }
      } else {
        setVisibleRecommendedCourses(4);
        setShowMoreRecommended(true);
      }
    }
  };

  useEffect(() => {
    let exploreBtn = document.querySelector(".explore-button");
    if (exploreBtn) {
      exploreBtn.style.display = "none";
    }
  }, []);

  return (
    <div className="dashboard ">
      { role === 'teacher' && (
      <div className='px-2'>
          
            <div className="row">
              <div className="col-12">
                <Overview />
              </div>
              <div className="col-12 col-lg-6">
                <Enrollment   />

              </div>
              <div className="col-12 col-sm-6">
              <CommitmentInsight  />

              </div>
              <div className="col-12 col-sm-6">
              <ContinentInsights  />

              </div>
              <div className="col-12 col-sm-6">
              <CountryInsights />

              </div>
            </div>
          
        </div>
           )}
      { role === "student" &&   (
      <div>
        { enrolledCourses.length > 0 && (
        <div id='enrolled'>
          <h4 className="mt-2" >Enrolled Courses</h4>
          <div className="row">
            {enrolledCourses.slice(0, visibleEnrolledCourses).map((course, index) => (
              <div className="col-12 col-sm-6 col-md-3 mb-2" key={index}>
                <a onClick={() => handleShow(course)} className='text-decoration-none' href="#"><CourseCard {...course} /></a>
              </div>
            ))}
            {enrolledCourses.length > visibleEnrolledCourses && (
              <div className="col-12 mt-2">
                <a onClick={() => handleLoadMore("enrolled")} className="loadMoreButton loadMoreButton2 text-decoration-none" href='#enrolled'> 
                  {showMoreEnrolled ? 'Load More' : 'Show Less'}
                </a>
              </div>
            )}
          </div>
        </div>
        )}
        { bookMarkedCourses.length > 0 && (
        <div id='bookmarks'>
          <h4 className="mt-5" >Bookmarks</h4>
          <div className="row">
            {bookMarkedCourses.slice(0, visibleBookmarksCourses).map((course, index) => (
              <div className="col-12 col-sm-6 col-md-3 mb-2" key={index}>
                <a onClick={() => handleShow(course)} className='text-decoration-none' href="#"><CourseCard {...course} /></a>
              </div>
            ))}
            {bookMarkedCourses.length > visibleBookmarksCourses && (
              <div className="col-12 mt-2">
                <a onClick={() => handleLoadMore("bookmarks")} className="loadMoreButton loadMoreButton2" href='#bookmarks'>
                  {showMoreBookmarks ? 'Load More' : 'Show Less'}
                </a>
              </div>
            )}
          </div>
        </div>
        )}

        <div className="mt-5" id='topPicks'>
          <h4 className="mt-2">Top Picks for You</h4>
          <div className="row">
            {recommendedCourses.slice(0, visibleRecommendedCourses).map((course, index) => (
              <div className="col-12 col-sm-6 col-md-3 mb-2" key={index}>
                <a onClick={() => handleShow(course)} href="#" className='text-decoration-none'><CourseCard {...course} /></a>
              </div>
            ))}
            {recommendedCourses.length > visibleRecommendedCourses && (
              <div className="col-12 mt-2">
                <a onClick={() => handleLoadMore("recommended")} className="loadMoreButton loadMoreButton2" href='#topPicks'>
                  {showMoreRecommended ? 'Load More' : 'Show Less'}
                </a>
              </div>
            )}
          </div>
        </div>

        
      </div>
      )}
      {currentCourse && (
        <OffCanvasCourse show={showOffCanvas} onClose={handleClose} course={currentCourse} id={`offcanvasCourse${currentCourse.id}`} />
      )}
    </div>
  );
};



export default Dashboard;
