import { useParams } from 'react-router-dom';
import { getPostBySlug, getAuthorBySlug, getAllPosts } from '../lib/api';
import { useRemarkSync } from 'react-remark';
import { Link } from'react-router-dom';

const Post = () => {
    const { permalink } = useParams();
    const { data, content } = getPostBySlug(permalink);
    const reviewer = getAuthorBySlug(data?.reviewer)
    return (
        <div>
            <h1>{data?.title}</h1>
            <time dateTime={data?.createdAt}>{new Date(data?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            })}</time>
            {
                data?.authors?.map((author, idx) => {
                    const a = getAuthorBySlug(author);
                    return (
                        <div key={idx}>
                            <img src={a?.profilePictureUrl} alt={a?.name} height="40" width="40" />
                            <Link to={a.permalink}>{a.name}</Link>
                        </div>
                    )
                })
            }
            {useRemarkSync(content)}

            {
                reviewer ? (
                    <div>
                        <h5>Reviewser</h5>
                        <img src={reviewer?.profilePictureUrl} alt={reviewer?.name} height="40" width="40" />
                        <Link to={reviewer?.permalink}>
                            {reviewer?.name}
                        </Link>
                    </div>
                ) : <div></div>
            }
        </div>
    )
}

export default Post;