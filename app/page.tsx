import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import MdiClockTimeFourOutline from '@/icons/MdiClockTimeFourOutline'
import MdiGithub from '@/icons/MdiGithub'
import MdiRssBox from '@/icons/MdiRssBox'
import MdiTwitter from '@/icons/MdiTwitter'
import MdiCalendarBlankOutline from '@/icons/MdiCalendarBlankOutline'
import { getSortedPostsData, readingTime } from '@/lib/posts'
import { PostMeta } from '@/lib/posts'

function PostCard(post: PostMeta) {
    return (
        <div className='space-y-2 p-4'>
            <h2 className='text-2xl'>
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <div className='flex gap-3 text-xs'>
                <div className='flex items-center gap-1'>
                    <MdiCalendarBlankOutline />
                    <time dateTime={post.date}>
                        {format(parseISO(post.date), 'yyyy.MM.dd')}
                    </time>
                </div>
            </div>
        </div>
    )
}

export default function Home() {
    const posts = getSortedPostsData().filter((post) =>
        process.env.NODE_ENV === 'development' ? true : post.draft !== true,
    )

    return (
        <>
            <header className='m-auto flex max-w-[1440px] items-end justify-between px-8 py-4'>
                <h1 className='font-input text-lg'>LiKe</h1>
            </header>

            <main className='m-auto flex max-w-2xl flex-col gap-8 overflow-hidden px-4 py-16 font-body'>
                {posts.map((post, idx) => (
                    <PostCard key={idx} {...post} />
                ))}
            </main>
        </>
    )
}
