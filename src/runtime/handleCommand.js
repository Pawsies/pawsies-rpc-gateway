
function parseRequest(req) {

  let { params: { subject, lane }, body } = req;

  if (!subject) throw new Error('Command subject missing from params');

  let command = subject.replace(/-/g, '_').toUpperCase();

  let payload = {
    ...body,
    token: req.headers.authorization ? req.headers.authorization.split(' ').pop() : null
  };

  return { command, payload, lane };

}

export default async function (config, state, req, res, next) {

  let { bunyan, reef } = state;

  let log = bunyan.child({ reqId: req.id });

  log.info('start processing command');

  let { command, payload, lane } = parseRequest(req);

  try {

    log.info('triggering reef command', { command, payload, lane });

    const receipt = await reef.execute('pawsies-director', lane, command, payload);

    log.info('reef command executed correctly', { receipt });

		res.send(200, receipt);

    return next();

	} catch(err) {

    log.error(err, 'error while triggering reef command');

    return next(err);

	}

}
