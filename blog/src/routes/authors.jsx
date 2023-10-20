import { Link } from 'react-router-dom';
import { getAllAuthors, getAllPosts } from '../lib/api';

const Authors = () => {
    const authors = getAllAuthors();

    return (
        <>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Authors
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
            <div className="flex flex-col items-center space-x-2 pt-8">
            {authors.map(author => {
                const posts = getAllPosts().filter(post => post.authors.includes(author.slug));
                return (
                    <div key={author.slug}>
                        <img src={author.profilePictureUrl} className="h-48 w-48 rounded-full" alt={author.name} height="192" width="192" />
                        <h3 className='pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight'>
                            <Link to={`${author.permalink}`}>{author.name}</Link>
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">{posts.length} post(s)</p>
                    </div>
                )
            })}
            </div>
        </div>
        </div>

        </>
    )
}

export default Authors;