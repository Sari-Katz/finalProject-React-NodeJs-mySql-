const userSubscriptionService = require('../services/userSubscriptionService');

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await userSubscriptionService.getAll();
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.getSubscriptionByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = await userSubscriptionService.getActiveByUserId(userId);
    const isActive = !!subscription;
    res.json({ isActive });
  } catch (error) {
    console.error('Error checking active subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const newSub = await userSubscriptionService.create(req.body);
    res.status(201).json(newSub);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const updated = await userSubscriptionService.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    await userSubscriptionService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
