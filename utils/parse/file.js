const { Readable } = require('stream');

const _readFile = async (request, response, product) => {
  const _files = Array.from({ length: 10 }, (v, i) => product.get(`partial${i}`));
  const _data = await Promise.all(_files.map((f) => f.getData()));
  const _buffer = Buffer.concat(_data.map(d => Buffer.from(d, "base64")));
  const _size = product.get("size");
  
  if (product.get("ext") === "mov") {
    const _range = request.headers.range;
    if (!_range) { throw new Error("Download is not permitted"); }

    const _chunkSize = 10 ** 6;
    const _start = Number(_range.replace(/\D/g, ""));
    const _end = Math.min(_start + _chunkSize, _size - 1);

    response.set({
      "Content-Range": `bytes ${_start}-${_end}/${_size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": (_end - _start + 1),
      "Content-Type": "video/quicktime"
    });
    response.status(206);

    const _stream = Readable.from(_buffer.slice(_start, _end + 1));
    return _stream.pipe(response);
  } else if (product.get("ext") === "pdf") {
    response.set({
      "Content-Length": _size,
      "Content-Disposition": `inline; filename="${product.id}"`,
      "Content-Type": "application/pdf"
    });
    response.status(200);

    const _stream = Readable.from(_buffer);
    return _stream.pipe(response);
  }

  return response.status(200).send(_buffer);
};

app.get('/file/:id', async (request, response) => {
  const _productId = request.params.id;
  const _token = request.query.sessionToken;

  console.log(`ProductId = ${_productId}`);
  console.log(`Token = ${_token}`);
  
  try {
    Parse.User.enableUnsafeCurrentUser();
    const _user = await Parse.User.become(_token);
    if (!_user) { throw new Error("Unauthorized"); }
    console.log(`${_user.id} user is found`);

    if (_user.expiredDate === 0 || (new Date()).valueOf() >= _user.get("expiredDate")) { throw new Error("Expired"); }

    const _query = new Parse.Query("Product");
    _query.equalTo("objectId", _productId);
    console.log(`Product query ...`);

    const _product = await _query.first({ sessionToken: _token });

    if (!_product) { throw new Error("Product not found"); }
    console.log(`${_product.id} product is found`);
    
    return await _readFile(request, response, _product);
  } catch (error) {
    console.error(error);
    response.type('html');
    response.status(400).send(`<p>${error.message}</p>`);
  }
});

/*
app.post('/webhook', bodyParser.raw({type: 'application/json'}), async (request, response) => {
  console.log("Webhook - Stripe Payment Intent Detected ... ");  
  const sig = request.headers['stripe-signature'];

  try {
    console.log("Webhook - Process Stripe Payment Intent ... ");
    const event = stripe.webhooks.constructEvent(request.body, sig, STRIPE_WEBHOOK_SECRET_KEY);
    console.log(`Webhook - Payment Intent Type = ${event.type} ... `);
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log(`Webhook [${event.type}] - Cachc In Database ... `);        
        const _paymentIntent = event.data.object;
        console.log(JSON.stringify(_paymentIntent));

        const Transaction = Parse.Object.extend("Transaction");
        const TransactionItem = Parse.Object.extend("TransactionItem");
        const Product = Parse.Object.extend("Product");
        const _tiQuery = new Parse.Query(TransactionItem);
        const _tis = await _tiQuery.equalTo("pi", _paymentIntent.id).find({ useMasterKey: true });
        const _t = new Transaction();
        const _acl = new _Parse.ACL();
        _acl.setPublicReadAccess(false);
        _acl.setPublicWriteAccess(false);

        _t.setACL(_acl);
        _t("items").add(_tis);
        _t.set("pi", _paymentIntent.id);
        _t.set("paymentIntent", _paymentIntent);
        await _t.save(null, { useMasterKey: true });

        let _products = _tis.map(ti => Product.createWithoutData(ti.get("productId")));
        _products = await Product.fetchAll(_products, { useMasterKey: true });
        _products.forEach(prod => prod.increment("rating", 1));
        await Product.saveAll(_products, { useMasterKey: true });
        
        console.log(`Webhook [${event.type}] - Complete Cachcing ... `);          
        break;
      default:
        console.log(`Webhook - Unhandled Event Type ${event.type} ... `);
    }
  } catch (error) {
    console.error(error);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});
*/