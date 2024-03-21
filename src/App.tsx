import { PropsWithChildren, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layouts/navbar';
import Footer from './components/Layouts/footer';
import Login from './pages/Login';
import About from "./pages/About"; 
import Dashboard from './pages/Dashboard';
import EditStory from './pages/EditStory';
import Home from './pages/Home';
import AddStory from './pages/AddStory';
import MyStory from './pages/MyStory';
import Stories from './pages/Stories';
import Story from './pages/Story';
import UserStory from './pages/UserStory';
import ErrorPage from "./pages/Error";

interface User {
    googleID: string;
    firstName: string;
    lastName: string;
    email: string;
}

function App({ children }: PropsWithChildren<{}>): JSX.Element {
    const [user, setUser] = useState<User | null>(null);

    const checkAuthenticatedUser = (): void => {
        const userString = localStorage.getItem('user');

        if (userString) {
            const userData: User = JSON.parse(userString);
            setUser(userData);
        }
    };

    // Check if the user is authenticated on component mount
    useEffect(() => {
        checkAuthenticatedUser();
    }, []);

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={user?.googleID ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={< About/>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/home" element={<Home />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/stories/show/:id" element={<Story />} />
                <Route path="/stories/add" element={ <AddStory /> } />
                <Route path="/stories/my/:id" element={ user?.googleID ? <MyStory /> : <Navigate to="/login" /> } />
                <Route path="/stories/edit/:id" element={user?.googleID ? <EditStory /> : <Navigate to="/login" /> } />
                <Route path="/stories/user/:id" element={user?.googleID ? <UserStory /> : <Navigate to="/login" /> } />
                <Route path="/error" element={<ErrorPage />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
