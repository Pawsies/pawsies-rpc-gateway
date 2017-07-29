import {
	createServer,
	acceptParser,
	queryParser,
	bodyParser,
	CORS,
	fullResponse,
	auditLogger,
	MethodNotAllowedError
} from 'restify';

export default function (config, bunyan) {

	let { port, domain } = config;
	let server = createServer({ name: domain });

	server.use(acceptParser(server.acceptable));
    server.use(queryParser());
    server.use(bodyParser());
    server.pre(CORS({
        origins: ['*'],
        credentials: true,
        headers: ['X-Requested-With', 'Authorization']
    }));
    server.pre(fullResponse());
    server.on('MethodNotAllowed', (req, res) => {
        if (req.method.toLowerCase() === 'options') {
            var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With', 'Authorization'];
            if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
            res.header('Access-Control-Allow-Methods', res.methods.join(', '));
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            return res.send(200);
        } else {
            return res.send(new MethodNotAllowedError());
        }
    });

	server.on('after', auditLogger({ log: bunyan }));

	return server;

}
