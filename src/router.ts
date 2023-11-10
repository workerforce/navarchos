import { Router } from 'itty-router'

// Create a new router
const router = Router()

// Handle Docker Push requests
router.post('/v2/:namespace/:repo/blobs/uploads/', async (request, env, ctx) => {
  // Extract namespace and repo from the URL
  const { namespace, repo } = ctx.params

  console.log(`Received Docker push for ${namespace}/${repo}`)

  // Here you would handle the upload. For now, just return a success message.
  return new Response(`Docker push received for ${namespace}/${repo}`, {
    status: 202,
  })
})

// Fallback for all other requests
router.all('*', () => new Response('Not Found', { status: 404 }))

export default router;
