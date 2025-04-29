import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

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

export function getSortedPostsData(): PostMeta[] {
    // 获取 posts 目录下的所有文件名
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
        .filter(
            (fileName) => fileName.endsWith('.md') && !fileName.startsWith('_'),
        )
        .map((fileName) => {
            // 从文件名中移除 ".md" 获取 id
            const id = fileName.replace(/\.md$/, '')

            // 读取 markdown 文件作为字符串
            const fullPath = path.join(postsDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')

            // 使用 gray-matter 解析文章元数据部分
            const matterResult = matter(fileContents)

            // 将数据与 id 结合
            return {
                id,
                title: matterResult.data.title || id,
                date:
                    matterResult.data.date?.toISOString() ||
                    new Date().toISOString(),
                tags: matterResult.data.tags || [],
                draft: matterResult.data.draft || false,
            }
        })

    // 在开发环境中获取草稿目录下的所有文件
    let draftPostsData: PostMeta[] = []
    if (process.env.NODE_ENV === 'development' && fs.existsSync(draftsDirectory)) {
        const draftFileNames = fs.readdirSync(draftsDirectory)
        draftPostsData = draftFileNames
            .filter(
                (fileName) => fileName.endsWith('.md') && !fileName.startsWith('_'),
            )
            .map((fileName) => {
                // 从文件名中移除 ".md" 获取 id
                const id = fileName.replace(/\.md$/, '')

                // 读取 markdown 文件作为字符串
                const fullPath = path.join(draftsDirectory, fileName)
                const fileContents = fs.readFileSync(fullPath, 'utf8')

                // 使用 gray-matter 解析文章元数据部分
                const matterResult = matter(fileContents)

                // 将数据与 id 结合，并标记为草稿
                return {
                    id,
                    title: matterResult.data.title || id,
                    date:
                        matterResult.data.date?.toISOString() ||
                        new Date().toISOString(),
                    tags: matterResult.data.tags || [],
                    draft: true,
                }
            })
    }

    // 合并正式文章和草稿文章
    const combinedPosts = [...allPostsData, ...draftPostsData]

    // 按日期排序
    return combinedPosts.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
    const postIds = fileNames
        .filter(
            (fileName) => fileName.endsWith('.md') && !fileName.startsWith('_'),
        )
        .map((fileName) => {
            // 从文件名中移除 .md 扩展名
            const id = fileName.replace(/\.md$/, '')
            return {
                params: {
                    slug: id,
                },
            }
        })

    // 在开发环境中获取草稿目录下的所有文件
    let draftIds: { params: { slug: string } }[] = []
    if (process.env.NODE_ENV === 'development' && fs.existsSync(draftsDirectory)) {
        const draftFileNames = fs.readdirSync(draftsDirectory)
        draftIds = draftFileNames
            .filter(
                (fileName) => fileName.endsWith('.md') && !fileName.startsWith('_'),
            )
            .map((fileName) => {
                // 从文件名中移除 .md 扩展名
                const id = fileName.replace(/\.md$/, '')
                return {
                    params: {
                        slug: id,
                    },
                }
            })
    }

    return [...postIds, ...draftIds]
}

export async function getPostData(id: string): Promise<PostData> {
    // 解码 URL 编码的文件名
    const decodedId = decodeURIComponent(id)
    const postPath = path.join(postsDirectory, `${decodedId}.md`)
    const draftPath = path.join(draftsDirectory, `${decodedId}.md`)

    let fullPath: string
    let isDraft = false

    // 检查文件是否存在于 posts 目录
    if (fs.existsSync(postPath)) {
        fullPath = postPath
    }
    // 检查文件是否存在于 drafts 目录，且是开发环境
    else if (process.env.NODE_ENV === 'development' && fs.existsSync(draftPath)) {
        fullPath = draftPath
        isDraft = true
    }
    else {
        throw new Error(`Post not found: ${id}`)
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // 使用 gray-matter 解析文章元数据部分
    const matterResult = matter(fileContents)

    // 使用 remark 将 markdown 转换为 HTML 字符串
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    // 将数据与 id 和内容结合
    return {
        id,
        contentHtml,
        title: matterResult.data.title || id,
        date: matterResult.data.date?.toISOString() || new Date().toISOString(),
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
