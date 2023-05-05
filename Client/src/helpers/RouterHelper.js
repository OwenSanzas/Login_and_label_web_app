import { BrowserRouter, Routes, Route} from "react-router-dom";

import Login from '../pages/LoginPage/Login';
import UserPage from '../pages/UserPage/UserPage'


const RouterHelper = () => {
    return (
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/user" element={<UserPage/>}/>
        </Routes>
      </BrowserRouter>
    );
}


export default RouterHelper;