
function parseRequest(req) {

  let { params: { subject, lane }, query } = req;

  if (!subject) throw new Error('Query subject missing from params');

  let queryKey = subject.replace(/-/g, '_').toUpperCase();

  let payload = {
    ...query,
    token: req.headers.authorization ? req.headers.authorization.split(' ').pop() : null
  };

  return { query: queryKey, payload, lane };

}

export default async function (config, state, req, res, next) {

  let { bunyan, reef } = state;

  let log = bunyan.child({ reqId: req.id });

  log.info('handling query');

  let { query, payload, lane } = parseRequest(req);

  try {

    log.info('executing reef query', { query, payload, lane });

    const data = await reef.query('pawsies-director', lane, query, payload);

    log.info('reef query executed correctly');

		res.send(200, data);

    return next();

	} catch(err) {

    log.error(err, 'error while executing reef query');

    return next(err);

	}

}
