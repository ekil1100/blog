import './globals.css'

export const metadata = {
    title: `Like`,
    description: `Like's personal site`,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <body className='bg-gray-950 text-gray-50 font-body'>{children}</body>
        </html>
    )
}
