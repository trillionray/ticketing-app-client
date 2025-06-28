import { useEffect, useContext  } from 'react';
import { Navigate } from 'react-router-dom';

import UserContext from '../context/UserContext';

export default function Logout() {

    console.log("test");

    // Consume the UserContext object and destructure it to access the user state and unsetUser function from the context provider
    const { setUser, unsetUser } = useContext(UserContext);

    // Clear the localStorage of the user's information
    // localStorage.clear();
    unsetUser();

    // Placing the "setUser" function inside of a useEffect is necessary because a state of another component cannot be updated while trying to render a different component
    // By adding the useEffect, this will allow the Logout page to render first before triggering the useEffect which changes the state of our user 
    useEffect(() => {
        // Set the user state back to it's initial value
        setUser({
            id: null,
            isAdmin: null
        });
    }, [])

    // Redirect back to login
    return (
        <Navigate to='/login' />
    )

}