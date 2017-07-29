import curry from 'curry';
import handleQuery from './handleQuery';
import handleCommand from './handleCommand';

export default async function (config, state) {

	let { RESTIFY_PORT } = config;
	let { reef, restify, bunyan } = state;

	bunyan.info('starting up reef client');

	await reef.start();

	bunyan.info('hooking restify middleware');

	restify.get(
		'/:lane/:subject',
		curry(handleQuery)(config, state)
	);

	restify.post(
		'/:lane/:subject',
		curry(handleCommand)(config, state)
	);

	bunyan.info('listening via restify', { RESTIFY_PORT });

	restify.listen(RESTIFY_PORT);

}
