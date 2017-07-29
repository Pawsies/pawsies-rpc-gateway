import { SqsBrokerFacade, ReefClient } from 'reef-client';

export default async function (config, bunyan) {

	try {

		let brokerFacade = new SqsBrokerFacade({
			region: config.region,
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey,
			clientDomain: config.clientDomain,
			clientLane: config.clientLane
		});

		let client = new ReefClient(brokerFacade);

		client.on('info', info => bunyan.info('reef service info:', info));
		client.on('error', error => bunyan.error('reef service error:', error));
		client.on('warn', warn => bunyan.warn('reef service warn:', warn));

		bunyan.info('setting up reef client');
		await client.setup();

		return client;

	} catch (e) {

		bunyan.error(e, 'error while setting up reef');

	}

}
