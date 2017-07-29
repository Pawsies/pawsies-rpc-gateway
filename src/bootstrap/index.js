import setupBunyan from './setupBunyan';
import setupReefAsync from './setupReefAsync';
import setupRestify from './setupRestify';

export async function setupStateAsync(config) {

	let bunyan = setupBunyan({
		domain: 'pawsies-rpc-gateway',
		level: config.LOG_LEVEL || 'info',
		stream: config.stdout
	});

	let reef = await setupReefAsync({
		region: config.AWS_REGION,
		accessKeyId: config.AWS_ACCESSKEYID,
		secretAccessKey: config.AWS_SECRETACCESSKEY,
		clientDomain: 'pawsies-rpc-gateway',
		clientLane: config.REEF_LANE
	}, bunyan);

	let restify = setupRestify({
		domain: 'pawsies-rpc-gateway',
		port: config.RESTIFY_PORT
	}, bunyan);

	return { bunyan, reef, restify };

}
