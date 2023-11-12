import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'

const router = OpenAPIRouter()

const DUMMY_UUID = "a39d9414-857c-48ff-b4bb-26e9074e34a1"
const ALPINE_SIZE = 3331831

router.get('/v2/', () => {
  return new Response('{}', {
    status: 200,
    headers: { 
      'Content-Length': '0',
    }
  })
});

router.head('/v2/:name+/blobs/:digest', async (request, env) => {
  const { name, digest } = request.params;
  const storedDigest = await env.NAVAR_KV.get(name);
  const exists = (storedDigest === digest);
  return new Response(null, {
    status: exists ? 200 : 404,
    headers: { 
      'Content-Length': '0',
    }
  });
});

router.post('/v2/:name+/blobs/uploads/', async (request) => {
  const { name } = request.params;
  return new Response(null, {
    status: 202,
    headers: {
      'Location': `/v2/${name}/blobs/uploads/${DUMMY_UUID}`,
      'Range': '0-0',
      'Content-Length': '0',
      'Docker-Upload-UUID': DUMMY_UUID
    }
  });
});

router.patch('/v2/:name+/blobs/uploads/:uuid', async (request, env) => {
  const { name } = request.params;
  await env.NAVAR_BUCKET.put(`${name}/blobs/uploads/${DUMMY_UUID}`, request.body);
  return new Response(null, {
    status: 201,
    headers: {
      'Location': `/v2/${name}/blobs/uploads/${DUMMY_UUID}`,
      'Range': `0-${ALPINE_SIZE - 1}`,
      'Content-Length': '0',
    }
  });
});

router.put('/v2/:name+/blobs/uploads/:uuid', async (request, env) => {
  const { digest } = request.query;
  await env.NAVAR_KV.put(request.params.name, digest);
  return new Response(null, {
    status: 201,
    headers: {
      'Location': `/v2/${request.params.name}/blobs/uploads/${DUMMY_UUID}`,
      'Range': `0-${ALPINE_SIZE - 1}`,
      'Content-Length': '0',
      'Docker-Content-Digest': digest
    }
  });
});

router.put('/v2/:name+/manifests/:reference', async (request, env) => {
  const { name } = request.params;
  await env.NAVAR_BUCKET.put(`${name}/blobs/uploads/manifest.json`, request.body);
  const storedDigest = await env.NAVAR_KV.get(name);
  return new Response(null, {
    status: 201,
    headers: {
      'Location': `${name}/blobs/uploads/manifest.json`,
      'Content-Length': '0',
      'Docker-Content-Digest': storedDigest
    }
  });
});

router.all('*', () => new Response('Unhandled', { status: 500 }))

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => router.handle(request, env, ctx)
};
