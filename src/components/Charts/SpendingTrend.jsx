import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { sortExpensesByDate, formatCurrency } from '../../utils/calculations';
import { ANIMATION_VARIANTS } from '../../utils/constants';
import './Charts.css';

function SpendingTrend({ expenses, currency }) {
  // Group expenses by day
  const dailyData = expenses.reduce((acc, expense) => {
    const date = format(new Date(expense.date), 'MMM dd');
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing.amount += expense.amount;
      existing.count += 1;
    } else {
      acc.push({
        date,
        amount: expense.amount,
        count: 1,
        fullDate: expense.date
      });
    }
    
    return acc;
  }, []);

  // Sort by date
  dailyData.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

  // Take last 14 days
  const recentData = dailyData.slice(-14);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip glass">
          <p className="tooltip-title">{payload[0].payload.date}</p>
          <p className="tooltip-amount">{formatCurrency(payload[0].value, currency.symbol)}</p>
          <p className="tooltip-count">
            {payload[0].payload.count} expense{payload[0].payload.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  if (recentData.length === 0) {
    return (
      <motion.div
        className="card chart-empty"
        variants={ANIMATION_VARIANTS.fadeInUp}
      >
        <div className="empty-state">
          <span className="empty-emoji">📈</span>
          <h3>No spending trend yet</h3>
          <p>Add expenses to see your daily spending pattern!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card chart-container"
      variants={ANIMATION_VARIANTS.fadeInUp}
    >
      <h3 className="chart-title">📈 Daily Spending Trend</h3>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={recentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              stroke="var(--color-border)"
            />
            <YAxis
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              stroke="var(--color-border)"
              tickFormatter={(value) => `${currency.symbol}${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--glass-bg)' }} />
            <Bar
              dataKey="amount"
              fill="var(--color-primary)"
              radius={[8, 8, 0, 0]}
              animationBegin={0}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-stats">
        <div className="chart-stat">
          <span className="stat-label">Total Days</span>
          <span className="stat-value">{recentData.length}</span>
        </div>
        <div className="chart-stat">
          <span className="stat-label">Avg/Day</span>
          <span className="stat-value">
            {formatCurrency(recentData.reduce((sum, d) => sum + d.amount, 0) / recentData.length, currency.symbol)}
          </span>
        </div>
        <div className="chart-stat">
          <span className="stat-label">Highest Day</span>
          <span className="stat-value">
            {formatCurrency(Math.max(...recentData.map(d => d.amount)), currency.symbol)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default SpendingTrend;