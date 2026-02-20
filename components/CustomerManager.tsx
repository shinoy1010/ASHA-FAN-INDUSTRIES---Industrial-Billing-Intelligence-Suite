
import React from 'react';
import { Dealer } from '../types';

interface CustomerManagerProps {
  dealers: Dealer[];
  onUpdateDealer: (index: number, field: keyof Dealer, value: string) => void;
  onManageDrive: () => void;
  onSync: () => void;
  isSyncing: boolean;
  onBack: () => void;
}

const CustomerManager: React.FC<CustomerManagerProps> = ({ 
  dealers, 
  onUpdateDealer, 
  onManageDrive, 
  onSync,
  isSyncing,
  onBack 
}) => {
  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
            title="Go back to Billing"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-slate-900">Customer Directory</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
              isSyncing 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm'
            }`}
            title="Fetch master list from Google Drive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            {isSyncing ? 'Syncing...' : 'Sync from Drive'}
          </button>

          <button 
            onClick={onManageDrive}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Manage in Google Sheets
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {isSyncing && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center gap-3 animate-pulse">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
              <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">Retrieving Master List...</span>
            </div>
          )}
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-12">#</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[250px]">Customer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location / Address</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-64">GST Number</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {dealers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                      No customers found. Try "Sync from Drive".
                    </td>
                  </tr>
                ) : (
                  dealers.map((dealer, idx) => (
                    <tr key={`${dealer.name}-${idx}`} className="hover:bg-blue-50/30 transition-colors group animate-in slide-in-from-top-1 duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-400 text-center">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap p-0 border-r border-slate-100">
                        <input 
                          type="text" 
                          value={dealer.name}
                          placeholder="Enter Customer Name..."
                          onChange={(e) => onUpdateDealer(idx, 'name', e.target.value)}
                          className="w-full h-full px-6 py-4 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold text-slate-900 placeholder:text-slate-300"
                        />
                      </td>
                      <td className="px-6 py-2 p-0 border-r border-slate-100">
                        <input 
                          type="text" 
                          value={dealer.location}
                          placeholder="Enter Location..."
                          onChange={(e) => onUpdateDealer(idx, 'location', e.target.value)}
                          className="w-full h-full px-6 py-4 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm text-slate-600 placeholder:text-slate-300"
                        />
                      </td>
                      <td className="px-6 py-2 p-0">
                        <input 
                          type="text" 
                          value={dealer.gst}
                          placeholder="Enter GSTIN..."
                          onChange={(e) => onUpdateDealer(idx, 'gst', e.target.value)}
                          className="w-full h-full px-6 py-4 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-mono text-indigo-700 placeholder:text-slate-300 uppercase"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 font-medium italic">Master list source: Google Drive. Click 'Manage in Google Sheets' to add or delete records permanently.</p>
            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Cloud Synced via Asha Cloud v10.5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManager;
