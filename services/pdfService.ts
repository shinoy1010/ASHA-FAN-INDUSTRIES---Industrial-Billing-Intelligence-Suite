
import { jsPDF } from 'jspdf';
import { RowData } from '../types';
import { ASHA_LOGO_BASE64 } from '../components/logoBase64.js';

/**
 * Utility to fetch an image and convert it to Base64 for jsPDF
 */
async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to load logo image:", error);
    return '';
  }
}

/**
 * Utility to convert numbers to words (Indian Rupees)
 */
function numberToWords(num: number): string {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: any): string => {
    if ((n = n.toString()).length > 9) return 'overflow';
    const n_match = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n_match) return '';
    let str = '';
    str += n_match[1] != '00' ? (a[Number(n_match[1])] || b[Number(n_match[1][0])] + ' ' + a[Number(n_match[1][1])]) + 'Crore ' : '';
    str += n_match[2] != '00' ? (a[Number(n_match[2])] || b[Number(n_match[2][0])] + ' ' + a[Number(n_match[2][1])]) + 'Lakh ' : '';
    str += n_match[3] != '00' ? (a[Number(n_match[3])] || b[Number(n_match[3][0])] + ' ' + a[Number(n_match[3][1])]) + 'Thousand ' : '';
    str += n_match[4] != '0' ? (a[Number(n_match[4])] || b[Number(n_match[4][0])] + ' ' + a[Number(n_match[4][1])]) + 'Hundred ' : '';
    str += n_match[5] != '00' ? ((str != '') ? 'and ' : '') + (a[Number(n_match[5])] || b[Number(n_match[5][0])] + ' ' + a[Number(n_match[5][1])]) : '';
    return str + ' Only';
  };
  return inWords(Math.floor(num));
}

