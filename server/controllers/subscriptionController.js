const subscriptionService = require('../services/subscriptionService');

exports.getAllPlans = async (req, res) => {
    try {

              console.log("plans");

        const plans = await subscriptionService.getAllPlans();
        res.json(plans);
        console.log(plans);
    } catch (err) {
        res.status(500).json({ error: 'שגיאה בקבלת חבילות' });
    }
};

exports.registerToSubscription = async (req, res) => {
  const userId = req.user.id;
  const subscriptionId = req.params.subscriptionId;

  try {
    // שליפת פרטי המנוי
    const subscriptionResult= await subscriptionService.getSubscriptionPlanById(subscriptionId);
    console.log(subscriptionResult);
    const duration_days = subscriptionResult.duration_days;

    if (!duration_days||typeof duration_days!== 'number') {
      return res.status(404).json({ message: 'המנוי לא נמצא' });
    }

    // חישוב תאריכים
    const startDate = new Date(); // תאריך נוכחי
    const endDate = new Date(); // יצירת עותק חוקי
    endDate.setDate(startDate.getDate() + duration_days);

    // המרה לפורמט YYYY-MM-DD (MySQL)
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // קריאה לפונקציית הרישום
    await subscriptionService.registerToSubscription(userId, subscriptionId, startDateStr, endDateStr);

    res.status(200).json({ message: 'נרשמת למנוי בהצלחה' });
  } catch (error) {
    console.error('שגיאה בהרשמה:', error);
    res.status(500).json({ message: 'שגיאה בהרשמה' });
  }
};