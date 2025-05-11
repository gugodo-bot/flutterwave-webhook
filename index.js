const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

const FLW_SECRET_HASH = 'your-flutterwave-secret-hash'; // Replace with your actual secret hash

app.use(bodyParser.json());

app.post('/flutterwave-webhook', (req, res) => {
  const hash = crypto
    .createHmac('sha256', FLW_SECRET_HASH)
    .update(JSON.stringify(req.body))
    .digest('hex');

  const signature = req.headers['verif-hash'];

  if (!signature || signature !== hash) {
    return res.status(401).send('Unauthorized');
  }

  const event = req.body;

  // Handle the payment event here
  if (event.event === 'charge.completed') {
    const payment = event.data;
    const amount = payment.amount;
    const customer = payment.customer.name || payment.customer.email;

    // You can now check the amount and unlock access accordingly
    console.log(`Payment received: ₦${amount} from ${customer}`);
    // TODO: Unlock bot access based on amount
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook running on port ${PORT}`);
});
