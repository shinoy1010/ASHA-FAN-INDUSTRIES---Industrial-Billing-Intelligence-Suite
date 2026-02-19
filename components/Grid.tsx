import React from 'react';
import { RowData } from '../types';
import { generateInvoicePDF } from '../services/pdfService';

interface GridProps {
  columns: string[];
  data: RowData[];
  onCellEdit: (rowIndex: number, column: string, value: any) => void;
  onRowDelete: (rowIndex: number) => void;
}

const Grid: React.FC<GridProps> = ({ columns, data, onCellEdit, onRowDelete }) => {
  if (columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl bg-white text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium">Your data will appear here</p>
        <p className="text-sm">Upload a CSV or use the Quick Entry form</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white mb-8">
      <table className="min-w-full divide-y divide-slate-200 border-collapse">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-200 w-12">#</th>
            {columns.map((col) => (
              <th
                key={col}
                className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-200 min-w-[150px]"
              >
                {col}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider sticky right-0 bg-slate-50 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)]">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50 transition-colors group">
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-400 border-r border-slate-200 text-center">
                {rowIndex + 1}
              </td>
              {columns.map((col) => (
                <td key={col} className="px-6 py-2 whitespace-nowrap text-sm text-slate-700 border-r border-slate-200 p-0">
                  <input
                    type="text"
                    className="w-full h-full px-2 py-2 bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                    value={row[col] ?? ''}
                    onChange={(e) => onCellEdit(rowIndex, col, e.target.value)}
                  />
                </td>
              ))}
              <td className="px-4 py-2 whitespace-nowrap text-right sticky right-0 bg-white group-hover:bg-slate-50 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)] transition-colors">
                <div className="flex items-center gap-1 justify-end">
                  <button 
                    onClick={async () => await generateInvoicePDF(row['Bill Number'], data)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
                    title="Generate Multi-Item Invoice PDF"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF
                  </button>
                  <button 
                    onClick={() => onRowDelete(rowIndex)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;
