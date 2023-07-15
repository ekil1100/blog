import Link from 'next/link'
import { compareDesc, format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer/generated'
import MdiClockTimeFourOutline from '@/icons/MdiClockTimeFourOutline'
import MdiGithub from '@/icons/MdiGithub'
import MdiRssBox from '@/icons/MdiRssBox'
import MdiTwitter from '@/icons/MdiTwitter'
import { readTime } from '@/utils/read-time'
import MdiCalendarBlankOutline from '@/icons/MdiCalendarBlankOutline'

function PostCard(post: (typeof allPosts)[0]) {
    return (
        <div>
            <h2 className='text-2xl'>
                <Link href={post.url}>{post.title}</Link>
            </h2>
            <div className='flex gap-3 text-sm'>
                <div className='flex items-center gap-1'>
                    <MdiCalendarBlankOutline />
                    <time dateTime={post.date}>
                        {format(parseISO(post.date), 'yyyy-MM-dd')}
                    </time>
                </div>
                <div className='flex items-center gap-1'>
                    <MdiClockTimeFourOutline />
                    <span>{readTime(post.body.raw)}</span>
                </div>
            </div>
        </div>
    )
}

function Home() {
    const posts = allPosts.sort((a, b) =>
        compareDesc(parseISO(a.date), parseISO(b.date)),
    )

    return (
        <>
            <header className='m-auto flex max-w-[1440px] items-center justify-between px-8 py-4'>
                <h1 className='font-input'>Like</h1>
                <div className='flex gap-2'>
                    <MdiGithub />
                    <MdiTwitter />
                    <MdiRssBox />
                </div>
            </header>

            <main className='font-body'>
                {posts.map((post, idx) => (
                    <PostCard key={idx} {...post} />
                ))}
            </main>
        </>
    )
}

export default Home
