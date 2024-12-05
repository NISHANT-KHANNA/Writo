import React, { useState, useEffect } from 'react';
import axios from "axios";
import { AvatarGenerator } from 'random-avatar-generator';
import './StudentProfile.css'; 
import { MdOutlineRefresh } from "react-icons/md";
import profileBg from './profileBg.png';

const AdminProfile = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profile, setProfile] = useState(null);
  const [isMobileAdded,setIsMobileAdded] = useState(false);
  const [mobile,setMobile] = useState("");
  const generator = new AvatarGenerator();

  // Generate a new avatar and update the state with its URL
  const generate = () => {
    const newAvatar = generator.generateRandomAvatar();
    setAvatarUrl(newAvatar);
    const userData = JSON.parse(localStorage.getItem('user'));
    userData.avatar = newAvatar;
    localStorage.setItem('user', JSON.stringify(userData));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.userId;

        if (userId) {
          // const avatar = generator.generateRandomAvatar();
          setAvatarUrl(userData?.avatar);

          const response = await axios.post('http://localhost:5000/profile', { userId });
          setProfile(response.data); // Set profile state
          if(response.data.mobile){
          	setMobile(response.data.mobile);
          	setIsMobileAdded(true);
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array so it only runs once on component mount
  
  const handleAddMobile = async(e)=>{
  	e.preventDefault();
  	try{
  		const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.userId;

        if(userId && mobile){
        	const response = await axios.post('http://localhost:5000/addMobile', { userId,mobile });
        	setProfile(response.data.user);
          	setIsMobileAdded(true);
          	alert(response.data.message);
        }
  	}
  	catch(error){
  		console.error('Error updating mobile number:', error);
  	}
  };
  // Add a conditional rendering to prevent errors before profile is loaded
  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
  <div className="outer-container" style={{ backgroundImage: `url(${profileBg})` }}>
    <div className="profile-container">
      <div className="profile-header">
        <img src={avatarUrl} alt="Avatar" className="avatar" />
        {/*<button onClick={generate}>Change Avatar</button>*/}
        <MdOutlineRefresh className="refresh-icon" onClick={generate} />
        <h1>{profile.username}</h1>
        <h2>{profile.course} Student</h2>
      </div>

      <div className="profile-info">
       <div className="info-box">
        <h3>Basic Information</h3>
        <div className="individual-info"> 
        {/*<p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Course:</strong> {profile.course}</p>
        <p><strong>Student ID:</strong>XXX{profile._id}</p>*/}
        <div className="field-box">
          <strong>Email:</strong> {profile.email}
        </div>
        <div className="field-box">
          <strong>Course:</strong> {profile.course}
        </div>
        <div className="field-box">
          <strong>Student ID:</strong> XXX{profile._id}
        </div>
        <div className="field-box">
        {!isMobileAdded ?(
        	<>
          <div className="add-mobile-box">
          <h4>Don't hesitate to add the number</h4>
          <form onSubmit ={handleAddMobile}>
             <label>Mobile Number:</label>
             <input
              type="text"
              value={mobile}
              onChange={(e)=>setMobile(e.target.value)}
              placeholder="enter mobile number"
              />
             <button type="submit">Add</button>
          </form>
          </div>
           </>
        	):(
        	 <p><strong>Mobile:</strong>{profile.mobile}</p>
        	)

    }
      </div> 
      </div>  
      </div>
      </div>
      </div>
    </div>
  );
};

export default AdminProfile;
