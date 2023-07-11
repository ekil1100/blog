import './globals.css'

export const metadata = {
    title: `Like's Blog`,
    description: 'A blog about things I like',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <body>{children}</body>
        </html>
    )
}
