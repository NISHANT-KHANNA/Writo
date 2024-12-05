import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { Sidebar, Menu, MenuItem, SubMenu,menuClasses } from 'react-pro-sidebar';
import { Link ,useNavigate } from 'react-router-dom';
import { FaUserCircle , FaTachometerAlt, FaUser, FaBook, FaChartLine, FaChartBar, FaSignOutAlt } from 'react-icons/fa'; // Import icons
import adminPic from './adminPic.png';
import { ToastContainer, toast } from 'react-toastify';    // for notification
import 'react-toastify/dist/ReactToastify.css';  

const AdminSidebar = () => { 
   
  const [courses,setCourses] = useState([]);
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("You have been logged out" ,{theme: "dark"});
    setTimeout(() => {
              navigate(`/`);
    }, 1000); 
  };

  useEffect(() => {

    const adminData = JSON.parse(localStorage.getItem('admin'));
    if (adminData) {
      setAdminName(adminData.adminName || ''); // Set the username if available
    // Fetch courses from the coursa data
    const fetchCourses = async()=>{
        try{
          const response = await axios.get("http://localhost:5000/getCoursesName");
          setCourses(response.data);
        }
        catch(error){
          console.log("error fetching tests");
        }
      };
      fetchCourses();
    }
  }, []);


  return (
    <div  style={{ backgroundColor:'#fff',width:'250px',height :'100vh',display:'flex',flexDirection :'column',position : 'relative' }}>
      {/* WRITO EDUCATION ICON */}
      <div style={{ padding: '20px 10px 20px 20px',display :'flex',gap:'10px' }}>
        {/*<FaUserCircle size={70} />*/}
        <img src={adminPic} alt="admin" style={{ width:'70px', height : 'auto'}} />
        <p style={{boxSizing :'border-box', paddingTop: '10px', overflow :'hidden', fontWeight:'bold'}}> {adminName.toUpperCase()}</p>
      </div>

      {/* SIDEBAR MENU */}
      <Sidebar style={{overflowY: 'auto',height : '500px'}}>
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
              paddingLeft: '15px', // Optional padding for alignment
            },
            subMenuContent: {
              paddingLeft: '30px', // Sub-menu items are further indented
              textAlign: 'center', // Center-align text for sub-menu items
            },
          }}
          
        >
          <MenuItem  
           
          rootStyles={{
            ['.' + menuClasses.button]: {
              backgroundColor: 'red',
              color: '#9f0099',
              '&:hover': {
                backgroundColor: '#eecef9',
              },
            },
          }}
          active
           component={<Link to="/admin/dashboard" />} icon={<FaTachometerAlt />}>
            Dashboard
          </MenuItem>
          {/*<MenuItem component={<Link to="/admin/questions" />} icon={<FaUser />}>
            Questions
          </MenuItem>
*/}
          
          <SubMenu label="Manage Courses" icon={<FaChartLine />}>
            <MenuItem component={<Link to="/addCourse" />} icon={<FaChartBar />}>
              Add Course
            </MenuItem>
            <MenuItem component={<Link to="/courseList" />} icon={<FaChartBar />}>
              Update Course
            </MenuItem>
          </SubMenu>

         <SubMenu label="Manage Subjects" icon={<FaChartLine />}>
            <MenuItem component={<Link to="/addSubject" />} icon={<FaChartBar />}>
              Add Subject
            </MenuItem>
            <MenuItem component={<Link to="/subjectList" />} icon={<FaChartBar />}>
              Update Subject
            </MenuItem>
          </SubMenu>

         <SubMenu label="Manage Test" icon={<FaChartLine />}>
            <MenuItem component={<Link to="/addTest" />} icon={<FaChartBar />}>
              Add Test
            </MenuItem>
            <MenuItem component={<Link to="/examList" />} icon={<FaChartBar />}>
              Update Test
            </MenuItem>
          </SubMenu>
         
         <SubMenu label="Manage Question" icon={<FaChartLine />}>
            <MenuItem component={<Link to="/addQuestion" />} icon={<FaUser />}>
              Add Question
            </MenuItem>
            <MenuItem component={<Link to="/admin/questions" />} icon={<FaUser />}>
              Update Question
            </MenuItem>
          </SubMenu>


          <MenuItem component={<Link to="/admin/students" />} icon={<FaBook />}>
            Students
          </MenuItem>

          <SubMenu label="Scoreboard" icon={<FaChartLine />}>
            {courses.map((course,index)=>(
              
              <MenuItem key={index} component={<Link to={`/admin/scoreboard/${course.course}`} />} icon={<FaChartBar />}>
                {course.course}
              </MenuItem>

              ))}

          </SubMenu>
        </Menu>
      </Sidebar>

      {/* LOGOUT SECTION */}
      <div style={{backgroundColor :'#e6e6e6',color:'#666666', position :'absolute',bottom:'0px', textAlign: 'right',width : '100%',padding : '5px 25px',boxSizing : 'border-box' }}>
        <p style={{fontSize :'18px' }} onClick={handleLogout}>
          Logout
          <FaSignOutAlt style={{marginBottom:'-4px', marginLeft: '15px',cursor:'pointer' }} size={22} />
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminSidebar;





