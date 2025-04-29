import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

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

    // 按日期排序
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)

    return fileNames
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

export async function getPostData(id: string): Promise<PostData> {
    // 解码 URL 编码的文件名
    const decodedId = decodeURIComponent(id)
    const fullPath = path.join(postsDirectory, `${decodedId}.md`)
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
        draft: matterResult.data.draft || false,
    }
}

export function readingTime(content: string): string {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
}
