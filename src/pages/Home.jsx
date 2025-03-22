import React from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";
import img from './images/home2.jpg';


export const Home = () => {
  return (
    <div className='home-container'>
      <img src={img}  alt="nature" />
      <div className='text'>
        <h1>We create a Sustainable Nature</h1>
        <p>The future of our planet depends on how we manage waste today. Recycling helps reduce pollution, conserves natural resources, and supports a cleaner environment. Join us in making a difference—one recycled item at a time. By sorting waste properly, reducing plastic use, and adopting sustainable habits, we can work towards a zero-waste future. Every small effort counts!</p>
        <h3>Click below to start your journey towards a greener world!</h3>
        <button><Link to="/login" className='login-button'>Login/SignUp</Link></button>
      </div>
      
    </div>
  )
}
