import { Router } from 'itty-router'

// Create a new router
const router = Router()

// Root /v2/ endpoint
router.get('/v2/', () => new Response('{}', {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
}));

// HEAD request for blob check
router.get('/v2/:namespace/:repo/blobs/:digest', async (request, env, ctx) => {
  const { namespace, repo, digest } = ctx.params;
  return new Response('Blob not found', { status: 404 });
});

// Handle manifest checks (GET)
router.get('/v2/:namespace/:repo/manifests/:tag', async (request, env, ctx) => {
  const { namespace, repo, tag } = ctx.params;

  // Logic to check if a manifest exists
  // For the PoC, we can return a dummy response or a 404 if it doesn't exist
  // In a real scenario, check your storage backend (e.g., Cloudflare KV or R2)
  
  // Assuming we don't find a manifest, return a 404
  return new Response('Manifest not found', { status: 404 });
});

// Handle manifest uploads (PUT)
router.put('/v2/:namespace/:repo/manifests/:tag', async (request, env, ctx) => {
  const { namespace, repo, tag } = ctx.params;

  // Logic to handle the uploaded manifest
  // You would typically process the request body and store it in your backend

  // For now, just acknowledge the upload
  return new Response('Manifest upload accepted', { status: 202 });
});

// Handle blob upload initiation (POST)
router.post('/v2/:namespace/:repo/blobs/uploads/', async (request, env, ctx) => {
  console.log('Context:', ctx);
  console.log('Params:', ctx.params);
  
  const requestURL = new URL(request.url)
  const registryHostname = requestURL.hostname;
  const { namespace, repo } = ctx.params;

  // Logic to initiate a blob upload
  // You would typically create a new upload session and return an upload URL

  // For now, just acknowledge the initiation and return a dummy upload URL
  return new Response(JSON.stringify({
    location: `https://${registryHostname}/v2/${namespace}/${repo}/blobs/uploads/dummy-session`,
    range: 'bytes=0-0',
  }), { 
    status: 202,
    headers: {
      'Content-Type': 'application/json',
      'Location': `https://${registryHostname}/v2/${namespace}/${repo}/blobs/uploads/dummy-session`,
      'Range': 'bytes=0-0',
    }
  });
});

// Fallback for all other requests
router.all('*', () => new Response('Not Found', { status: 404 }))

export default router;
