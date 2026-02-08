import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      // 사용자께서 주신 디자인을 그대로 반영 (Tailwind 대신 인라인 스타일)
      <div
        style={{
          background: 'hsl(262, 83%, 65%)', // bg-primary
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '0', // 흰 배경 문제를 위해 Full Square
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20" // 32px 기준 약 66%
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          <path d="M6 8h2" />
          <path d="M6 12h2" />
          <path d="M16 8h2" />
          <path d="M16 12h2" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
