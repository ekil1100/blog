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
            <body className='h-screen w-screen bg-gray-950 text-gray-50'>
                {children}
            </body>
        </html>
    )
}
