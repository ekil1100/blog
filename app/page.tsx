import Link from 'next/link'
import { compareDesc, format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer/generated'

function PostCard(post: (typeof allPosts)[0]) {
    return (
        <div className='mb-6'>
            <time dateTime={post.date} className='block text-sm text-slate-600'>
                {format(parseISO(post.date), 'LLLL d, yyyy')}
            </time>
            <h2 className='text-lg'>
                <Link
                    href={post.url}
                    className='text-blue-700 hover:text-blue-900'
                >
                    {post.title}
                </Link>
            </h2>
        </div>
    )
}

export const metadata = {
    title: 'Contentlayer Blog Example',
}

function Home() {
    const posts = allPosts.sort((a, b) =>
        compareDesc(parseISO(a.date), parseISO(b.date)),
    )

    return (
        <div className='mx-auto max-w-2xl py-16 text-center'>
            <h1 className='mb-8 text-3xl font-bold'>
                Contentlayer Blog Example
            </h1>

            {posts.map((post, idx) => (
                <PostCard key={idx} {...post} />
            ))}
        </div>
    )
}

export default Home
