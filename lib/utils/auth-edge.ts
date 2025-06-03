/* eslint-disable @typescript-eslint/no-explicit-any */
// This is a simplified JWT verification function that works in Edge Runtime
// It doesn't use Node.js crypto module which is not available in Edge Runtime

export function verifyJwtEdge(token: string): any {
  try {
    // Simple JWT decoding - not doing full verification
    // This is for middleware purposes only - full verification happens in API routes
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Decode the payload (middle part) of the JWT
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      throw new Error('Token expired');
    }
    
    return payload;
  } catch (error) {
    console.log('Edge token verification error:', error);
    return null;
  }
}
