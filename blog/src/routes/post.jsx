import { useParams } from 'react-router-dom';
import { getPostBySlug, getAuthorBySlug } from '../lib/api';
import { useRemarkSync } from 'react-remark';
import { Link } from'react-router-dom';
import SectionContainer from '../components/SectionContainer';
import siteMetadata from '../data/siteMetadata';
import PageTitle from '../components/PageTitle';

const Post = () => {
    const { permalink } = useParams();
    const { data, content } = getPostBySlug(permalink);
    let reviewer;
    if (data.reviewer) {
        reviewer = getAuthorBySlug(data?.reviewer);
    }
    return (
        <SectionContainer>
            <article>
                <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
                <header className="pt-6 xl:pb-6">
                    <div className="space-y-1 text-center">
                    <dl className="space-y-10">
                        <div>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                            <time dateTime={data?.createdAt}>
                            {new Date(data?.createdAt).toLocaleDateString(siteMetadata.locale, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            })}
                            </time>
                        </dd>
                        </div>
                    </dl>
                    <div>
                        <PageTitle>{data?.title}</PageTitle>
                    </div>
                    </div>
                </header>
                <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
                    <dl className="pb-10 pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
                        <dt className="sr-only">Authors</dt>
                        <dd>
                            <div  className='flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8'>
                            {
                                data?.authors?.map((author, idx) => {
                                    const a = getAuthorBySlug(author);
                                    return (
                                        <div className="flex items-center space-x-2" key={idx}>
                                            <Link to={a.permalink}>
                                            <img title={a?.name} className="h-10 w-10 rounded-full" src={a?.profilePictureUrl} alt={a?.name} height="40" width="40" />
                                            </Link>
                                            <dl className="whitespace-nowrap text-sm font-medium leading-5">
                                            <dt className="sr-only">Name</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{a?.name}</dd>
                                            </dl>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </dd>
                    </dl>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
                    <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{useRemarkSync(content)}</div>
                    <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
                    <h5 className='text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400'>Reviewers</h5>
                    {
                        reviewer && reviewer !== undefined ? (
                            <footer className='flex flex-wrap items-center'>
                                <img src={reviewer?.profilePictureUrl} alt={reviewer?.name} title={reviewer?.name} className='rounded-full h-10 w-10 mr-4' height="40" width="40" />
                                <Link to={reviewer?.permalink}>
                                    {reviewer?.name}
                                </Link>
                            </footer>
                        ) : <div>No reviewers</div>
                    }
                    </div>
                    </div>
                </div>
                </div>
            </article>
        </SectionContainer>
    )
}

export default Post;