// app/page.tsx
import React from 'react';

export default function HomePage() {
  return (
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        backgroundColor: '#f0f2f5'
      }}>
        <h1 style={{ color: '#0070f3', fontSize: '3rem' }}>
          ¡Next.js Funcionando!
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#333' }}>
          El servidor local está activo (localhost:3000)
        </p>
        <div style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          ✨ ¡Página de prueba activa! ✨
        </div>
      </main>
  );
}