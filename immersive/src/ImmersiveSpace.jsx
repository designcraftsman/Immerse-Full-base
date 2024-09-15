import './css/ImmersiveSpace.css';
import 'aframe';
import 'aframe-environment-component';
import 'aframe-extras';
import 'aframe-event-set-component';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LabEditor  from './pages/ImmersiveSpace/LabEditor';
import LabCourse from './pages/ImmersiveSpace/LabCourse';
import SchoolEditor from './pages/ImmersiveSpace/SchoolEditor';
import SchoolCourse from './pages/ImmersiveSpace/SchoolCourse';
import LabSession from './pages/ImmersiveSpace/LabSession';
import SchoolSession from './pages/ImmersiveSpace/SchoolSession';
import './components/ImmersiveSpace/CustomLookControls';


function ImmersiveSpace() {
  return (
      <Routes>
        <Route path="/schoolSession/:sessionName/:idCourse/:username" element={<SchoolSession />} />
        <Route path="/labSession/:sessionName/:idCourse/:username" element={<LabSession />} />
        <Route path="/schoolEditor/:idCourse" element={<SchoolEditor />} />
        <Route path="/labEditor/:idCourse" element={<LabEditor />} />
        <Route path="/labCourse/:idCourse" element={<LabCourse />}/>
        <Route path="/schoolCourse/:id" element={<SchoolCourse />}/>
      </Routes>
  );
}

export default ImmersiveSpace;
