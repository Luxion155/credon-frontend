import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

const ROICalculator = () => {
  const [amount, setAmount] = useState('1000');
  const [plan, setPlan] = useState('12');

  const plans = {
    3: { name: '3 Month', roi: 0.4, days: 90 },
    6: { name: '6 Month', roi: 0.6, days: 180 },
    12: { name: '12 Month', roi: 0.8, days: 360 },
    18: { name: '18 Month', roi: 1.0, days: 540 },
    24: { name: '24 Month', roi: 1.5, days: 720 },
    36: { name: '36 Month', roi: 2.0, days: 1080 },
  };

  const selectedPlan = plans[plan];
  const investmentAmount = parseFloat(amount) || 0;
  const dailyProfit = investmentAmount * (selectedPlan.roi / 100);
  const totalProfit = dailyProfit * selectedPlan.days;
  const totalReturn = investmentAmount + totalProfit;

  return (
    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">ROI Calculator</h3>
          <p className="text-sm text-slate-400">Preview your potential returns</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="calc-amount" className="text-slate-300">Investment Amount (US Dollar Tether)</Label>
          <Input
            data-testid="roi-calc-amount-input"
            id="calc-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-slate-800/50 border-slate-700 text-white mt-2"
            placeholder="1000"
          />
        </div>

        <div>
          <Label htmlFor="calc-plan" className="text-slate-300">Investment Plan</Label>
          <Select value={plan} onValueChange={setPlan}>
            <SelectTrigger data-testid="roi-calc-plan-select" className="bg-slate-800/50 border-slate-700 text-white mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {Object.entries(plans).map(([key, p]) => (
                <SelectItem key={key} value={key} className="text-white">
                  {p.name} - {p.roi}% daily
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t border-slate-700 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Daily Profit</span>
            <span className="text-xl font-bold text-amber-400">${dailyProfit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Profit ({selectedPlan.days} days)</span>
            <span className="text-xl font-bold text-green-400">${totalProfit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-700">
            <span className="text-slate-300 font-semibold">Total Return</span>
            <span className="text-2xl font-bold text-green-400">${totalReturn.toFixed(2)}</span>
          </div>
          <div className="text-xs text-slate-500 text-center">
            ROI: {((totalProfit / investmentAmount) * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ROICalculator;