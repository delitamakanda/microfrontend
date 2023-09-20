import { Link } from 'react-router-dom';
import { getAllAuthors, getAllPosts } from '../lib/api';

const Authors = () => {
    const authors = getAllAuthors();

    return (
        <div>
            <h1>Authors</h1>
            {authors.map(author => {
                const posts = getAllPosts().filter(post => post.authors.includes(author.slug));
                return (
                    <div key={author.slug}>
                        <h2>
                            <Link to={`${author.permalink}`}>{author.name}</Link>
                        </h2>
    
                        <img src={author.profilePictureUrl} alt={author.name} height="40" width="40" />

                        <p>{posts.length} post(s)</p>
    
                        <Link to={`${author.permalink}`}>
                            Go to profile
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}

export default Authors;