import React, { useState } from 'react';
import Header from '../components/Header';

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'charge' | 'topup' | 'refund';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  sessionId?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    userId: 'usr-1',
    userName: 'Admin User',
    type: 'charge',
    amount: -4520,
    date: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed',
    sessionId: 'sess-001',
  },
  {
    id: 'TXN-002',
    userId: 'usr-2',
    userName: 'Test User',
    type: 'topup',
    amount: 10000,
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
  },
  {
    id: 'TXN-003',
    userId: 'usr-2',
    userName: 'Test User',
    type: 'charge',
    amount: -3280,
    date: new Date(Date.now() - 172800000).toISOString(),
    status: 'completed',
    sessionId: 'sess-002',
  },
  {
    id: 'TXN-004',
    userId: 'usr-1',
    userName: 'Admin User',
    type: 'topup',
    amount: 20000,
    date: new Date(Date.now() - 259200000).toISOString(),
    status: 'completed',
  },
  {
    id: 'TXN-005',
    userId: 'usr-3',
    userName: 'New User',
    type: 'topup',
    amount: 5000,
    date: new Date(Date.now() - 345600000).toISOString(),
    status: 'pending',
  },
];

const Transactions: React.FC = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [typeFilter, setTypeFilter] = useState<'all' | 'charge' | 'topup' | 'refund'>('all');

  const filteredTransactions = transactions.filter((txn) => {
    if (typeFilter === 'all') return true;
    return txn.type === typeFilter;
  });

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'charge':
        return '#ef4444';
      case 'topup':
        return '#10b981';
      case 'refund':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'topup' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCharges = transactions
    .filter((t) => t.type === 'charge' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div style={styles.container}>
      <Header title="Transactions" />

      <div style={styles.summaryCards}>
        <div style={styles.summaryCard}>
          <span style={styles.summaryIcon}>💰</span>
          <div>
            <p style={styles.summaryLabel}>Total Top-ups</p>
            <p style={styles.summaryValue}>{totalIncome.toLocaleString()} AMD</p>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <span style={styles.summaryIcon}>⚡</span>
          <div>
            <p style={styles.summaryLabel}>Total Charges</p>
            <p style={styles.summaryValue}>{totalCharges.toLocaleString()} AMD</p>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <span style={styles.summaryIcon}>📊</span>
          <div>
            <p style={styles.summaryLabel}>Net Revenue</p>
            <p style={styles.summaryValue}>{(totalIncome - totalCharges).toLocaleString()} AMD</p>
          </div>
        </div>
      </div>

      <div style={styles.filters}>
        {(['all', 'charge', 'topup', 'refund'] as const).map((type) => (
          <button
            key={type}
            style={{
              ...styles.filterButton,
              ...(typeFilter === type ? styles.filterButtonActive : {}),
            }}
            onClick={() => setTypeFilter(type)}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Transaction ID</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} style={styles.emptyRow}>
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => (
                <tr key={txn.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <span style={styles.txnId}>{txn.id}</span>
                    {txn.sessionId && (
                      <span style={styles.sessionLink}>
                        Session: {txn.sessionId}
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>{txn.userName}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.typeBadge,
                      backgroundColor: `${getTypeColor(txn.type)}20`,
                      color: getTypeColor(txn.type),
                    }}>
                      {txn.type}
                    </span>
                  </td>
                  <td style={{
                    ...styles.td,
                    color: txn.amount > 0 ? '#10b981' : '#ef4444',
                    fontWeight: '600',
                  }}>
                    {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()} AMD
                  </td>
                  <td style={styles.td}>
                    {new Date(txn.date).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(txn.status),
                    }}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '0 30px 30px',
  },
  summaryCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '20px',
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  summaryIcon: {
    fontSize: '32px',
  },
  summaryLabel: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
  },
  summaryValue: {
    margin: '4px 0 0 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  filterButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#374151',
  },
  emptyRow: {
    padding: '40px 16px',
    textAlign: 'center',
    color: '#6b7280',
  },
  txnId: {
    display: 'block',
    fontWeight: '500',
    color: '#111827',
  },
  sessionLink: {
    display: 'block',
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  typeBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'white',
    textTransform: 'capitalize',
  },
};

export default Transactions;
