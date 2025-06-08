const subscriptionPlanService = require('../services/subscriptionPlanService');

exports.getAllPlans = async (req, res) => {
    try {
        const plans = await subscriptionPlanService.getAllPlans();
        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: 'שגיאה בקבלת חבילות' });
    }
};

exports.getPlanById = async (req, res) => {
   
    try {
        const plan = await subscriptionPlanService.getPlanById(req.params.id);
        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: 'שגיאה בקבלת חבילה' });
    }
};

exports.createPlan = async (req, res) => {
    if  (req.user?.role !== 'admin'){
        return res.status(403).json({ error: 'גישה נדחתה - רק מנהלים רשאים' });
    }
    try {
        const newPlan = await subscriptionPlanService.createPlan(req.body);
        res.status(201).json(newPlan);
    } catch (err) {
        res.status(500).json({ error: 'שגיאה ביצירת חבילה' });
    }
};

exports.updatePlan = async (req, res) => {
   if (req.user?.role !== 'admin')
{
        return res.status(403).json({ error: 'גישה נדחתה - רק מנהלים רשאים' });
    }
    try {
        const updated = await subscriptionPlanService.updatePlan(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'שגיאה בעדכון חבילה' });
    }
};

exports.deletePlan = async (req, res) => {
if (req.user?.role !== 'admin'){
        return res.status(403).json({ error: 'גישה נדחתה - רק מנהלים רשאים' });
    }
    try {
        await subscriptionPlanService.deletePlan(req.params.id);
        res.json({ message: 'חבילה נמחקה' });
    } catch (err) {
        res.status(500).json({ error: 'שגיאה במחיקת חבילה' });
    }
};
