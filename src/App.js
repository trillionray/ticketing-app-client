import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import { UserProvider } from './context/UserContext';
import AppNavbar from './components/AppNavbar';

// import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';

import AddTicket from './pages/AddTicket';
import Tickets from './pages/Tickets';

function App() {

  // State hook for the user state is defined here to allow it to have a global scope
  // This can be achieved using prop drilling or via react context
  // This will be used to store the user information and will be used for validating if a user is logged in on the app or not
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  // Function for clearing localStorage on logout
  function unsetUser(){
    localStorage.clear();
  };

  useEffect(() => {
    fetch(`http://localhost:4000/users/details`, {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('token') }`
      }
    })
    .then(res => res.json())
    .then(data => {

      // Set the user states values with the user details upon successful login.
      if (typeof data !== "undefined") {

        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        });

      // Else set the user states to the initial values
      } else {

        setUser({
          id: null,
          isAdmin: null
        });

      }

    })
  }, [])

  // Used to check if the user information is properly stored upon login and the localStorage information is cleared upon logout
  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user])

  return (
    <>
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
          <AppNavbar />
          <Container>
            <Routes>
              {/*<Route path="/" element={<Ticket />} />*/}
              
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/addTicket" element={<AddTicket />} />
            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </>
  )
}

export default App