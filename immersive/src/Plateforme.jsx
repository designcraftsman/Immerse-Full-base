import { Routes, Route } from 'react-router-dom';
import Navbar from './components/plateforme/Navbar';
import Footer from './components/plateforme/Footer';
import Home from './pages/plateforme/Home';
import CourseList from './pages/plateforme/CourseList';
import SearchResult from './pages/plateforme/SearchResult';
import SingleCourse from './pages/plateforme/SingleCourse';
import Contact from './pages/plateforme/Contact';
import About from './pages/plateforme/About';
import Terms from './pages/plateforme/Terms';
import Privacy from './pages/plateforme/Privacy';

function Plateforme() {
  window.addEventListener('scroll', reveal);
  function reveal(){
      var reveals = document.querySelectorAll('.reveal');

      for(var i=0; i < reveals.length; i++){
        
        var windowheight = window.innerHeight;
        var revealtop = reveals[i].getBoundingClientRect().top;
        var revealpoint = 80;

        if(revealtop < windowheight - revealpoint){
          reveals[i].classList.add('active');
        }else{
          reveals[i].classList.remove('active');
        }
      }
  }
  return (
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses/:categorie" element={<CourseList />} />
          <Route path="/courses/search/:query" element={<SearchResult />} />
          <Route path="/course/:idCourse" element={<SingleCourse />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
        <Footer />
      </div>
  );
}

export default Plateforme;
