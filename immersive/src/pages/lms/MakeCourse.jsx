import { useEffect, useState } from 'react';
import CourseDetailsPage from '../../components/lms/CourseDetailsPage';
import FileUploadPage from '../../components/lms/FileUploadPage';
import AdditionalAssetsPage from '../../components/lms/AdditionalAssetsPage';
import CoursePreviewPage from '../../components/lms/CoursePreviewPage';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

const MakeCourse = () => {
    const [token , setToken] = useState(sessionStorage.getItem('token'));
    const [id , setId] = useState(sessionStorage.getItem('id'));
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [courseData, setCourseData] = useState({
        idTeacher: id,
        title: '',
        description: '',
        category: '',
        environment: '',
        skillLevel:'',
        privacy: '',
        coursePDF: '',
        video: '',
        previewimage: '',
        prerequisites:'',
        gainedSkills:'',
        additionalAssets: [],
    });

    useEffect(()=>{
        const storedId = sessionStorage.getItem('id');
        setId(storedId);
    },[]);

    useEffect(()=>{
        const storedToken = sessionStorage.getItem('token');
        setToken(storedToken);
    },[]);

    console.log(courseData);

    const saveCourse = async (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('idTeacher', courseData.idTeacher);
        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        formData.append('category', courseData.category);
        formData.append('environment', courseData.environment);
        formData.append('privacy', courseData.privacy);
        formData.append('coursePDF', courseData.coursePDF);
        formData.append('video', courseData.video);
        formData.append('skillLevel', courseData.skillLevel);
        formData.append('gainedSkills', courseData.gainedSkills);
        formData.append('prerequisites', courseData.prerequisites);
        formData.append('previewimage', courseData.previewimage);

        // Append additional assets with unique keys
        courseData.additionalAssets.forEach((asset, index) => {
            formData.append(`additionalAsset_${index}_name`, asset.name);
            formData.append(`additionalAsset_${index}_type`, asset.type);
            formData.append(`additionalAsset_${index}_file`, asset.file);
        });

        try{
            const response = await fetch('http://localhost:4200/courses/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                if(courseData.environment === 'school'){
                    navigate(`/immersive-space/schoolEditor/${data.idCourse}`);
                }else if (courseData.environment === 'lab'){
                    navigate(`/immersive-space/labEditor/${data.idCourse}`);
                }
            } else {
                console.error('Error:', data.message);
            }   
        } catch(error){
            console.error(error.message);
        }
    };

    const handleNext = (e) => {
        const carouselElement = document.getElementById('courseCarousel');
        const carousel = new Carousel(carouselElement);
        const currentForm = document.querySelectorAll('.carousel-item form')[currentIndex];
        if (currentForm && currentForm.checkValidity()) {
            if (currentIndex === 3) {
                handleConfirm(e); // Call handleConfirm when on the last step
            } else {
                carousel.next();  // Go to the next slide
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }
        } else if (currentForm) {
            currentForm.reportValidity();
        } else if (currentIndex === 3) {
            handleConfirm(e); // Call handleConfirm when on the last step
        } else {
            carousel.next();  // Go to the next slide
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };
    
    const handlePrev = () => {
        if (currentIndex > 0) {
            const carouselElement = document.getElementById('courseCarousel');
            const carousel = new Carousel(carouselElement);
            carousel.prev();  // Go to the previous slide
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };
    

    const handleConfirm = (e) => {
        saveCourse(e);
    };

    return (
        <div id="courseCarousel" className="carousel slide" data-bs-ride="false">
            <div className='p-2'>
                <a className='fs-5' href="javascript:history.back()">
                    <div className="custom-button2 rounded-circle fs-4 px-3">
                        <i className="bi bi-arrow-left"></i>
                    </div>&nbsp;
                    <span className='underline'>Go back</span>
                </a>
            </div>
            <div className="carousel-inner">
                <CourseDetailsPage setCourseData={setCourseData} />
                <FileUploadPage setCourseData={setCourseData} />
                <AdditionalAssetsPage setCourseData={setCourseData} />
                <CoursePreviewPage courseData={courseData} onConfirm={handleConfirm} />
            </div>

            {/* Carousel Controls */}
            <div className="carousel-controls">
                <button
                    className="btn custom-button2 text-light shadow"
                    id='previous-carousel-page-btn'
                    onClick={handlePrev}
                    style={{ display: currentIndex === 0 ? 'none' : 'inline-block' }}
                >
                    Previous
                </button>                
                <button className="btn custom-button3 text-light shadow" onClick={handleNext}>
                    {currentIndex === 3 ? "Procced to Editor" : "Next"}
                </button>
            </div>
        </div>
    );
};

export default MakeCourse;
