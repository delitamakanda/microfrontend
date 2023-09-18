import { getAuthorBySlug, getAllPosts } from '../lib/api';
import { useParams, Link } from 'react-router-dom';

const Author = () => {
    const { permalink } = useParams();
    const author = getAuthorBySlug(permalink);
    const posts = getAllPosts().filter((post) => post.author === author.slug);
    return (
        <div>
            <h1>{author?.name}</h1>

            <img src={author?.profilePictureUrl} alt={author?.name} height="80" width="80" />

            <h2>Posts</h2>

            <ul>
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link to={`${post.permalink}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default Author;
