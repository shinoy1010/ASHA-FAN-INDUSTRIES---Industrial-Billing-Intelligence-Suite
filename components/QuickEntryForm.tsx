
import React, { useState } from 'react';
import { Dealer, Item, RowData } from '../types';

interface ItemEntry {
  itemIdx: string;
  quantity: string;
  price: string;
}

interface QuickEntryFormProps {
  onAdd: (rows: RowData[]) => void;
  showManualDateTime?: boolean;
  dealers: Dealer[];
}

const ITEMS: Item[] = [
  { name: 'Pedestal Base, Pipe, Blade', hsn: '8414', defaultPrice: 600 },
  { name: 'Madhani 5kg', hsn: '8414' },
  { name: 'Madhani 20kg', hsn: '8414' },
  { name: 'Pedestal Fan', hsn: '8414' },
  { name: 'Pedestal Fan without Jaal', hsn: '8414' },
  { name: 'Ceiling Fan', hsn: '8414' },
  { name: 'Air Cooler', hsn: '8479' },
  { name: 'Room Heater', hsn: '8516' }
].sort((a, b) => a.name.localeCompare(b.name));

const QuickEntryForm: React.FC<QuickEntryFormProps> = ({ onAdd, showManualDateTime = false, dealers }) => {
  const [dealerIdx, setDealerIdx] = useState<string>('');
  const [billNo, setBillNo] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState('');
  
  const [entries, setEntries] = useState<ItemEntry[]>([
    { itemIdx: '', quantity: '', price: '' }
  ]);

  const handleAddItemRow = () => {
    setEntries(prev => [...prev, { itemIdx: '', quantity: '', price: '' }]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (entries.length > 1) {
      setEntries(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateEntry = (index: number, field: keyof ItemEntry, value: string) => {
    setEntries(prev => {
      const newEntries = [...prev];
      newEntries[index] = { ...newEntries[index], [field]: value };
      
      if (field === 'itemIdx' && value !== '') {
        const item = ITEMS[parseInt(value)];
        newEntries[index].price = item.defaultPrice?.toString() || '';
      }
      
      return newEntries;
    });
  };

  const handleAddRecord = () => {
    if (dealerIdx === '' || !billNo) {
      alert("Please select a customer and enter a bill number.");
      return;
    }

    const validEntries = entries.filter(e => e.itemIdx !== '' && e.quantity && e.price);
    
    if (validEntries.length === 0) {
      alert("Please select at least one item and provide quantity/price.");
      return;
    }
    
    const dealer = dealers[parseInt(dealerIdx)];
    const cleanedBillNo = billNo.trim();
    const formattedBillNo = cleanedBillNo.toUpperCase().startsWith('AFI-0') 
      ? cleanedBillNo 
      : `AFI-0${cleanedBillNo}`;

    const now = new Date();
    const currentIstDate = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const currentIstTime = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });

    let finalDate = manualDate;
    if (!finalDate) {
      finalDate = currentIstDate;
    } else if (showManualDateTime) {
      const dParts = finalDate.split('-');
      if (dParts.length === 3 && dParts[0].length === 4) {
        finalDate = `${dParts[2]}-${dParts[1]}-${dParts[0]}`;
      }
    }

    let finalTime = manualTime;
    if (!finalTime) {
      finalTime = currentIstTime;
    } else if (showManualDateTime) {
      const [hours, minutes] = finalTime.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'pm' : 'am';
      const h12 = h % 12 || 12;
      finalTime = `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }

    const newRows: RowData[] = validEntries.map(entry => {
      const item = ITEMS[parseInt(entry.itemIdx)];
      return {
        'Bill Number': formattedBillNo,
        'Date': finalDate,
        'Time': finalTime,
        'Dealer Name': dealer.name,
        'Location': dealer.location,
        'GST Number': dealer.gst,
        'Item Name': item.name,
        'HSN': item.hsn,
        'Quantity': entry.quantity,
        'Price': entry.price,
        'Vehicle No': vehicleNo.trim() || 'HR67D0177'
      };
    });

    onAdd(newRows);

    setBillNo('');
    setDealerIdx('');
    setVehicleNo('');
    setManualDate('');
    setManualTime('');
    setEntries([{ itemIdx: '', quantity: '', price: '' }]);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Industrial Invoice Entry
        </h3>
        <span className="text-[10px] font-bold text-slate-400">ASHA FAN INDUSTRIES SYSTEM</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            value={dealerIdx}
            onChange={(e) => setDealerIdx(e.target.value)}
          >
            <option value="">Select Customer</option>
            {dealers.map((d, i) => (
              <option key={i} value={i}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bill No (Auto: AFI-0)</label>
          <input 
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. 377"
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle No</label>
          <input 
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Default: HR67D0177"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
          />
        </div>

        {showManualDateTime && (
          <>
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date (Manual)</label>
              <input 
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
              />
              <p className="text-[9px] text-slate-400 italic">Leave empty for today (IST)</p>
            </div>

            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time (Manual)</label>
              <input 
                type="time"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
              />
              <p className="text-[9px] text-slate-400 italic">Leave empty for current (IST)</p>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">Bill Items</h4>
          <button 
            onClick={handleAddItemRow}
            className="text-[10px] text-indigo-600 font-bold uppercase hover:underline flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>

        {entries.map((entry, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 bg-slate-50/50 border border-slate-100 rounded-xl relative group animate-in slide-in-from-top-2 duration-300">
            <div className="md:col-span-6 space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Item Description</label>
              <select 
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                value={entry.itemIdx}
                onChange={(e) => updateEntry(idx, 'itemIdx', e.target.value)}
              >
                <option value="">Select Item</option>
                {ITEMS.map((item, i) => (
                  <option key={i} value={i}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Qty</label>
              <input 
                type="number"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 text-center"
                value={entry.quantity}
                onChange={(e) => updateEntry(idx, 'quantity', e.target.value)}
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Price (₹)</label>
              <input 
                type="number"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                value={entry.price}
                placeholder="0.00"
                onChange={(e) => updateEntry(idx, 'price', e.target.value)}
              />
            </div>

            <div className="md:col-span-1 flex justify-center pb-0.5">
              <button 
                onClick={() => handleRemoveItemRow(idx)}
                className={`p-2 rounded-lg transition-colors ${entries.length > 1 ? 'text-slate-300 hover:text-red-500 hover:bg-red-50' : 'text-slate-200 cursor-not-allowed'}`}
                title="Remove Item"
                disabled={entries.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
        <button 
          onClick={handleAddRecord}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 active:scale-95"
        >
          Submit Bill
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuickEntryForm;
