export default function handler(req, res) {
  // Check for custom headers that would be set by middleware
  const middlewareHeaders = {
    path: req.headers['x-middleware-path'] || null,
    method: req.headers['x-middleware-method'] || null,
    cache: req.headers['x-middleware-cache'] || null
  };
  
  // Determine if middleware is running based on presence of headers
  const isMiddlewareWorking = Object.values(middlewareHeaders).some(value => value !== null);
  
  res.status(200).json({ 
    status: 'API routes working',
    middlewareEnabled: process.env.NEXT_PUBLIC_MIDDLEWARE_ENABLED || 'unknown',
    middlewareWorking: isMiddlewareWorking,
    middlewareHeaders,
    requestPath: req.url,
    requestMethod: req.method,
    timestamp: new Date().toISOString()
  });
}
