import { useParams } from 'react-router-dom';
import { getPostBySlug, getAuthorBySlug, getAllPosts } from '../lib/api';
import { useRemarkSync } from 'react-remark';
import { Link } from'react-router-dom';

const Post = () => {
    const { permalink } = useParams();
    const { data, content } = getPostBySlug(permalink);
    const author = getAuthorBySlug(data?.author);
    return (
        <div>
            <h1>{data?.title}</h1>
            <time dateTime={data?.createdAt}>{new Date(data?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            })}</time>

            <div>
            <img src={author?.profilePictureUrl} alt={author?.name} height="40" width="40" />

            <Link to={author?.permalink}>
                {author?.name}
            </Link>
            </div>

            {useRemarkSync(content)}
            
        </div>
    )
}

export default Post;