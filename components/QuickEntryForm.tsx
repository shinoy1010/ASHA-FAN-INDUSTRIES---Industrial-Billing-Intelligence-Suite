
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
}

const DEALERS: Dealer[] = [
  { name: 'Verma Mechanical Works', location: 'Main Bazar, Thanesar, Kurukshetra 136118, Haryana', gst: '06AACFV3206B1ZT' },
  { name: 'Bajaj Electrical', location: 'Ganaur, Haryana', gst: '06AHMPB2431M1ZG' },
  { name: 'Kohli Electrical Traders', location: 'Yamuna Nagar, Haryana', gst: '06ACQPS7136P1ZN' },
  { name: 'SHRI BALAJEE TRADERS', location: 'A – 224, SECTOR -11, VIJAY NAGAR, Ghaziabad, Uttar Pradesh, 201001', gst: '09ABKPN5499B1Z9' },
  { name: 'Manish Auto Electrician & Electronics', location: 'Kapal Mochan Road, Sadhaura Yamuna Nagar, Haryana', gst: '06DGEPK5884H1Z2' },
  { name: 'Dhaliwal Electronics', location: 'Ram Thali Smandha, Village Taranwali, Taranwali, Kaithal, Haryana', gst: 'Not Available' },
  { name: 'SHIVA ENTERPRISES', location: 'Gaushala Road, Karnal, Haryana', gst: '06AKUPG4505G1Z6' },
  { name: 'Shree Radha Steel', location: 'Near Railway Crossing, Ahluwalia Chowk, Kurukshetra, Haryana, 136118', gst: '06AQPPS9016D1ZL' },
  { name: 'Shri Shyam Overseas', location: 'Shop no. 163 Kamla Market New Delhi - 110002', gst: '07ATAPS9744C1ZJ' },
  { name: 'Guru Steel Works', location: 'Jagadhri, Haryana', gst: '06ALXPK0181G1ZX' },
  { name: 'Sharma Mobile and Electronics', location: 'Biana Chowki, Near HP Petrol Pump, Biana, Haryana', gst: 'Not Available' },
  { name: 'Rajat Electronics', location: 'Railway Road, Kurukshetra', gst: 'NA' },
  { name: 'Luxmi Enterprises', location: 'Main Chowk, Mustafabad, HR', gst: '06AWBPK1635N2ZG' },
  { name: 'VIKAS ELECTRICALS', location: '312/7, ANAND BHAWAN, ROORKEE ROAD BAGH KESHO DASS, MUZAFFARNAGAR, UP - 251001', gst: '09AMJPA6347H1ZZ' },
  { name: 'Bajaj Electronics & Mobiles', location: 'Ladwa, Haryana', gst: '06BYYPB3079B1ZD' },
  { name: 'Global Electronics', location: 'Bye Pass Road, Paonta Sahib, Himachal Pradesh', gst: '02AJRPB5440M1Z7' },
  { name: 'Goyal Brothers', location: 'Thanesar, Kurukshetra 136118, Haryana', gst: '06AAFFG5747F1ZF' },
  { name: 'Shree Bala Jee Traders', location: 'A-224 Sector 11 Vijaynager Partapbhiar, Ghaziabad (UP)', gst: '09ABKPN5499B1Z9' },
  { name: 'Om Electronics', location: 'Ganaur, Haryana', gst: '06ACTPP6871H1ZW' },
  { name: 'M.R. Furniture', location: 'Tehsil Road, Gohana, Sonipat, Haryana 131301', gst: '06AODPG0336A1ZU' },
  { name: 'BATRA ELECTRONICS', location: 'LAJPAT RAI MARG GOLE MARKET, RISHIKESH, Dehradun, Uttarakhand, 249201', gst: '05CEDPB1795L1ZG' },
  { name: 'Bajaj Steel Works', location: 'Karnal', gst: '06HPPK7062D1Z7' },
  { name: 'Titu Electronics', location: 'M.C. Road, Ganaur, Sonipat, Haryana', gst: '06ADWPT1881F1ZZ' },
  { name: 'Super Refrigeration', location: 'Railway Road, Panipat', gst: '06ABQPB7478J1Z5' },
  { name: 'Bajaj Music', location: 'Haryana', gst: 'Not Available' },
  { name: 'Hare Krishna Electrical', location: 'Sonipat, Haryana', gst: '06AZOPS3860K1ZP' },
  { name: 'Siddhi Vinayak Enterprises', location: '5, Pipal Mandi, Dehradun, Uttrakhand', gst: '05BCQPS4420K1Z9' },
  { name: 'Dua Radio Corporation', location: 'Shop No 32, Near Clock Tower, Karnal', gst: '06BOHPD2240F1ZJ' },
  { name: 'Sardar Electronics Store', location: 'Samalkha, Haryana', gst: '06BGCPS3125D1ZS' },
  { name: 'Bhagat Ram Electric Store', location: 'Matak Majri, Indri (Karnal), Haryana 132041', gst: '06ADNPL1580E1ZM' },
  { name: 'HK Chirag', location: 'Sonipat, Haryana', gst: 'Not Available' },
  { name: 'Bansal Electronics', location: 'Barara, Haryana', gst: '06ALMPB0095R1ZP' },
  { name: 'Faiz Handloom', location: 'Vill & Post Heempur Buzurg, Chandpur (Bijnor) 246725, UP', gst: '09CQLPA4753R1Z4' },
  { name: 'Chopra Electronics', location: 'Industrial Area, Nilokheri', gst: '06AFAPC5633E1Z2' },
  { name: 'Karnal Gramophone House', location: 'Karnal 132001, Haryana', gst: '06ASHPK3086B1ZZ' },
  { name: 'Rippy Electronic World', location: 'Barara Distt. Ambala, Haryana', gst: '06BFTPS0749P1ZG' },
  { name: 'PUNJAB NATIONAL BANK', location: 'AIC RAMESH CHANDRА ВНАТТ (PF NO. 91203)', gst: '06AAАСРО165G4ZQ' },
  { name: 'Prem Enterprises', location: 'Paonta Sahib, Himachal Pradesh', gst: '02AFPPC4772D1ZR' },
  { name: 'Jai Radio & Watch Co.', location: 'Chowk Rd, Rishikesh, Uttrakhand', gst: '05ACDPB1880E1Z7' },
  { name: 'Rambha Electronics', location: 'Karnal, Haryana', gst: '06ASCPS2044L1ZN' },
  { name: 'Balaji Hindustan Enterprises', location: 'Panipat, Haryana', gst: '06AHZPA3849F1Z3' },
  { name: 'Ganga Steel Furniture', location: 'Shop No. 28, Mahaveer Bazar, Saharanpur, U.P', gst: '09BQGPS5498P1ZK' },
  { name: 'Nand Lal & Sons', location: 'Taraori, Haryana', gst: '06BDNPT2309G1ZG' },
  { name: 'Kohli Electric Company', location: 'Yamuna Nagar, Haryana', gst: '06ADPPK5532R1ZU' },
  { name: 'Industrial Suppliers and Engineers', location: 'Badri Nagar, Paonta Sahib, HP', gst: '02ACFPG5119B1ZG' },
  { name: 'Ravi Kumar Jain', location: 'Saharanpur, U.P', gst: 'NA' },
  { name: 'Shivam Furniture', location: 'Ganaur, Haryana', gst: '06BECPK5120E1Z3' },
  { name: 'RK Electronics', location: 'Near Chilkana Chungi, Chilkana Road, Saharanpur, U.P', gst: '09AFVPJ3407L1ZX' },
  { name: 'Gupta Enterprises', location: 'Shop no 37, Near Clock Tower, Karnal, Haryana, 132001', gst: '06AFMPG9727R1ZK' }
].sort((a, b) => a.name.localeCompare(b.name));

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

const QuickEntryForm: React.FC<QuickEntryFormProps> = ({ onAdd, showManualDateTime = false }) => {
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
    
    const dealer = DEALERS[parseInt(dealerIdx)];
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
            {DEALERS.map((d, i) => (
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
