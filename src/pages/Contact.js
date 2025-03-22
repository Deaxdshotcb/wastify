import React from 'react'
import './Contact.css'
import img2 from "./images/ph.jpg"
export const Contact = () => {
  return (
    <div className='contact-container'>
      <img src={img2}  alt="nature" />
      <div className='text'>
        <p>For any information, queries or doubts, you can contact or mail us below:</p>
        <h1>PHONE</h1>
        <p>91+ 6969696969</p>
        <h1>MAIL ID</h1>
        <p>wastify@gmail.com</p> 
        <h1>ADDRESS</h1>
        <p>123 Main St, City, State, Zip</p>
      </div>
    </div>
  )
}
