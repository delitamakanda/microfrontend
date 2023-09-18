import { Link } from 'react-router-dom';
import { getAllPosts, getAuthorBySlug } from '../lib/api';

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
    return (
        <div>
            <h1>Posts</h1>
            {posts.map((post) => {
                const author = getAuthorBySlug(post.author);
                const prettyDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                });
                return (
                    <article key={post.slug}>
                        <h2>
                            <Link to={post.permalink}>
                                {post.title}
                            </Link>
                        </h2>
                        <time dateTime={post.createdAt}>{prettyDate}</time>
                        <div>
                            <img src={author?.profilePictureUrl} alt={author?.name} height="40" width="40" />

                            <Link to={author?.permalink}>
                                {author?.name}
                            </Link>
                        </div>
                        <p>{post.excerpt}</p>
                        <Link to={post.permalink}>
                            Read more
                        </Link>
                    </article>
                )
            })}
        </div>
    )
}

export default Posts;