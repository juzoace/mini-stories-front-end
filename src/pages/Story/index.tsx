import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AddStoryButton from "../../components/AddStoryButton";

interface User {
    googleID: string;
    firstName: string;
    lastName: string;
    email: string;
}

const Story = () => {
    const { id } = useParams<{ id: string }>();
    const [story, setStory] = useState<any>({});
    const [userData, setUserData] = useState<User | null>(null);
    const [commentText, setCommentText] = useState<string>("");
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

    const getAuthenticatedUserData = () => {
        const user = localStorage.getItem('user');
        const userData = JSON.parse(user);
        setUserData(userData);

    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentText(event.target.value);
    };

    const PostComment = async () => {
        try {
            const accessToken = localStorage.getItem('token');
            const token = `Bearer ${accessToken}`;

            // Set the token in the Authorization header of axios
            axios.defaults.headers.common['Authorization'] = token;

            // Make the API call using axios
            const response = await axios.post(`http://localhost:5175/stories/comment/${id}`, {
                commentBody: commentText,
                commenterId: userData?.googleID,
            });

            setCommentText('');
            // Check if the comment was successfully posted
            if (response.data.success) {
                // Fetch the updated story data
                getStory();
            }
        } catch(err) {
            // console.error("Error posting comment:", err);
            navigate('/error')
        }
    }

    const getStory = async () => {
        try {
            const response = await axios.get(`http://localhost:5175/stories/show/${id}`);
            setStory({
                ...response.data.data,
                date: formatDate(response.data.data.date)
            })
        } catch (error) {
            navigate('/error')
            // console.error("Error fetching story:", error);
        }
    }

    useEffect(() => {
        getAuthenticatedUserData()
        getStory();
    }, [])

    return (
        <div className=" p-[2rem] sm:px-[12rem] sm:py-10 flex flex-row">

            <div className="flex flex-col w-full md:w-8/12">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="">{story.title}</span>
                </h1>
                <div className="bg-white shadow-md rounded-sm p-4 mb-4 sm:mr-6">
                    <span className="text-gray-600 text-sm">{story.date}</span>
                    <p>{story.body}</p>
                </div>

                {story.allowComments &&
                    <div className="bg-white shadow-md rounded-sm p-4 mb-4 sm:mr-6">
                        <h4 className="text-2xl mb-2">Comments</h4>
                        {userData ?
                            <div className="flex flex-col">
                                <textarea
                                    name="commentBody"
                                    className="materialize-textarea rounded-md border-gray-300 p-2 mb-2"
                                    placeholder="Add Comment"
                                    value={commentText}
                                    onChange={handleCommentChange}
                                ></textarea>
                                <button
                                    onClick={PostComment}
                                    className="btn bg-[#26a69a] text-white font-semibold py-2 px-4 rounded-md cursor-pointer"
                                >
                                    Submit
                                </button>
                            </div>
                            :
                            <p className="text-gray-600">
                                Please <a href="/auth/google" className="text-blue-500">log</a> in to leave a comment
                            </p>
                        }
                    </div>
                }

                {story.comments && story.comments.map((comment: any, index: number) => (
                    <div className="bg-white shadow-md rounded-sm p-4 mb-4 sm:mr-6" key={index}>
                        <h4 className="text-xl font-semibold mb-2">{comment.commentBody}</h4>
                        <div className="flex items-center">
                            <img src={comment.commentUser.image} className="w-8 h-8 rounded-full mr-2" />
                            <a href={`/stories/user/${comment.commentUser.id}`} className="text-blue-500">
                                {comment.commentUser.firstName} {comment.commentUser.lastName}
                            </a>
                        </div>
                        <small className="text-gray-600">Posted: {comment.commentDate}</small>
                    </div>
                ))}
            </div>

            <div className="hidden md:flex md:flex-col w-4/12 text-center">
                <div className="bg-white shadow-md rounded-sm py-4 mb-4">
                    <h4 className="text-xl font-semibold mb-[4rem]">{story.user && story.user.firstName} {story.user && story.user.lastName}</h4>
                    <hr className="h-px my-2 bg-gray-200 border-0"></hr>
                    <p onClick={() => {
                        // Do auth check
                        if (userData?.googleID) {
                            navigate(`/stories/user/${story.user._id}`)
                        } else {
                            navigate('/login')
                        }

                    }} className=" cursor-pointer">
                        More From {story.user && story.user.firstName}
                    </p>
                </div>
            </div>

            {userData?.googleID &&  <AddStoryButton />}
        </div>
    )
}

export default Story;

