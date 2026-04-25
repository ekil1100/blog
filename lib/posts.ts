import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'

const postsDirectory = path.join(process.cwd(), 'posts')
const draftsDirectory = path.join(process.cwd(), 'drafts')

export interface PostData {
    id: string
    title: string
    date: string
    tags?: string[]
    draft?: boolean
    contentHtml: string
}

export interface PostMeta {
    id: string
    title: string
    date: string
    tags?: string[]
    draft?: boolean
}

export interface PostParams {
    slug: string
}

function getMarkdownFileNames(directory: string): string[] {
    if (!fs.existsSync(directory)) {
        return []
    }

    return fs
        .readdirSync(directory)
        .filter((fileName) => fileName.endsWith('.md') && !fileName.startsWith('_'))
}

function toIsoDate(value: unknown): string {
    if (value instanceof Date) {
        return value.toISOString()
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return new Date(value).toISOString()
    }

    return new Date().toISOString()
}

function readPostMeta(directory: string, fileName: string, draft = false): PostMeta {
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(directory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)

    return {
        id,
        title: matterResult.data.title || id,
        date: toIsoDate(matterResult.data.date),
        tags: matterResult.data.tags || [],
        draft: draft || matterResult.data.draft || false,
    }
}

function getDraftPostsData(): PostMeta[] {
    if (process.env.NODE_ENV !== 'development') {
        return []
    }

    return getMarkdownFileNames(draftsDirectory).map((fileName) =>
        readPostMeta(draftsDirectory, fileName, true),
    )
}

export function getSortedPostsData(): PostMeta[] {
    const publishedPosts = getMarkdownFileNames(postsDirectory).map((fileName) =>
        readPostMeta(postsDirectory, fileName),
    )

    return [...publishedPosts, ...getDraftPostsData()].sort((a, b) =>
        a.date < b.date ? 1 : -1,
    )
}

export function getAllPostIds(): PostParams[] {
    const publishedIds = getMarkdownFileNames(postsDirectory).map((fileName) => ({
        slug: fileName.replace(/\.md$/, ''),
    }))

    if (process.env.NODE_ENV !== 'development') {
        return publishedIds
    }

    const draftIds = getMarkdownFileNames(draftsDirectory).map((fileName) => ({
        slug: fileName.replace(/\.md$/, ''),
    }))

    return [...publishedIds, ...draftIds]
}

export async function getPostData(id: string): Promise<PostData> {
    const decodedId = decodeURIComponent(id)

    if (decodedId.includes('/') || decodedId.includes('\\')) {
        throw new Error(`Invalid post id: ${id}`)
    }

    const postPath = path.join(postsDirectory, `${decodedId}.md`)
    const draftPath = path.join(draftsDirectory, `${decodedId}.md`)

    let fullPath: string
    let isDraft = false

    if (fs.existsSync(postPath)) {
        fullPath = postPath
    } else if (process.env.NODE_ENV === 'development' && fs.existsSync(draftPath)) {
        fullPath = draftPath
        isDraft = true
    } else {
        throw new Error(`Post not found: ${id}`)
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    const processedContent = await remark()
        .use(remarkRehype)
        .use(rehypeHighlight, { detect: true })
        .use(rehypeStringify)
        .process(matterResult.content)

    return {
        id,
        contentHtml: processedContent.toString(),
        title: matterResult.data.title || id,
        date: toIsoDate(matterResult.data.date),
        tags: matterResult.data.tags || [],
        draft: isDraft || matterResult.data.draft || false,
    }
}

export function readingTime(content: string): string {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
}
