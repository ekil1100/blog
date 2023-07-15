export function countWords(text: string) {
    return text.split(/[\u4e00-\u9fcc]|\w+/gm).length - 1
}

export function readTime(text: string) {
    const words = countWords(text)
    const time = Math.ceil(words / 300)
    if (time === 0) {
        return '> 1min'
    }
    if (time > 60) {
        let hour = Math.floor(time / 60)
        return `${hour}h${time % 60}min`
    }
    return `${time}min`
}
