import dotenv from 'dotenv';

import { setupStateAsync } from './bootstrap';
import { startGatewayAsync } from './runtime';

async function start() {

	dotenv.load({ silent: true });

	const config = {
		LOG_LEVEL: process.env.LOG_LEVEL || 'info',
		LOG_STREAM: process.stdout,
		AWS_REGION: process.env.AWS_REGION,
		AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID,
		AWS_SECRETACCESSKEY: process.env.AWS_SECRETACCESSKEY,
		REEF_LANE: process.env.REEF_LANE,
		RESTIFY_PORT: process.env.RESTIFY_PORT
	};

	let state = await setupStateAsync(config);

	await startGatewayAsync(config, state);

}

start().catch((err) => {
	console.error(err)
	process.exit();
});
