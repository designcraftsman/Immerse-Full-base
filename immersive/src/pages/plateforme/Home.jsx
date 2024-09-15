import React from 'react';
import {Link} from 'react-router-dom';
import poepleLearning from '../../assets/plateforme/images/peopleLearning.webp';

import CreativeLearning from "../../components/plateforme/CreativeLearning";
import CourseList from "../../components/plateforme/CourseList";
import Carousel from "../../components/plateforme/Carousel.jsx";
import FAQComponent from '../../components/plateforme/FAQComponent.jsx';
import Opinions from "../../components/plateforme/Opinions.jsx";
import VR from "../../assets/plateforme/VR2.jpg";
import VRLab from "../../assets/plateforme/VR_lab.jpg";
import Headset from "../../assets/plateforme/images/headset.avif";
import splineModel from "../../assets/plateforme/images/splineModel.jpg";


function Home() {
    return (
        <React.Fragment>
            {/* Hero Section */}
            <div className="hero bg-black">
                <div className="row">
                    <div className="col-12 col-md-5">
                        <div className="hero-content "  style={{width:"100%",objectFit:"cover", marginTop:"20%"}}>
                            <h1>Transform Your Learning Experience with 3D Education</h1>
                            <p>Explore immersive 3D courses designed to take your skills to the next level.</p>
                            <a href="./my-space/sign-up" className="btn btn-primary btn-lg fw-bolder text-white">Start Learning Now!</a>
                        </div>
                    </div>
                    <div className="col-12 col-md-7">
                        <img src={splineModel} className='hero-spline' style={{width:"100%",objectFit:"cover"}} alt="3D model" />
                    </div>
                <div>
            </div>
            </div>
            </div>


            <CreativeLearning />
            <div className='bg-black'><CourseList /></div>
            
            <div className='bg-black'><Carousel /></div>

            <div className="bg-black">
                <img src={VR} style={{width:"100%", maxHeight:"300px", objectFit:"cover"}} alt="" />
            </div>

            <div className='bg-black' id='faq'><FAQComponent /></div>

            <div className='bg-black'><Opinions /></div>

            <div className="bg-black ">
                <div className='groupes '>
                    <div >
                        <div className="pour-groupes reveal" >
                            <h1>Immerse pour les groupes</h1>
                            <p>Propulsez votre équipe vers de nouveaux sommets avec un apprentissage immersif, conçu pour stimuler le développement personnel et professionnel de chacun.</p>
                            <p>Avec une variété de cours captivants sur les compétences interpersonnelles, les fondamentaux du business, le bien-être, et bien plus encore, Immerse offre à votre équipe un accès direct à une expertise approfondie et des connaissances enrichissantes. </p>
                            <a href="#" className='learn-more'>Learn more                            </a>
                        </div>
                        <div ><img className='reveal' src={poepleLearning} alt="perople Learning" /></div>
                    </div>
                </div>
            </div>
            <div className="bg-black ">
                <div className='groupes lab'>
                    <div >
                        <div ><img className='reveal' src={VRLab} alt="perople Learning" /></div>
                        <div className="pour-groupes reveal ps-5" >
                            <h1>Immerse pour les groupes</h1>
                            <p>Propulsez votre équipe vers de nouveaux sommets avec un apprentissage immersif, conçu pour stimuler le développement personnel et professionnel de chacun.</p>
                            <p>Avec une variété de cours captivants sur les compétences interpersonnelles, les fondamentaux du business, le bien-être, et bien plus encore, Immerse offre à votre équipe un accès direct à une expertise approfondie et des connaissances enrichissantes. </p>
                            <a href="#" className='learn-more'>Learn more                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Home;
