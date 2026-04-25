import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { getAllPostIds, getPostData } from '@/lib/posts'

type Params = Promise<{ slug: string }>

async function getPostOrNotFound(slug: string) {
    try {
        return await getPostData(slug)
    } catch {
        notFound()
    }
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Params }) {
    const slug = (await params).slug
    const post = await getPostOrNotFound(slug)
    return {
        title: post.title,
    }
}

export async function generateStaticParams() {
    const paths = getAllPostIds()
    return paths
}

export default async function Post({ params }: { params: Params }) {
    const slug = (await params).slug
    const post = await getPostOrNotFound(slug)

    return (
        <article className='mx-auto max-w-2xl py-16'>
            <div className='mb-6 text-center'>
                <Link
                    href='/'
                    className='text-center text-sm font-bold uppercase text-sky-300 hover:text-sky-200'
                >
                    Home
                </Link>
            </div>
            <div className='mb-6 text-center'>
                <h1 className='mb-1 text-3xl font-bold'>{post.title}</h1>
                <time dateTime={post.date} className='text-sm text-slate-400'>
                    {format(parseISO(post.date), 'LLLL d, yyyy')}
                </time>
            </div>
            <div
                className='blog-post-content'
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
        </article>
    )
}
