import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditStory = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [story, setStory] = useState<any>({ title: '', status: 'public', allowComments: false, body: '' });

    const getStory = async () => {
        try {
            const response = await axios.get(`http://localhost:5175/stories/show/${id}`);
            setStory(response.data.data);
        } catch (error) {
            navigate('/error')
            // console.error("Error fetching story:", error);
        }
    };

    const updateStory = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const accessToken = localStorage.getItem('token');
            const token = `Bearer ${accessToken}`;

            // Set the token in the Authorization header of axios
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.put(`http://localhost:5175/stories/${id}`, story);
            if (response.data.success === true) {

                navigate(`/dashboard?token=${accessToken}`)
            }
        } catch (err) {
            navigate('/error')
            // console.error('Error updating story:', err);

        }
    };

    useEffect(() => {
        getStory();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = event.target;
        let newValue: string | boolean = value;

        if (type === 'checkbox') {
            newValue = (event.target as HTMLInputElement).checked;
        }

        setStory((prevStory: any) => ({
            ...prevStory,
            [name]: newValue
        }));
    };

    return (
        <div className="sm:px-[12rem] sm:py-10">
            <h1 className="text-6xl mb-6">Edit Story</h1>
            <div className="w-full max-w-lg">
                <form onSubmit={updateStory}>
                    <input type="hidden" name="_method" value="" />
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400">Title</label>
                        <input type="text" name="title" id="title" value={story.title} onChange={handleInputChange} className="mt-1 sm:w-[55rem] focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-400">Status</label>
                        <select name="status" id="status" value={story.status} onChange={handleInputChange} className="mt-1 sm:w-[55rem] focus:ring-[#26a69a] focus:border-[#26a69a] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="unpublished">Unpublished</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center">
                            <input type="checkbox" name="allowComments" id="allowComments" checked={story.allowComments} onChange={handleInputChange} className="focus:ring-[#26a69a] h-4 w-4 text-[#26a69a] border-gray-300 rounded" />
                            <label htmlFor="allowComments" className="ml-2 block text-sm text-gray-900">Allow Comments</label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="body" className="block text-sm font-medium text-gray-700">Tell Us Your Story:</label>
                        <textarea name="body" id="body" value={story.body} onChange={handleInputChange} className="my-4 h-[20rem] sm:w-[55rem] focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 "></textarea>
                    </div>
                    <button type="submit" className=" w-[6rem] justify-center items-center h-[2rem] border border-transparent text-sm font-medium text-white bg-[#26a69a] hover:bg-[#4bb1a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">SAVE</button>
                </form>
            </div>
        </div>
    );
};

export default EditStory;
