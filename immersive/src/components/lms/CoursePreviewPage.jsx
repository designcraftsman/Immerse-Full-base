import React from 'react';

const CoursePreviewPage = ({ courseData, onConfirm }) => {

    // function to change the video embed code width manualy
    const adjustVideoWidth = (embedCode, width) => {
        // Create a DOM parser to manipulate the HTML string
        const parser = new DOMParser();
        const doc = parser.parseFromString(embedCode, 'text/html');
        const iframe = doc.querySelector('iframe');
        
        if (iframe) {
            iframe.style.width = width;
            iframe.style.height = "auto";
            iframe.parentElement.display = "flex";
            iframe.parentElement.justifyContent = "space-arround";
            return doc.body.innerHTML;
        }
        
        return embedCode; // Return the original embed code if no iframe is found
    };
    const videoEmbedCode = courseData.video ? adjustVideoWidth(courseData.video, '100%') : '';

    return (
        <div className="carousel-item" id="coursePreviewPage">
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="card p-4 shadow-lg course-card" style={{ width: '100%', maxWidth: '800px' }}>
                    <h3 className="text-center mb-4">Course Preview</h3>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <h5>Course Details</h5>
                            <p><strong>Course Title:</strong> {courseData.title}</p>
                            <p><strong>Description:</strong> {courseData.description}</p>
                            <p><strong>Category:</strong> {courseData.category}</p>
                            <p><strong>Environment:</strong> {courseData.environment}</p>
                            <p><strong>Privacy:</strong> {courseData.privacy}</p>
                            <p><strong>Video:</strong> </p>
                            {courseData.video && (
                                <div
                                    className="video-responsive"
                                    dangerouslySetInnerHTML={{ __html: videoEmbedCode }}
                                    style={{width:"50% !important"}}
                                ></div>
                            )}
                        </div>
                        <div className="col-md-6 mb-3">
                            <h5>File Uploads</h5>
                            {courseData && courseData.additionalAssets && courseData.additionalAssets.length > 0 ? (
                                <ul className='mt-3' style={{listStyle:"none"}}>
                                    {courseData.additionalAssets.map((file, index) => (
                                        <li key={index}>
                                            <p><strong>Type:</strong> {file.type}</p>
                                            <p><strong>Name:</strong> {file.name}</p>
                                            <p><strong>File:</strong> {file.file.name}</p>
                                            <p><strong>Size:</strong> {Math.round(file.file.size / 1024 )} K bytes</p>
                                            <hr></hr>
                                        </li>
                                        
                                    ))}
                                </ul>
                            ) : (
                                <p>No files uploaded.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePreviewPage;
