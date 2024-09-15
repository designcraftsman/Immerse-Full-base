import React  from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';
import'./css/plateforme.css';
import Plateforme from './Plateforme.jsx';
import LMS from './Lms.jsx';
import ImmersiveSpace from './ImmersiveSpace.jsx';

import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from 'react-router-dom';

// Import your immersive space component
import LabEditor  from './pages/ImmersiveSpace/LabEditor';
import LabCourse from './pages/ImmersiveSpace/LabCourse';
import SchoolEditor from './pages/ImmersiveSpace/SchoolEditor';
import SchoolCourse from './pages/ImmersiveSpace/SchoolCourse';
import LabSession from './pages/ImmersiveSpace/LabSession';
import SchoolSession from './pages/ImmersiveSpace/SchoolSession';
// Import your plateforme components
import Home from './pages/plateforme/Home.jsx';
import CourseList from './pages/plateforme/CourseList';
import Contact from './pages/plateforme/Contact';
import SearchResult from './pages/plateforme/SearchResult';
import SingleCourse from './pages/plateforme/SingleCourse';
import About from './pages/plateforme/About';
import Terms from './pages/plateforme/Terms';
import Privacy from './pages/plateforme/Privacy';


// Import your lms components
import Dashboard from './pages/lms/Dashboard.jsx';
import Courses from './pages/lms/Courses.jsx';
import Groups from './pages/lms/Groups.jsx';
import Students from './pages/lms/Students.jsx';
import Assets from './pages/lms/Assets.jsx';
import Profile from './pages/lms/Profile.jsx';
import Settings from './pages/lms/Settings.jsx';
import SignUp from './pages/lms/SignUp.jsx';
import SignIn from './pages/lms/SignIn.jsx';
import GroupChat from './pages/lms/GroupChat.jsx';
import Notifications from './pages/lms/Notifications.jsx';
import MakeCourse from './pages/lms/MakeCourse.jsx';
import Help from "./pages/lms/Help.jsx";
import CreateGroup from "./pages/lms/CreateGroup.jsx";
import Test from "./pages/lms/Test.jsx";
import MakeQuiz from "./pages/lms/MakeQuiz.jsx";
import Quiz from "./pages/lms/Quiz.jsx";
import Rate from "./pages/lms/Rate.jsx";
import EditCourse from "./pages/lms/EditCourse.jsx";
import ViewCourse from "./pages/lms/ViewCourse.jsx";
import  Sessions from "./pages/lms/Sessions.jsx";
import CreateSession from './pages/lms/CreateSession.jsx';

const LmsWrapper = () => {
  const location = useLocation();
  return <LMS currentLink={location.pathname} />;
};

const PlateformeWrapper = () => {
  const location = useLocation();
  return <Plateforme currentLink={location.pathname} />;
};

const ImmersiveSpaceWrapper = () => {
  const location = useLocation();
  return <ImmersiveSpace currentLink={location.pathname} />;
};

const router = createBrowserRouter([
  {
    path: '/my-space/',
    element: <LmsWrapper />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'courses',
        element: <Courses />,
      },
      {
        path: 'sessions',
        element: <Sessions />,
      },
      {
        path: 'create-session',
        element: <CreateSession />,
      },
      {
        path: 'groups',
        element: <Groups />,
      },
      {
        path: 'group-chat/:groupId/:groupName/:username/:chatId',
        element: <GroupChat />,
      },
      {
        path: 'students',
        element: <Students />,
      },
      {
        path: 'assets',
        element: <Assets />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'make-course',
        element: <MakeCourse />,
      },
      {
        path: 'sign-up',
        element: <SignUp />,
      },
      {
        path: 'sign-in',
        element: <SignIn />,
      },
      {
        path: 'help',
        element: <Help />,
      },
      {
        path: 'create-group',
        element: <CreateGroup />,
      },
      {
        path: 'test',
        element: <Test />,
      },
      {
        path: 'make-quiz/:idCourse',
        element: <MakeQuiz />,
      },
      {
        path: 'quiz',
        element: <Quiz />,
      },
      {
        path: 'rate/:courseId', // Only base path, without query parameters
        element: <Rate />,
      },
      {
        path: 'rate', // Only base path, without query parameters
        element: <Rate />,
      },
      {
        path: 'edit-course/:courseId', // same in here
        element: <EditCourse />,
      },
      {
        path: 'view-course/:courseId', // same in here
        element: <ViewCourse />,
      },
    ],
  },
  {
    path: '/immersive-space/',
    element: <ImmersiveSpaceWrapper />,
    children: [
      {
        path: 'labEditor/:idCourse',
        element: <LabEditor />,
      },{
        path: 'labCourse/:idCourse',
        element: <LabCourse />,
      },{
        path: 'schoolEditor/:idCourse',
        element: <SchoolEditor />,
      },{
        path: 'schoolCourse/:idCourse',
        element: <SchoolEditor />,
      },{
        path: 'labSession/:sessionName/:idCourse/:username',
        element: <LabSession />,
      },{
        path: 'schoolSession/:sessionName/:idCourse/:username',
        element: <schoolSession />,
      },
    ],
  }
  ,{
    path: '/',
    element: <PlateformeWrapper />,
    children: [
      {
        path: 'home', // same in here
        element: <Home />,
      },
      {
        path: '/courses/:categorie', // same in here
        element: <CourseList />,
      },
      {
        path: 'contact', // same in here
        element: <Contact />,
      },
      {
        path: 'about', // same in here
        element: <About />,
      },
      {
        path: 'privacy', // same in here
        element: <Privacy />,
      },
      {
        path: 'terms', // same in here
        element: <Terms />,
      },
      {
        path: '/courses/search/:query', // same in here
        element: <SearchResult />,
      },
      {
        path: '/course/:idCourse', // same in here
        element: <SingleCourse />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
