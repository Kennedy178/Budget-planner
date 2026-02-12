import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { calculateCategoryTotals, formatCurrency } from '../../utils/calculations';
import { ANIMATION_VARIANTS } from '../../utils/constants';
import './Charts.css';

function CategoryChart({ expenses, currency }) {
  const categoryData = calculateCategoryTotals(expenses);

  // Transform for Recharts
  const chartData = categoryData.map(cat => ({
    name: cat.name,
    value: cat.total,
    color: cat.color,
    emoji: cat.emoji,
    count: cat.count
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip glass">
          <div className="tooltip-header">
            <span className="tooltip-emoji">{data.emoji}</span>
            <span className="tooltip-title">{data.name}</span>
          </div>
          <div className="tooltip-body">
            <p className="tooltip-amount">{formatCurrency(data.value, currency.symbol)}</p>
            <p className="tooltip-count">{data.count} expense{data.count !== 1 ? 's' : ''}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for tiny slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{
          fontSize: '14px',
          fontWeight: '600',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (chartData.length === 0) {
    return (
      <motion.div
        className="card chart-empty"
        variants={ANIMATION_VARIANTS.fadeInUp}
      >
        <div className="empty-state">
          <span className="empty-emoji">📊</span>
          <h3>No spending data yet</h3>
          <p>Add your first expense to see the breakdown!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card chart-container"
      variants={ANIMATION_VARIANTS.fadeInUp}
    >
      <h3 className="chart-title">💸 Spending by Category</h3>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Legend with amounts */}
      <div className="category-legend">
        {chartData.map((cat, index) => (
          <motion.div
            key={index}
            className="legend-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="legend-indicator" style={{ backgroundColor: cat.color }} />
            <span className="legend-emoji">{cat.emoji}</span>
            <span className="legend-name">{cat.name}</span>
            <span className="legend-amount">{formatCurrency(cat.value, currency.symbol)}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default CategoryChart;