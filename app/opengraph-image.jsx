import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sai Vishnu Vamsi Senagasetty — AI & ML Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #0A0B0E 0%, #14161B 50%, #1E2129 100%)',
          color: '#F4F4F6',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 24, color: '#8B5CF6', marginBottom: 16, letterSpacing: 2 }}>
          AI ENGINEER · ML ENGINEER
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
          Sai Vishnu Vamsi Senagasetty
        </div>
        <div style={{ fontSize: 26, color: '#9CA3AF', maxWidth: 800, lineHeight: 1.4 }}>
          RAG · LLM · TensorFlow · PyTorch · Houston, TX
        </div>
        <div
          style={{
            position: 'absolute',
            right: 80,
            bottom: 80,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
