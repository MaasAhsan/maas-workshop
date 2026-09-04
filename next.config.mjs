/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Clickjacking + content-type sniffing protection
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // HSTS — only effective over HTTPS; browsers ignore it on http:// (local dev)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Content-Security-Policy. 'unsafe-inline' is required for Next.js's inline
  // hydration scripts and the app's inline style props; the stricter rules below
  // (frame-ancestors, object-src, base-uri, form-action) still block clickjacking
  // and object/plugin injection.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes and static assets
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
export default nextConfig;
