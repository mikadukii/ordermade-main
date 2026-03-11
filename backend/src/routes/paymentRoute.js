const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
app.post('/create-payment-intent', authenticateToken, async (req, res) => {
  const { amount, orderId } = req.body;

  if (!amount || !orderId) {
    return res.status(400).json({ message: 'Amount and Order ID required' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: 'usd',
      metadata: { orderId },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ message: 'Payment failed', error: err.message });
  }
});
