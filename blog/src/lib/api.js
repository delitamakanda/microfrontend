import matter from 'gray-matter';


export function getAllPosts() {
    const context = require.context('../_posts', false, /\.md$/);
    const posts = [];

    context.keys().forEach((filename) => {
        const slug = filename.split('./')[1].replace(/\.md$/, '');
        const fileContents = context(filename).default;
        const { data } = matter(fileContents);
        
        posts.push({
            ...data,
            slug,
            permalink: `/posts/${slug}`,
        });
    });
    return posts;

}

export function getPostBySlug(slug) {
    const context = require.context('../_posts', false, /\.md$/);
    const fileContents = context(`./${slug}.md`).default;
    const { data, content } = matter(fileContents);
    return { data, content };
}

export function getAllAuthors() {
    const context = require.context('../_authors', false, /\.json$/);
    const authors = [];

    context.keys().forEach((filename) => {
        const slug = filename.split('./')[1].replace(/\.json$/, '');
        const fileContents = context(filename);
        
        authors.push({
           ...fileContents,
             slug,
             profilePictureUrl: `${require(`../public/${slug}.jpg`).default}`,
             permalink: `/authors/${slug}`,
        });
    });
    return authors;
}

export function getAuthorBySlug(slug) {
    const context = require.context('../_authors', false, /\.json$/);
    const fileContents = context(`./${slug}.json`);

    return {
        ...fileContents,
        slug,
        profilePictureUrl: `${require(`../public/${slug}.jpg`).default}`,
        permalink: `/authors/${slug}`,
    }
}