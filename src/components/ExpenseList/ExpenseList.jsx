import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { CATEGORIES, ANIMATION_VARIANTS, EMPTY_STATES } from '../../utils/constants';
import { formatCurrency, sortExpensesByDate } from '../../utils/calculations';
import './ExpenseList.css';

function ExpenseList({ expenses, onEdit, onDelete, currency }) {
  const getCategoryInfo = (categoryId) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[0];
  };

  const sortedExpenses = sortExpensesByDate(expenses);

  if (expenses.length === 0) {
    return (
      <motion.div
        className="card expense-list-empty"
        variants={ANIMATION_VARIANTS.fadeInUp}
      >
        <div className="empty-state">
          <span className="empty-emoji">{EMPTY_STATES.NO_EXPENSES.emoji}</span>
          <h3>{EMPTY_STATES.NO_EXPENSES.title}</h3>
          <p>{EMPTY_STATES.NO_EXPENSES.message}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="expense-list-container"
      variants={ANIMATION_VARIANTS.fadeInUp}
    >
      <div className="expense-list-header">
        <h3>📝 Recent Expenses</h3>
        <span className="expense-count">{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="expense-list">
        {sortedExpenses.map((expense, index) => {
          const category = getCategoryInfo(expense.category);
          const formattedDate = format(new Date(expense.date), 'MMM dd, yyyy');

          return (
            <motion.div
              key={expense.id}
              className="expense-item glass"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Category Icon */}
              <div
                className="expense-icon"
                style={{
                  background: `linear-gradient(135deg, ${category.color}, ${category.darkColor})`
                }}
              >
                <span>{category.emoji}</span>
              </div>

              {/* Details */}
              <div className="expense-details">
                <h4 className="expense-description">{expense.description}</h4>
                <div className="expense-meta">
                  <span className="expense-category">{category.name}</span>
                  <span className="expense-separator">•</span>
                  <span className="expense-date">{formattedDate}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="expense-amount-section">
                <div className="expense-amount">
                  {formatCurrency(expense.amount, currency.symbol)}
                </div>
              </div>

              {/* Actions */}
              <div className="expense-actions">
                <button
                  onClick={() => onEdit(expense)}
                  className="btn-action btn-edit"
                  aria-label="Edit expense"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(expense)}
                  className="btn-action btn-delete"
                  aria-label="Delete expense"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default ExpenseList;