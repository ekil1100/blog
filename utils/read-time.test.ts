import { expect, it } from 'vitest'
import { countWords } from './read-time'

it('count words', () => {
    const words = 'Hello world'
    expect(countWords(words)).toBe(2)
})

it('count Chinese', () => {
    const words = '等囧铃铛枫林上等矿上订房间'
    expect(countWords(words)).toBe(13)
})
