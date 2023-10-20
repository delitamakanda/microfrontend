import { getAuthorBySlug, getAllPosts } from '../lib/api';
import { useParams, Link } from 'react-router-dom';
import SectionContainer from '../components/SectionContainer';

const Author = () => {
    const { permalink } = useParams();
    const author = getAuthorBySlug(permalink);
    const posts = getAllPosts().filter((post) => post.authors.includes(author.slug));
    return (
        <SectionContainer>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className='space-y-2 pb-8 pt-6 md:space-y-5'>
                <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                    {author?.name}
                </h1>
            </div>
        </div>
        <img src={author?.profilePictureUrl} alt={author?.name} className='rounded-full' title={author?.name} height="80" width="80" />
        <h2 className='pb-2 pt-4 text-xl font-bold leading-8 tracking-tight'>Posts</h2>
        <ul>
            {posts.map((post) => (
                <li key={post.slug}>
                    <Link to={`${post.permalink}`}>{post.title}</Link>
                </li>
            ))}
        </ul>
        </SectionContainer>
    )
}

export default Author;
