import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer/generated'

export function generateMetadata({ params }: { params: { slug: string } }) {
    const post = allPosts.find(
        (post) => post._raw.flattenedPath === params.slug,
    )
    return {
        title: post?.title,
    }
}

function Post({ params }: { params: { slug: string } }) {
    const post = allPosts.find(
        (post) => post._raw.flattenedPath === params.slug,
    )

    return (
        <article className='mx-auto max-w-2xl py-16'>
            <div className='mb-6 text-center'>
                <Link
                    href='/'
                    className='text-center text-sm font-bold uppercase text-blue-700'
                >
                    Home
                </Link>
            </div>
            <div className='mb-6 text-center'>
                <h1 className='mb-1 text-3xl font-bold'>{post?.title}</h1>
                <time dateTime={post?.date} className='text-sm text-slate-600'>
                    {post
                        ? format(parseISO(post.date), 'LLLL d, yyyy')
                        : 'unknown'}
                </time>
            </div>
            <div
                className='cl-post-body'
                dangerouslySetInnerHTML={{ __html: post?.body.html ?? '' }}
            />
        </article>
    )
}

export default Post
