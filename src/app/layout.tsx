import '../../styles/globals.css'
import type {Metadata} from 'next'

export const metadata: Metadata = {
    title: 'json2ts',
    description: 'json2ts',
    keywords: ["json2ts", "json", "typescript"]
}
export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang='zh'>
        <body className='container mx-auto px-3'>
        {children}
        </body>
        </html>
    );
}
