import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddStoryButton from '../../components/AddStoryButton';
import { useParams, useNavigate } from 'react-router-dom';

interface User {
    _id: string;
    googleID: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    __v: number;
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

const Story = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const checkAuthenticatedUser = (): void => {
        const userString = localStorage.getItem('user');

        if (userString) {
            const userData: User = JSON.parse(userString);
            setUser(userData);
        }
    };
    const navigate = useNavigate();
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        };
        const formattedDate = date.toLocaleDateString('en-US', options);

        return formattedDate;
    };

    const getPublicStories = async () => {
        try {
            const accessToken = localStorage.getItem('token');
            const token = `Bearer ${accessToken}`;

            // Set the token in the Authorization header of axios
            axios.defaults.headers.common['Authorization'] = token;

            // Make the API call using axios
            const response = await axios.get(`http://localhost:5175/stories`);

            // Process the response data
            const formattedStories = response.data.data.map((story: any) => ({
                ...story,
                date: formatDate(story.date), // Format the date
            }));
            setStories(formattedStories);
        } catch (err) {
            navigate('/error')
        }
    };

    useEffect(() => {
        // Fetch all public stories
        getPublicStories();

        // Check user auth
        checkAuthenticatedUser();
    }, []);

    return (
        <div className="p-[2rem] sm:px-[12rem] sm:py-10">
            {/* Public stories */}
            <div>
                <h1 className="text-7xl text-[#2E7D32] text-center sm:text-start">Stories</h1>
                <div className="flex flex-col sm:flex-row gap-6 flex-wrap">
                    {stories.map((story) => (
                        <div key={story._id} className="border border-gray-200 rounded-sm shadow-md p-4 w-full sm:w-[16rem] text-center my-6">
                            <h2 className="text-xl font-semibold mb-2 break-all h-[10rem]">{story.title}</h2>
                            <p className="text-gray-500 mb-2">{story.date}</p>
                            <p>{story.body}</p>

                            <hr className="h-px my-2 bg-gray-400 border-0"></hr>
                            <div
                                className="flex justify-center items-center my-4"
                                onClick={() => {
                                    navigate(`/stories/show/${story._id}`);
                                }}
                            >
                                <p className="bg-gray-400 w-[8rem] rounded-sm shadow-md flex justify-center items-center h-[2rem] cursor-pointer hover:bg-gray-600">READ MORE</p>
                            </div>
                        </div>
                    ))}
                </div>
                {user?.googleID && <AddStoryButton />}
            </div>
        </div>
    );
};

export default Story;
