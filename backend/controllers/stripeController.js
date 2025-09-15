// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { User } = require('../models');

const createCheckoutSession = async (req, res) => {
  try {
    // For demo purposes, simulate upgrade without Stripe
    const user = await User.findByPk(req.user.id);
    await user.update({
      role: 'premium',
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    res.json({ 
      message: 'Demo upgrade successful',
      url: `${process.env.FRONTEND_URL}/stripe/success`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium(),
        subscriptionEnd: user.subscriptionEnd
      }
    });
  } catch (error) {
    console.error('Demo upgrade error:', error);
    res.status(500).json({ error: 'Failed to upgrade account' });
  }
};

const handleSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      
      const user = await User.findByPk(req.user.id);
      await user.update({
        role: 'premium',
        subscriptionStart: new Date(subscription.current_period_start * 1000),
        subscriptionEnd: new Date(subscription.current_period_end * 1000)
      });

      res.json({ 
        message: 'Subscription activated successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isPremium: user.isPremium(),
          subscriptionEnd: user.subscriptionEnd
        }
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Stripe success error:', error);
    res.status(500).json({ error: 'Failed to process subscription' });
  }
};

const handleCancel = (req, res) => {
  res.json({ message: 'Subscription cancelled' });
};

const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        if (customer.metadata.userId) {
          const user = await User.findByPk(customer.metadata.userId);
          if (user) {
            const isActive = subscription.status === 'active';
            await user.update({
              role: isActive ? 'premium' : 'free',
              subscriptionStart: isActive ? new Date(subscription.current_period_start * 1000) : null,
              subscriptionEnd: isActive ? new Date(subscription.current_period_end * 1000) : null
            });
          }
        }
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

module.exports = {
  createCheckoutSession,
  handleSuccess,
  handleCancel,
  webhook
};