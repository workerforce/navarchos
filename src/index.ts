import router from './router';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		console.log('Received:', request.url)
		return router.handle(request, env);
	},
};
