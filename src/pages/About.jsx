import React from 'react'
import "./About.css"
import img1 from './images/qn.jpg'
export const About = () => {
  return (
    <div className='about-container'>
      <img src={img1}  alt="question mark" />
      <div className='text'>
        <h1>About Us </h1>
        <p>♻️Welcome to Wastify, your smart waste management solution!
          At Wastify, we believe in a cleaner and greener environment by making waste collection efficient and hassle-free. Our platform allows users to request waste pickup whenever their bins are full, ensuring a hygienic and sustainable living space.
        </p>
        <h1>Our Mission</h1>
        <p> 🚛 Easy Waste Collection – No more waiting for fixed schedules. Just request, and we’ll handle the rest!
        </p>
        <p>🌱 Sustainable Future – We aim to reduce waste accumulation and promote proper disposal practices.
        </p>
        <p>💡 Smart & User-Friendly – A simple and intuitive system designed to make waste management effortless.</p>
        <h3>Join us in building a cleaner and smarter tomorrow with Wastify! 🌍✨</h3>
      </div>
      
    </div>
  )
}
