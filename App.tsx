
import React, { useState, useEffect, useCallback } from 'react';
import { RowData, SpreadsheetState } from './types';
import Grid from './components/Grid';
import AIControlPanel from './components/AIControlPanel';
import QuickEntryForm from './components/QuickEntryForm';
import { generateInvoicePDF, shareToWhatsApp } from './services/pdfService';

const App: React.FC = () => {
  const [state, setState] = useState<SpreadsheetState>({
    columns: [],
    data: [],
  });
  const [lastMessage, setLastMessage] = useState<{ text: string, billNo?: string, file?: File | null } | null>(null);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [showManualDateTime, setShowManualDateTime] = useState(false);

  useEffect(() => {
    const initialColumns = ['Bill Number', 'Date', 'Time', 'Vehicle No', 'Dealer Name', 'Location', 'GST Number', 'Item Name', 'HSN', 'Quantity', 'Price'];
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
      setLastMessage({ text: message });
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
    setLastMessage({ text: "Record removed" });
    setTimeout(() => setLastMessage(null), 3000);
  }, []);

  const handleQuickAdd = async (newRows: RowData[]) => {
    if (newRows.length === 0) return;
    const billNumber = newRows[0]['Bill Number'];
    
    setState(prev => ({
      ...prev,
      data: [...newRows, ...prev.data]
    }));
    
    const combinedData = [...newRows, ...state.data];
    const pdfFile = await generateInvoicePDF(billNumber, combinedData);

    setLastMessage({ 
      text: "Invoice ready for bill " + billNumber, 
      billNo: billNumber, 
      file: pdfFile 
    });
    setTimeout(() => setLastMessage(null), 8000);
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
          
          <button 
            onClick={() => setShowManualDateTime(!showManualDateTime)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              showManualDateTime 
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-inner' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${showManualDateTime ? 'text-blue-600' : 'text-slate-400'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Adjust Date
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          
          <button onClick={exportCSV} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-100">
            Export Records
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <section className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-50 relative scroll-smooth">
          <QuickEntryForm onAdd={handleQuickAdd} showManualDateTime={showManualDateTime} />

          <div className="flex items-center justify-end mb-4 no-print shrink-0">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-slate-100">
              {state.data.length} Billing Records
            </div>
          </div>

          <div className="flex-1 min-h-[400px] lg:min-h-0 relative">
            <Grid columns={state.columns} data={state.data} onCellEdit={handleCellEdit} onRowDelete={handleRowDelete} />
            
            {lastMessage && (
              <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-6 fade-in duration-500">
                <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notification</span>
                    <span className="text-sm font-semibold">{lastMessage.text}</span>
                  </div>
                  {lastMessage.file && (
                    <button 
                      onClick={() => shareToWhatsApp(lastMessage.file!, lastMessage.billNo!)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.626 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Send to WhatsApp
                    </button>
                  )}
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
          <span>ASHA FAN INDUSTRIES® PDF Engine v8.2</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
