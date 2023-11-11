import { Router } from 'itty-router'
import { checkBlobExists, getManifest, storeManifest, initiateBlobUpload, storeBlobChunk } from './storageHandlers';

const router = Router({ base: '/' })

router.get('/v2/', () => new Response('{}', {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
}));

(router as any).head('/v2/:namespace/:repo/blobs/:digest', async ({ params }) => {
  console.log("digest endpoint hit")
  const exists = await checkBlobExists(params.namespace, params.repo, params.digest);
  return new Response(null, { status: exists ? 200 : 404 });
});

router.get('/v2/:namespace/:repo/manifests/:tag', async ({ params }) => {
  console.log("tag endpoint hit")
  const manifest = await getManifest(params.namespace, params.repo, params.tag);
  if (!manifest) {
    return new Response('Manifest not found', { status: 404 });
  }
  return new Response(JSON.stringify(manifest), { 
    status: 200, 
    headers: { 'Content-Type': 'application/vnd.docker.distribution.manifest.v2+json' } 
  });
});

router.put('/v2/:namespace/:repo/manifests/:tag', async ({ params, request }) => {
  console.log("digest endpoint hit")
  const manifestData = await request.json();
  await storeManifest(params.namespace, params.repo, params.tag, manifestData);
  return new Response('Manifest upload accepted', { status: 202 });
});

router.post('/v2/:namespace/:repo/blobs/uploads/', async ({ params, request }, env) => {
  console.log("upload endpoint hit")
  const { uploadUrl, range } = await initiateBlobUpload(params.namespace, params.repo, env);
  return new Response(JSON.stringify({ location: uploadUrl, range }), { 
    status: 202,
    headers: {
      'Location': uploadUrl,
      'Range': `bytes=${range}`,
      'Content-Type': 'application/json'
    }
  });
});

router.patch('/v2/:namespace/:repo/blobs/uploads/:sessionId', async ({ params, request }) => {
  console.log("upload endpoint hit")
  const { sessionId } = params;
  const data = await request.arrayBuffer();
  const range = await storeBlobChunk(sessionId, data);
  return new Response(null, { 
    status: 202,
    headers: { 'Range': `bytes=0-${range}` }
  });
});

router.all('*', () => new Response('Not Found', { status: 404 }))

export default router;
