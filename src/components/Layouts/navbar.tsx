import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowRight, faArrowCircleRight, faScrewdriver, faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const HamburgerIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12H21M3 6H21H3ZM3 18H21H3Z" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface User {
    googleID: string;
    firstName: string;
    lastName: string;
    email: string;
}

const Navbar: React.FC = () => {
    const navigate = useNavigate();



    //   const currentPage = usePathname();
    const [active, setActive] = useState('Home');
    const [toggle, setToggle] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);

    const getAuthenticatedUserData = () => {
        const user = localStorage.getItem('user');
        const userData = JSON.parse(user);

        setUserData(userData);
    };
    const logout = async () => {
        try {
            const accessToken = localStorage.getItem('token');
            const token = `Bearer ${accessToken}`;

            // Set the token in the Authorization header of axios
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post(`http://localhost:5175/auth/logout`);
            localStorage.removeItem('user');
            localStorage.clear();
            setUserData(null);
            navigate(`/login`);
        } catch (error) {
            navigate('/error')
            // console.error('Error', error); // Handle error later with card
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5175/auth/google';
    };

    useEffect(() => {
        getAuthenticatedUserData();

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`w-full flex py-8 md:py-4 justify-between md:gap-[4rem] items-center navbar px-12  bg-[#76ff03] ${isScrolled ? 'sticky top-0 bg-[#76ff03] shadow-md' : ''} z-20`}>
            <div className="flex md:w-[33%]">
                <button onClick={() => setToggle(!toggle)} className="focus:outline-none hidden sm:block md:ml-[10rem]">
                    {toggle ? <CloseIcon /> : <HamburgerIcon />}
                </button>
            </div>

            <div
                onClick={() => {
                    if (userData) {
                        navigate('/home');
                    } else {
                        navigate('/login');
                    }
                }}
                className="list-none sm:flex gap-4  hidden justify-between items-center w-[33%] md:w-[%] cursor-pointer "
            >
                <div className="flex justify-center gap-4  w-[100%]">
                    <FontAwesomeIcon icon={faBook} style={{ fontSize: 40, color: 'black' }} />
                    <div className="brand-logo text-3xl center">miniStories</div>
                </div>
            </div>

            {/* Desktop NavAuthButtons */}
            <div className="float-right md:w-[33%]">
                <div className="list-none sm:flex hidden justify-center gap-4 md:ml-12 float items-center ">
                    {userData?.googleID ? (
                        <div className="flex gap-4 ">
                            <div className='flex gap-2 cursor-pointer hover:bg-[#b1db5f] h-[2.5rem] items-center px-2 '>
                                <p>  Hi, </p> <p>{userData.lastName}</p>
                            </div>
                            <div onClick={() => logout()} className="flex gap-2 cursor-pointer hover:bg-[#b1db5f] h-[2.5rem] items-center px-2">
                                <FontAwesomeIcon icon={faArrowCircleRight} style={{ fontSize: 20, color: 'black' }} />
                                <p >Logout</p>
                            </div>
                        </div>
                    ) : (
                        <div
                        onClick={() => {
                            navigate('/stories');
                            // setToggle(!toggle);
                        }}
                        className="flex justify-between gap-1">
                            <FontAwesomeIcon icon={faBook} style={{ fontSize: 20, color: 'black' }} />
                            <button className="text-black border-brand-primary" type="submit">
                                Public Stories
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex flex-1 justify-start items-center">
                <button onClick={() => setToggle(!toggle)} className="focus:outline-none sm:hidden ">
                    {toggle ? <CloseIcon /> : <HamburgerIcon />}
                </button>

                {toggle && (
                    <div
                        onClick={() => {
                            setToggle(!toggle);
                        }}
                        className="fixed inset-0 transition-opacity w-[100%]"
                        aria-hidden="true"
                    >
                        <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
                    </div>
                )}

                {/* Mobile Menu */}
                {toggle && (
                    <div className="bg-white z-10 fixed top-0 left-0 my-0  sidebar" style={{ height: 'calc(100vh)', width: '19rem', transition: 'width 0.3s ease' }}>
                        {userData?.googleID ? (
                            <div className="flex flex-col justify-center my-2">
                                <div className="flex justify-center items-center my-2 h-[3rem] hover:bg-[#76ff03] hover:w-[100%]">
                                    <div className="flex gap-[3.5rem]">
                                        {/* <div className="rounded-full bg-[#00C29D] p-2 flex items-center justify-center"> */}
                                        <FontAwesomeIcon icon={faBook} style={{ fontSize: 20, color: 'black' }} />
                                        {/* </div> */}

                                        <button
                                            onClick={() => {
                                                navigate('/stories');
                                                setToggle(!toggle);
                                            }}
                                            className="text-black border-brand-primary font-bold"
                                            type="submit"
                                        >
                                            Public Stories
                                        </button>
                                    </div>
                                </div>
                                <hr className="h-px my-2 bg-gray-400 border-0"></hr>
                                <div
                                    onClick={() => {
                                        const accessToken = localStorage.getItem('token');
                                        const token = `Bearer ${accessToken}`;
                                        navigate(`/dashboard/?token=${accessToken}`);
                                        setToggle(!toggle);
                                    }}
                                    className="flex justify-center items-center my-2 h-[3rem] w-[17.5rem] hover:bg-[#76ff03] hover:w-[100%]"
                                >
                                    <div className="flex gap-[3.5rem]">
                                        {/* <div className="rounded-full bg-[#00C29D] p-2 flex items-center justify-center"> */}
                                        <FontAwesomeIcon icon={faCog} style={{ fontSize: 20, color: 'black' }} />
                                        {/* </div> */}

                                        <button className="text-black border-brand-primary font-bold" type="submit">
                                            Dashboard
                                        </button>
                                    </div>
                                </div>
                                <div
                                    onClick={() => {
                                        navigate(`/stories/my/${userData.googleID}`);
                                        setToggle(!toggle);
                                    }}
                                    className="flex justify-center items-center my-3 h-[3rem] w-[17.5rem] hover:bg-[#76ff03] hover:w-[100%]"
                                >
                                    <div className="flex gap-[3.5rem]">
                                        {/* <div className="rounded-full bg-[#00C29D] p-2 flex items-center justify-center"> */}
                                        <FontAwesomeIcon icon={faUser} style={{ fontSize: 20, color: 'black' }} />
                                        {/* </div> */}

                                        <button className="text-black border-brand-primary font-bold" type="submit">
                                            My Stories
                                        </button>
                                    </div>
                                </div>
                                <div
                                    onClick={() => {
                                        logout();
                                        setToggle(!toggle);
                                    }}
                                    className="flex justify-center items-center my-3 h-[3rem] w-[16rem] hover:bg-[#76ff03] hover:w-[100%]"
                                >
                                    <div className="flex gap-[3.5rem]">

                                        <FontAwesomeIcon icon={faArrowCircleRight} style={{ fontSize: 20, color: 'black' }} />


                                        <button className="text-black border-brand-primary font-bold" type="submit">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center my-4">
                                <div className="flex justify-center items-center my-2 hover:bg-[#cffab6]">
                                    {/* <p>Hi world</p> */}
                                    <button className="flex justify-center gap-3 w-[17rem] shadow-6xl rounded bg-[#76ff03] py-2" onClick={handleGoogleLogin}>
                                        <div className="flex justify-center items-center pt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" width="14" height="14">
                                                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm flex justify-center font-bold items-center">LOGIN WITH GOOGLE</p>
                                    </button>
                                </div>

                                <div
                                    onClick={() => {
                                        navigate('/stories');
                                        setToggle(!toggle);
                                    }}
                                    className="flex justify-center items-center my-2 h-[3rem] hover:bg-[#76ff03]"
                                >
                                    <div className="flex gap-[3.5rem]">
                                        {/* <div className="rounded-full bg-[#00C29D] p-2 flex items-center justify-center"> */}
                                        <FontAwesomeIcon icon={faBook} style={{ fontSize: 20, color: 'black' }} />
                                        {/* </div> */}

                                        <button className="text-black border-brand-primary" type="submit">
                                            Public Stories
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
