'use client';

import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="bg-[#424242] md:h-[13rem] py-4">
            {/* First container */}
            <div className="sm:mx-[12rem] flex flex-col sm:flex-row sm:justify-between mb-12">
                {/* Left */}
                <div className="flex-col w-[100%] px-6 mb-4 sm:px-0 sm:w-[50%]">
                    <h1 className="my-2 italic text-2xl text-[#7CB342]">miniStories</h1>
                    <p className="text-white text-sm">
                        {' '}
                        Write your life portions by writing mini stories, share <br></br> them with others, or keep them to yourself ☺️
                    </p>
                </div>
                {/* Right */}
                <div className="w-[100%] sm:flex sm:justify-center sm:w-[50%]">
                    <div className="px-6 sm:px-0">
                        <h1 className="text-white text-2xl my-2">Links</h1>
                        <div>
                            <ul className='text-sm'>
                                <li className="mb-2">Public Stories</li>
                                <li>About</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Container */}
            <div className='text-center'>
                <p className='text-white text-sm'>
                    Created with
                    <span className="text-red-700"> &hearts;  </span>
                    by Dzenis H. ➖ © {new Date().getFullYear()} ➖ <span className="text-[#7CB342]">miniStories</span>
                </p>
            </div>
        </div>
    );
};

export default Footer;
