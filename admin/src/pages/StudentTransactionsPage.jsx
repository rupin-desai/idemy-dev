import React, { useState, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Link } from 'react-router-dom';

const StudentTransactionsPage = () => {
  const { 
    getTransactionsByStudentId, 
    studentTransactions, 
    studentIdSearched,
    loading, 
    error 
  } = useTransactions();
  
  const [studentId, setStudentId] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (studentId.trim()) {
      await getTransactionsByStudentId(studentId.trim());
      setShowResults(true);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Student Transactions Tracker</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Search by Student ID</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter Student ID (e.g., STU12345678)"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {showResults && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">
              Transactions for Student: {studentIdSearched}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Found {studentTransactions.length} transaction{studentTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>

          {studentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metadata</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {tx.id.substring(0, 10)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tx.fromAddress || 'Mining Reward'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tx.toAddress.substring(0, 10)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {tx.confirmed ? 'Confirmed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tx.confirmed ? (
                          <Link 
                            to={`/block/${tx.blockIndex}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {tx.blockIndex}
                          </Link>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <details className="cursor-pointer">
                          <summary className="text-blue-600 hover:text-blue-800">View metadata</summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(tx.metadata, null, 2)}
                          </pre>
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-gray-500">No transactions found for this student ID</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentTransactionsPage;