import { Link } from 'react-router-dom';
import { getAllPosts, getAuthorBySlug } from '../lib/api';
import { useState, useEffect } from 'react';

const POSTS = [
    {
        title: "My first post",
        createdAt: "2021-05-01",
        excerpt: "A short excerpt summarizing the post.",
        permalink: "/posts/my-first-post",
        slug: "my-first-post",
    }, {
        title: "My second post",
        createdAt: "2021-05-04",
        excerpt: "Another summary that is short.",
        permalink: "/posts/my-second-post",
        slug: "my-second-post",
    }
];

const Posts = () => {
    const posts = getAllPosts();
    const [searchValue, setSearchValue] = useState('');
    const [filteredPosts, setFilteredPosts] = useState(posts);

    useEffect(() => {
        setFilteredPosts(posts.filter((post) => {
            return post.title.toLowerCase().includes(searchValue.toLowerCase());
        }));
    }, [searchValue]);
    return (
        <>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className='space-y-2 pb-8 pt-6 md:space-y-5'>
                <h1 className='text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14'>Posts</h1>
                <div className="relative max-w-lg">
                    <label>
                    <span className="sr-only">Search articles</span>
                    <input
                        aria-label="Search articles"
                        type="text"
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search articles"
                        className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
                    />
                    </label>
                    <svg
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                    </svg>
                </div>
            </div>
            {!filteredPosts && 'No posts found.'}
            {filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => {
                const prettyDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                });
                return (
                    <div  key={post.slug} className="py-4">
                    <article className='space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0'>
                        <dl>
                            <dt className='sr-only'>Published on</dt>
                            <dd className='text-base font-medium leading-6 text-gray-500 dark:text-gray-400'>
                                <time dateTime={post.createdAt}>{prettyDate}</time>
                            </dd>
                        </dl>
                        <div className="space-y-3 xl:col-span-3">
                            <>
                                <h3 className='text-2xl font-bold leading-8 tracking-tight'>
                                <Link to={post.permalink} className="text-gray-900 dark:text-gray-100">
                                    {post.title}
                                </Link>
                                </h3>
                                <div className='flex flex-wrap'>
                                {post.authors.map((a, idx) => {
                                    const author = getAuthorBySlug(a);
                                    return (
                                        <div key={idx} className='mr-4'>
                                            <Link to={author?.permalink}>
                                    <img src={author?.profilePictureUrl} className='rounded-full' title={author?.name} alt={author?.name} height="40" width="40" />
                                    </Link>
                                    </div>
                                    )
                                }
                                )}
                                </div>
                                <div className='prose max-w-none text-gray-500 dark:text-gray-400'>
                                    {post.excerpt}
                                </div>
                            </>
                        </div>
                        <h2>
                        </h2>
                    </article>
                    </div>
                )
            })}
        </div>
        </>
    )
}

export default Posts;