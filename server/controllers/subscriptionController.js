const subscriptionService = require('../services/subscriptionService');

exports.getAllPlans = async (req, res) => {
    try {
       const plans = await subscriptionService.getAllPlans();
        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: 'שגיאה בקבלת חבילות' });
    }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSubscriptionByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = await subscriptionService.getActiveByUserId(userId);
    const isActive = !!subscription;
    res.json({ isActive });
  } catch (error) {
    console.error('Error checking active subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.registerToSubscription = async (req, res) => {
  const userId = req.user.id;
  const subscriptionId = req.params.subscriptionId;

  try {
    const subscriptionResult= await subscriptionService.getSubscriptionPlanById(subscriptionId);
    const duration_days = subscriptionResult.duration_days;
    if (!duration_days||typeof duration_days!== 'number') {
      return res.status(404).json({ message: 'המנוי לא נמצא' });
    }
    // חישוב תאריכים
    const startDate = new Date(); // תאריך נוכחי
    const endDate = new Date(); // יצירת עותק חוקי
    endDate.setDate(startDate.getDate() + duration_days);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    await subscriptionService.registerToSubscription(userId, subscriptionId, startDateStr, endDateStr);

    res.status(200).json({ message: 'נרשמת למנוי בהצלחה' });
  } catch (error) {
    console.error('שגיאה בהרשמה:', error);
    res.status(500).json({ message: 'שגיאה בהרשמה' });
  }
};