import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Expression from './components/expression.jsx';
import UserProfile from './components/UserProfile.jsx';
import CourseCard from './components/CourseCard.jsx';
import Header from './components/Header.jsx';
function App() {
  const [title, settitle] = useState("Introduction to React");
  const [instructor, setInstructor] = useState("srey nich");
  const [duration, setDuration] = useState("4 weeks");

  // const informationcourse =() => {
  //   settitle("Advanced React Concepts");
  //   setInstructor("Jane Smith");
  //   setDuration("6 weeks");
  // };
  return (
    <>
      <Header/>
       <div className="flex gap-6 justify-center mt-10 flex-wrap">
        <CourseCard title="HTML & CSS" instructor={instructor} duration="15 Week" />
        <CourseCard title="Spring Boot" instructor={instructor} duration="30 week" />
        <CourseCard title="JavaScript" instructor={instructor} duration="30 hour" />
      </div>

      <Expression />
      <UserProfile/>
    </>
  )
}

export default App
// state and data