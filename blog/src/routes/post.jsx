import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../lib/api';
import { useRemarkSync } from 'react-remark';

const Post = () => {
    const { permalink } = useParams();
    const { data, content } = getPostBySlug(permalink);
    return (
        <div>
            <h1>{data?.title}</h1>
            <time dateTime={data?.createdAt}>{new Date(data?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            })}</time>

            {useRemarkSync(content)}
            
        </div>
    )
}

export default Post;