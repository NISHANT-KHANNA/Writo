
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link ,useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaBook, FaChartLine, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';            // for notification css

const StudentSidebar = () => {
  const [course, setCourse] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [tests,setTests] = useState([]);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    toast.success("You have been logged out" ,{theme: "dark"});
    // alert("You have been logged out");
    setTimeout(() => {
              navigate(`/`);
    }, 1000); 
    // navigate('/');
  };
  const handleTestClick = async (testId) => {
    try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const { userId, username, course } = userData; // Extract user data
        console.log(userId);

        const response = await axios.post("http://localhost:5000/startTest2", {
            userId, username, course, testId
        });

        if (response.status === 200) {
            toast.success(response.data.message ,{theme: "dark"});
            // alert(response.data.message);
            setTimeout(() => {
              // navigate(`/`);
               navigate('/instruction', { state: { course, testId } });
            }, 2000); 
           
        }
    } catch (error) {
        toast.error(error.response ? error.response.data : 'Attempted Before', { theme: "dark" });
        // alert(error.response ? error.response.data : 'Attempted Before');
    }
};

  useEffect(() => {
    // Fetch course and username from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setCourse(userData.course || '');
      setUsername(userData.username || ''); // Set the username if available
      setAvatar(userData.avatar || ''); // Set the username if available
      
      const fetchTests = async()=>{
        try{
          const response = await axios.post("http://localhost:5000/getTestsAndSubjects",{course:userData.course});
          setTests(response.data.tests);
        }
        catch(error){
          console.log("error fetching tests");
        }
      };
      fetchTests();
    }
  }, []);

  return (
    <div style={{ backgroundColor: '#fff', width: '250px', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* WRITO EDUCATION ICON AND USERNAME */}
      <div style={{ padding: '20px 10px 20px 20px', display: 'flex', gap: '10px'}}>
        
       <img src={avatar} alt="Avatar" style={{ width: '100px'}} />
       <p style={{boxSizing :'border-box', paddingTop: '10px', overflow :'hidden', fontSize: '20px', fontWeight:'bold'}}>{username.toUpperCase()}</p> {/* Display the username here */}
      </div>

      {/* SIDEBAR MENU */}
      <Sidebar style={{overflowY: 'auto',height : '450px'}}>
        <Menu
          menuItemStyles={{
            button: {
              boxSizing: 'border-box',
              backgroundColor: 'transparent',
              color: '#666666',
              borderRadius: '10px',
              margin: '8px 9px',
              padding: '10px',
              textAlign: 'left',
              transition: 'background-color 0.3s ease',
              [`&:hover`]: {
                backgroundColor: '#0066ff',
                color: '#fff',
              },
              [`&.active`]: {
                backgroundColor: 'red',
                color: '#b6c8d9',
              },
            },
            label: {
              paddingLeft: '15px',
            },
            subMenuContent: {
              paddingLeft: '30px',
              textAlign: 'center',
            },
          }}
        >
          <MenuItem component={<Link to="/dashboard" />} icon={<FaTachometerAlt />}>
            Dashboard
          </MenuItem>
          <MenuItem component={<Link to="/profile" />} icon={<FaUser />}>
            Profile
          </MenuItem>

          <SubMenu label="Tests" icon={<FaChartLine />}>
            {tests.map((test,index)=>(
              
              <MenuItem key={index} 
                        onClick={() => handleTestClick(test.test)} // Pass the test ID dynamically
                        icon={<FaChartBar />}>
                Test {index+1}
              </MenuItem> 

              ))}
          </SubMenu>

          <MenuItem component={<Link to="/result" />} icon={<FaBook />}>
            Result
          </MenuItem>
        </Menu>
      </Sidebar>

      {/* LOGOUT SECTION */}
      <div style={{ backgroundColor: '#e6e6e6', color: '#666666', position: 'absolute', bottom: '0px', textAlign: 'right', width: '100%', padding: '5px 25px', boxSizing: 'border-box' }}>
        <p style={{ fontSize: '18px' }} onClick={handleLogout}>
          Logout
          <FaSignOutAlt style={{ marginBottom: '-4px', marginLeft: '15px', cursor: 'pointer' }} size={22} />
        </p>
      </div>
       <ToastContainer />
    </div>
  );
};

export default StudentSidebar;