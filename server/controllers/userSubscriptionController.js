const userSubscriptionService = require('../services/userSubscriptionService');

exports.getAllSubscriptions = async (req, res) => {
  const subscriptions = await userSubscriptionService.getAll();
  res.json(subscriptions);
};

exports.getSubscriptionById = async (req, res) => {
  const subscription = await userSubscriptionService.getById(req.params.id);
  if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
  res.json(subscription);
};

exports.getSubscriptionByUserId = async (req, res) => {
  const userId = req.params.userId;
  const subscription = await userSubscriptionService.getByUserId(userId);
  if (!subscription) return res.status(404).json({ message: 'No active subscription found for this user' });
  res.json(subscription);
};

exports.createSubscription = async (req, res) => {
  const newSub = await userSubscriptionService.create(req.body);
  res.status(201).json(newSub);
};

exports.updateSubscription = async (req, res) => {
  const updated = await userSubscriptionService.update(req.params.id, req.body);
  res.json(updated);
};

exports.deleteSubscription = async (req, res) => {
  await userSubscriptionService.delete(req.params.id);
  res.status(204).send();
};
