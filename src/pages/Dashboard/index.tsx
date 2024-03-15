import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import AddStoryButton from '../../components/AddStoryButton';

interface User {
    googleID: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface Story {
    _id: string;
    status: string;
    allowComments: boolean;
    title: string;
    body: string;
    user: User;
    comments: Array<any>;
    date: string;
    v: number;
}

const Dashboard = (props: any) => {
    const navigate = useNavigate();
    const [stories, setStories] = useState<Story[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate;
    };

    const getUserStories = async (id: string) => {
        try {
            const accessToken = localStorage.getItem('token');
            const token = `Bearer ${accessToken}`;

            axios.defaults.headers.common['Authorization'] = token;

            const response = await axios.get(`http://localhost:5175/stories/user/${id}`);

            const formattedStories = response.data.data.map((story: any) => ({
                ...story,
                date: formatDate(story.date),
            }));
            setStories(formattedStories);
        } catch (error) {
            navigate('/error')
            // console.error('Error fetching user stories:', error);
        }
    };

    const deleteUserStory = async (id: string) => {
        try {
            const accessToken = localStorage.getItem('token');
            const token = `Bearer ${accessToken}`;

            axios.defaults.headers.common['Authorization'] = token;

            await axios.delete(`http://localhost:5175/stories/${id}`);
            setStories((prevStories) => prevStories.filter((story) => story._id !== id));
        } catch (err) {
            navigate('/error')
            // console.error('Error deleting user story:', err);
        }
    };

    const editUserStory = (id: any) => {
        navigate(`/stories/edit/${id}`);
    };

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const encodedToken = urlParams.get('token');

        if (encodedToken !== null) {
            const decodedToken = decodeURIComponent(encodedToken);
            const decodedPayload = JSON.parse(atob(decodedToken.split('.')[1]));

            const { googleID, firstName, lastName, email } = decodedPayload;

            const existingUser = JSON.parse(localStorage.getItem('user') || 'null');

            if (googleID && existingUser === null) {
                const user = { googleID, firstName, lastName, email };
                const userString = JSON.stringify(user);
                localStorage.setItem('user', userString);
                localStorage.setItem('token', decodedToken);
                setUser(user);
                getUserStories(user.googleID);
            } else if (existingUser !== null) {
                localStorage.setItem('token', decodedToken);
                setUser(existingUser);
                getUserStories(existingUser.googleID);
            } else if (!googleID || !firstName || !lastName || !email) {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <div className="p-[2rem] sm:px-[12rem] sm:py-10">
            <div>
                <h1 className="text-6xl">
                    Welcome <span className="text-[#7CB342]">{user?.lastName}</span>
                </h1>
                <p className="text-4xl my-6">Your Stories</p>
                <table className="">
                    <thead className="bg-white">
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {stories.map((story) => (
                            <tr className="bg-[#f2f2f2] w-[100%] " key={story._id}>
                                <td className='w-[8rem] sm:w-[25rem] break-all'>
                                    <a href={`/stories/show/${story._id}`}>{story.title}</a>
                                </td>
                                <td>{story.date}</td>
                                <td>
                                    <span className="dash-status">{story.status}</span>
                                </td>
                                <td className="flex gap-2 flex-col sm:flex-row sm:item-center ">
                                    <div>

                                    </div>
                                    <div
                                        className="flex justify-center items-center gap-1 h-8 shadow-md rounded-sm sm:w-[6rem] w-[5rem] bg-[#26a69a] cursor-pointer hover:bg-[#8bdad2]"
                                        onClick={() => editUserStory(story._id)}
                                    >
                                        <FontAwesomeIcon icon={faPencil} style={{ fontSize: 10, color: 'black' }} />
                                        <p>EDIT</p>
                                    </div>
                                    <div
                                        className="flex justify-center items-center gap-1 h-8 shadow-md rounded-sm sm:w-[6rem] w-[5rem] bg-[#f44336] cursor-pointer hover:bg-[#ec6056]"
                                        onClick={() => {
                                            deleteUserStory(story._id);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} style={{ fontSize: 10, color: 'white' }} />
                                        <p className='text-white'>DELETE</p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {user?.googleID && <AddStoryButton />}
            </div>
        </div>
    );
};

export default Dashboard;

