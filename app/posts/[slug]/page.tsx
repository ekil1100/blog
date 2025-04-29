import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { getAllPostIds, getPostData } from '@/lib/posts'
import type { Metadata } from 'next'

type Props = {
    params: { slug: string }
    searchParams: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostData(params.slug)
    return {
        title: post.title,
    }
}

export async function generateStaticParams() {
    const paths = getAllPostIds()
    return paths
}

export default async function Post({ params }: Props) {
    const post = await getPostData(params.slug)

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
                <h1 className='mb-1 text-3xl font-bold'>{post.title}</h1>
                <time dateTime={post.date} className='text-sm text-slate-600'>
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
