const fs = require('fs');
const XLSX = require('xlsx');

const files = fs.readdirSync('C:/Users/ajova/.gemini/antigravity/brain/90d7e16c-bf9f-467e-bab6-fc26c74f7ca4/.user_uploaded/');
const excelFiles = files.filter(f => f.endsWith('.xlsx'));
if (excelFiles.length === 0) {
  console.log("No excel files found");
  process.exit(0);
}

const lastFile = 'C:/Users/ajova/.gemini/antigravity/brain/90d7e16c-bf9f-467e-bab6-fc26c74f7ca4/.user_uploaded/' + excelFiles[excelFiles.length - 1];
console.log("Reading:", lastFile);

const workbook = XLSX.readFile(lastFile, { cellDates: true });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = jsonData[0].map(h => h ? h.toString().trim() : "");
const tglPoCol = headers.findIndex(c => c.toLowerCase().includes('tanggal po') || c.toLowerCase().includes('order date'));
const gudangCol = headers.findIndex(c => c.toLowerCase().includes('gudang') || c.toLowerCase().includes('company'));
const kuantumCol = headers.findIndex(c => c.toLowerCase().includes('kuantum realisasi') || c.toLowerCase() === 'qty (kg)');

console.log({ tglPoCol, gudangCol, kuantumCol });

const parseDate = (val) => {
    if (!val) return null;
    if (val instanceof Date && !isNaN(val.getTime())) {
      return new Date(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate());
    }
    if (typeof val === 'number') {
      const utcDate = new Date(Math.round((val - 25569) * 86400 * 1000));
      return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
    }
    if (typeof val === 'string') {
      const parts = val.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (parts) return new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]));
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
};

let totalAugSidrap = 0;

for (let i = 1; i < jsonData.length; i++) {
  const row = jsonData[i];
  if (!row || row.length === 0) continue;
  
  const gudang = (row[gudangCol] || '').toString().trim().toUpperCase();
  if (gudang.includes('SIDRAP') || gudang.includes('LOMBOK TIMUR')) {
    const rawDate = row[tglPoCol];
    const d = parseDate(rawDate);
    const rawVal = row[kuantumCol];
    let qty = 0;
    if (typeof rawVal === 'number') qty = rawVal;
    else if (typeof rawVal === 'string') qty = parseFloat(rawVal.replace(/,/g, '')) || 0;
    
    if (d && d.getMonth() === 7 && d.getFullYear() === 2026) {
      console.log(`${gudang}: RawDate=${rawDate} -> Parsed=${d.toISOString().substring(0,10)} Qty=${qty} (${Math.round(qty/1000)} TON)`);
    }
  }
}
