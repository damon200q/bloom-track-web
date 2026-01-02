export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0, color: '#ff6b9d' }}>404</h1>
      <p style={{ fontSize: '1.5rem', color: '#666' }}>Page Not Found</p>
      <a href="/" style={{ 
        marginTop: '2rem', 
        padding: '0.75rem 2rem',
        background: 'linear-gradient(to right, #ff6b9d, #ff8fab)',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '0.5rem',
        fontWeight: 'bold'
      }}>
        Go Home
      </a>
    </div>
  );
}