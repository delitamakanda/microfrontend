import { useLocation } from 'react-router-dom';
const Post = () => {
    const location = useLocation();
    return (
        <div>
            <h1>Post</h1>
            { JSON.stringify(location) }
        </div>
    )
}

export default Post;