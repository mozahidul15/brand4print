// This is a reference to an HTML SVG placeholder image
// that can be used when mockup images fail to load
// Data URI for a simple SVG placeholder with text "Image not available"

const placeholderSVG = `
<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="500" fill="#f0f0f0" />
  <text x="250" y="250" font-family="Arial" font-size="24" text-anchor="middle" fill="#888888">Image not available</text>
  <text x="250" y="280" font-family="Arial" font-size="16" text-anchor="middle" fill="#888888">Please try again later</text>
</svg>
`;

// Convert SVG to data URI for direct use in image src
const placeholderDataURI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(placeholderSVG)}`;

export default placeholderDataURI;
