
import React, { useState, useEffect, useCallback } from 'react';
import { RowData, SpreadsheetState } from './types';
import Grid from './components/Grid';
import AIControlPanel from './components/AIControlPanel';
import QuickEntryForm from './components/QuickEntryForm';
import { generateInvoicePDF } from './services/pdfService';

const App: React.FC = () => {
  const [state, setState] = useState<SpreadsheetState>({
    columns: [],
    data: [],
  });
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  useEffect(() => {
    const initialColumns = ['Bill Number', 'Date', 'Time', 'Vehicle No', 'Dealer Name', 'Location', 'GST Number', 'Item Name', 'HSN', 'Quantity', 'Price'];
    
    // Helper to get current IST formatted date and time for initial state
    const now = new Date();
    const istDate = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const istTime = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });

    const initialData: RowData[] = [
      { 
        'Bill Number': 'AFI-0377', 
        'Date': istDate,
        'Time': istTime,
        'Vehicle No': 'HR67D0177', 
        'Dealer Name': 'SATGURU KRIPA ENTERPRISES', 
        'Location': 'SANOLI ROAD PANIPAT', 
        'GST Number': '06ANJPM8264E1ZT', 
        'Item Name': 'Pedestal Base, Pipe, Blade', 
        'HSN': '8414', 
        'Quantity': '40', 
        'Price': '600' 
      }
    ];
    setState({ columns: initialColumns, data: initialData });
  }, []);

  const handleUpdateData = useCallback((updatedData: RowData[], message: string) => {
    if (updatedData.length > 0) {
      const allCols = new Set<string>();
      updatedData.forEach(row => Object.keys(row).forEach(k => allCols.add(k)));
      
      setState({
        columns: Array.from(allCols),
        data: updatedData,
      });
      setLastMessage(message);
      setTimeout(() => setLastMessage(null), 5000);
    }
  }, []);

  const handleCellEdit = useCallback((rowIndex: number, column: string, value: any) => {
    setState(prev => {
      const newData = [...prev.data];
      newData[rowIndex] = { ...newData[rowIndex], [column]: value };
      return { ...prev, data: newData };
    });
  }, []);

  const handleRowDelete = useCallback((rowIndex: number) => {
    setState(prev => ({
      ...prev,
      data: prev.data.filter((_, i) => i !== rowIndex)
    }));
    setLastMessage("Record removed");
    setTimeout(() => setLastMessage(null), 3000);
  }, []);

  const handleQuickAdd = async (newRows: RowData[]) => {
    if (newRows.length === 0) return;
    
    // Update state using a functional update to ensure we have the very latest data for PDF generation
    setState(prev => {
      const updatedData = [...newRows, ...prev.data];
      
      // We generate the PDF using the exact combined data we are about to set
      const billNumber = newRows[0]['Bill Number'];
      generateInvoicePDF(billNumber, updatedData).catch(err => {
        console.error("PDF generation failed after quick add:", err);
      });

      return {
        ...prev,
        data: updatedData
      };
    });
    
    setLastMessage("Bill generated and added to queue");
    setTimeout(() => setLastMessage(null), 3000);
  };

  const exportCSV = () => {
    if (state.columns.length === 0) return;
    const headerRow = state.columns.join(',');
    const dataRows = state.data.map(row => 
      state.columns.map(col => `"${(row[col] ?? '').toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([`${headerRow}\n${dataRows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ashafan_billing_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row items-center justify-between shrink-0 z-10 shadow-sm gap-4 no-print">
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex gap-0.5">
            {['A', 'S', 'H', 'A'].map((char, i) => (
              <div key={i} className="w-10 h-10 bg-[#E31E24] flex items-center justify-center text-white font-black text-2xl select-none">
                {char === 'S' ? <span className="font-mono scale-x-125">S</span> : char}
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight uppercase">ASHA FAN INDUSTRIES</h1>
            <p className="text-xs text-slate-500 font-medium italic">Industrial Billing & Intelligence Suite</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <button 
            onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              isAiPanelOpen 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-inner' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isAiPanelOpen ? 'text-indigo-600' : 'text-slate-400'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            AI Assistant
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button onClick={exportCSV} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-100">
            Export Records
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <section className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-50 relative scroll-smooth">
          <QuickEntryForm onAdd={handleQuickAdd} />

          <div className="flex items-center justify-end mb-4 no-print shrink-0">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-slate-100">
              {state.data.length} Billing Records
            </div>
          </div>

          <div className="flex-1 min-h-[400px] lg:min-h-0 relative">
            <Grid columns={state.columns} data={state.data} onCellEdit={handleCellEdit} onRowDelete={handleRowDelete} />
            {lastMessage && (
              <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="bg-slate-900 text-white px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-widest">{lastMessage}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {isAiPanelOpen && (
          <aside className="w-full lg:w-96 border-l border-slate-200 bg-white shadow-2xl no-print animate-in slide-in-from-right duration-300 flex flex-col relative shrink-0">
            <button 
              onClick={() => setIsAiPanelOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md z-20"
              title="Close panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <AIControlPanel state={state} onUpdateData={handleUpdateData} />
          </aside>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 px-6 py-2.5 flex flex-col md:flex-row items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] no-print shrink-0">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#E31E24]"></div>
            Industrial Billing Active
          </span>
          <span className="hidden md:inline text-slate-200">|</span>
          <span>ASHA FAN INDUSTRIES® PDF Engine v5.1</span>
        </div>
        <div className="flex items-center gap-6 mt-2 md:mt-0">
          <span>Enterprise Grade Security</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
