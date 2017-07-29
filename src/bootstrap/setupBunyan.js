import bunyan from 'bunyan';

export default function (config) {

	return bunyan.createLogger({
		name: config.domain,
		level: config.level || 'info',
		stream: config.stdout,
		serializers : bunyan.stdSerializers
	});

}
