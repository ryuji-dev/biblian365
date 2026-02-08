import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'BIBLIAN365 - 경건시간 & 성경통독',
        short_name: 'BIBLIAN365',
        description: '서울에스라교회 청년부를 위한 경건시간 관리 및 1년 성경통독 앱',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#7c3aed',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon-192',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/apple-icon',
                sizes: '180x180',
                type: 'image/png',
            }
        ],
    }
}