// Updated generateInvoicePDF to return File for sharing
export const generateInvoicePDF = async (billNumber: string, allData: RowData[], isIGST: boolean = false): Promise<File | undefined> => {
  const items = allData.filter(r => r['Bill Number'] === billNumber);
  if (items.length === 0) return;

  const headerRow = items[0];
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // Colors from brand
  const brandBlue = [34, 65, 126]; // #22417e
  const tableHeaderBg = [217, 230, 243]; // Light blue

  // --- 1. TOP RIGHT LABEL ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text("Bill-Cash", pageWidth - margin, 15, { align: 'right' });

  // --- 2. COMPANY HEADER (Logo centered above Title) ---
  const logoPath = ASHA_LOGO_BASE64; 
  const logoBase64 = await fetchImageAsBase64(logoPath);
  
  const logoHeight = 15; 
  const logoWidth = 15;  
  const title = "ASHA FAN INDUSTRIES";
  
  // Vertical spacing
  const logoY = 17;
  const titleY = 40; 

  // Center the Logo
  if (logoBase64) {
    try {
      const logoStartX = (pageWidth - logoWidth) / 2;
      doc.addImage(logoBase64, 'JPEG', logoStartX, logoY, logoWidth, logoHeight);
    } catch (e) {
      console.error("Error adding image to PDF:", e);
    }
  }
  
  // Center the Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(brandBlue[0], brandBlue[1], brandBlue[2]);
  const titleWidth = doc.getTextWidth(title);
  const titleStartX = (pageWidth - titleWidth) / 2;
  doc.text(title, titleStartX, titleY);
  
  // Registered Symbol (aligned with centered title)
  doc.setFontSize(10);
  doc.text("®", titleStartX + titleWidth + 1, titleY - 6);

  // Address and Info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text("300/3 Sita Nagar, Gharaunda (Karnal), HR | 132114", pageWidth / 2, 49, { align: 'center' });
  
  doc.setFont("helvetica", "bold");
  doc.text("GSTIN: 06ABJPT7774Q1ZH", pageWidth / 2, 54, { align: 'center' });
  
  doc.setTextColor(brandBlue[0], brandBlue[1], brandBlue[2]);
  doc.text("www.theashaindustries.com", pageWidth / 2, 59, { align: 'center' });
  const webWidth = doc.getTextWidth("www.theashaindustries.com");
  doc.setDrawColor(brandBlue[0], brandBlue[1], brandBlue[2]);
  doc.setLineWidth(0.2);
  doc.line((pageWidth / 2) - webWidth/2, 60, (pageWidth / 2) + webWidth/2, 60);

  // --- 3. TAX INVOICE DIVIDER ---
  doc.setDrawColor(brandBlue[0], brandBlue[1], brandBlue[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, 68, pageWidth - margin, 68);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(brandBlue[0], brandBlue[1], brandBlue[2]);
  doc.text("TAX INVOICE", pageWidth / 2, 75, { align: 'center' });

  // --- 4. CUSTOMER & INVOICE METADATA ---
  const metaY = 88;
  doc.setFontSize(10);
  doc.setTextColor(0);
  
  doc.setFont("helvetica", "bold");
  doc.text("Customer Name", margin, metaY);
  doc.setFont("helvetica", "normal");
  doc.text(headerRow['Dealer Name'] || 'N/A', margin, metaY + 6);
  doc.text(headerRow['Location'] || 'N/A', margin, metaY + 12);

  doc.setFont("helvetica", "bold");
  doc.text("Customer GSTIN", margin, metaY + 28);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(brandBlue[0], brandBlue[1], brandBlue[2]);
  doc.text(headerRow['GST Number'] || '06ANJPM8264E1ZT', margin, metaY + 34);

  const rightColX = pageWidth - 85;
  const valueOffset = 38;
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice No.", rightColX, metaY);
  doc.text("Date", rightColX, metaY + 6);
  doc.text("Time", rightColX, metaY + 12);
  doc.text("Vehicle No.", rightColX, metaY + 28);

  doc.setFont("helvetica", "normal");
  doc.text(billNumber || 'AFI-0377', rightColX + valueOffset, metaY);
  
  // Use Date and Time from the record instead of current time
  doc.text(headerRow['Date'] || 'N/A', rightColX + valueOffset, metaY + 6);
  doc.text(headerRow['Time'] || 'N/A', rightColX + valueOffset, metaY + 12);
  doc.text((headerRow['Vehicle No'] || 'HR67D0177').toString().toUpperCase(), rightColX + valueOffset, metaY + 28);

  // --- 5. MAIN TABLE ---
  const tableY = 130;
  
  // Define column positions based on IGST toggle
  const colX_table = isIGST ? {
    hash: margin,           
    item: margin + 8,       
    qty: margin + 45,       
    price: margin + 65,      
    taxable: margin + 88,   
    igst: margin + 117,      
    total: pageWidth - margin 
  } : {
    hash: margin,           
    item: margin + 8,       
    qty: margin + 45,       
    price: margin + 65,      
    taxable: margin + 88,   
    cgst: margin + 112,      
    sgst: margin + 133, 
    total: pageWidth - margin 
  };

  const totalColCenterX = isIGST 
    ? (colX_table.igst + 20 + colX_table.total) / 2 
    : (colX_table.sgst + 18 + colX_table.total) / 2;

  doc.setFillColor(tableHeaderBg[0], tableHeaderBg[1], tableHeaderBg[2]);
  doc.rect(margin, tableY, pageWidth - (margin * 2), 18, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0);

  const headTop = tableY + 9;
  doc.text("Item", colX_table.item + 2, headTop);
  doc.text("Quantity", colX_table.qty + 5, headTop, { align: 'center' });
  doc.text(["Price/Item", "(Rs.)"], colX_table.price + 10, headTop - 3, { align: 'center' });
  doc.text(["Taxable", "Value (Rs.)"], colX_table.taxable + 10, headTop - 3, { align: 'center' });
  
  if (isIGST) {
    doc.text(["IGST", "(18%) (Rs.)"], colX_table.igst + 10, headTop - 3, { align: 'center' });
  } else {
    doc.text(["CGST", "(9%) (Rs.)"], colX_table.cgst + 10, headTop - 3, { align: 'center' });
    doc.text(["SGST", "(9%) (Rs.)"], colX_table.sgst + 10, headTop - 3, { align: 'center' });
  }
  
  doc.text(["Total", "(Rs.)"], totalColCenterX, headTop - 3, { align: 'center' });

  let currentY = tableY + 23.5; 
  let grandTotal = 0;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  items.forEach((item, index) => {
    const qty = parseFloat(item['Quantity'] || '0');
    const price = parseFloat(item['Price'] || '0');
    const taxable = qty * price;
    
    let total = 0;
    
    if (isIGST) {
      const igst = taxable * 0.18;
      total = taxable + igst;
      grandTotal += total;
      
      doc.text(igst.toFixed(2), colX_table.igst + 10, currentY, { align: 'center' });
    } else {
      const cgst = taxable * 0.09;
      const sgst = taxable * 0.09;
      total = taxable + cgst + sgst;
      grandTotal += total;
      
      doc.text(cgst.toFixed(2), colX_table.cgst + 10, currentY, { align: 'center' });
      doc.text(sgst.toFixed(2), colX_table.sgst + 10, currentY, { align: 'center' });
    }

    doc.text((index + 1).toString(), colX_table.hash + 2, currentY);
    const splitItem = doc.splitTextToSize(item['Item Name'] || 'N/A', 33);
    doc.text(splitItem, colX_table.item + 2, currentY);
    
    doc.setFontSize(8);
    doc.text(`HSN: ${item['HSN'] || '8414'}`, colX_table.item + 2, currentY + (splitItem.length * 4.5) + 0.5);
    doc.setFontSize(9);
    
    doc.text(qty.toString(), colX_table.qty + 5, currentY, { align: 'center' });
    doc.text(price.toFixed(2), colX_table.price + 10, currentY, { align: 'center' });
    doc.text(taxable.toFixed(2), colX_table.taxable + 10, currentY, { align: 'center' });
    doc.text(total.toFixed(2), totalColCenterX, currentY, { align: 'center' });

    currentY += Math.max(splitItem.length * 5.5 + 3, 11);
  });

  const summaryY = currentY - 2; 
  doc.setFillColor(tableHeaderBg[0], tableHeaderBg[1], tableHeaderBg[2]);
  doc.rect(margin, summaryY, pageWidth - (margin * 2), 10, 'F');
  doc.setFont("helvetica", "bold");
  
  const totalLabelX = isIGST ? colX_table.igst - 5 : colX_table.sgst - 5;
  doc.text("Total (Rs.)", totalLabelX, summaryY + 6.5, { align: 'right' });
  doc.text(grandTotal.toFixed(2), totalColCenterX, summaryY + 6.5, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Amount (In words)", margin, summaryY + 16);
  doc.setFont("helvetica", "bold");
  doc.text(numberToWords(grandTotal), pageWidth - margin, summaryY + 16, { align: 'right' });


  // --- 8. BANK ACCOUNT DETAILS ---
  doc.setTextColor(0);
  const bankY = summaryY + 27;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("BANK ACCOUNT DETAILS", margin, bankY);
  
  const bankBoxW = 110;
  const bankBoxH = 24; 
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(margin, bankY + 2, bankBoxW, bankBoxH);
  doc.line(margin + 38, bankY + 2, margin + 38, bankY + 2 + bankBoxH);

  const drawBankLine = (label: string, value: string, y: number, isLast = false) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(label, margin + 2, y);
    doc.text(value, margin + 40, y);
    if (!isLast) {
      doc.line(margin, y + 2, margin + bankBoxW, y + 2);
    }
  };

  drawBankLine("Account Name", "ASHA FAN INDUSTRIES", bankY + 6);
  drawBankLine("Account Number", "1716008700007614", bankY + 12);
  drawBankLine("Bank & Branch", "Punjab National Bank, Gharaunda (Karnal)", bankY + 18);
  drawBankLine("IFSC Code", "PUNB0171600", bankY + 24, true);

  // --- 9. SIGNATURE BLOCK ---
  const sigY = bankY + 34; 
  doc.setDrawColor(0);
  doc.setLineWidth(0.8);
  doc.line(pageWidth - margin - 55, sigY, pageWidth - margin, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("For ASHA FAN INDUSTRIES®", pageWidth - margin - 27.5, sigY + 5, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("(Signature)", pageWidth - margin - 27.5, sigY + 10, { align: 'center' });

  // --- 10. TERMS & CONDITIONS ---
  const termsY = sigY + 15; 
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Terms & Conditions :", margin, termsY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("1. Goods once sold will not be taken back.", margin, termsY + 5);
  doc.text("2. Subject to Karnal Jurisdiction.", margin, termsY + 10);

  doc.setFontSize(8.5);
  doc.text("For any further inquiries please reach out to", margin, termsY + 18);
  doc.setTextColor(brandBlue[0], brandBlue[1], brandBlue[2]);
  doc.text("us at support@theashaindustries.com", margin, termsY + 23);

  // Output blob to create File object
  const pdfBlob = doc.output('blob');
  const filename = `Invoice_${billNumber}.pdf`;
  doc.save(filename);
  
  return new File([pdfBlob], filename, { type: 'application/pdf' });
};

// Implemented shareToWhatsApp for direct invoice sharing
export const shareToWhatsApp = (file: File, billNumber: string) => {
  const message = `Asha Fan Industries - Invoice for Bill ${billNumber}`;
  
  // Try using Native Sharing if available (especially for mobile)
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      files: [file],
      title: 'Invoice',
      text: message,
    }).catch(err => {
      console.warn("Share failed, falling back to basic link", err);
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  } else {
    // Fallback: Open WhatsApp with text (browser doesn't support sharing local files via URL easily)
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
};
