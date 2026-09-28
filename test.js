const finalReportRealisasiPengadaan = {
  finalData: {
    'UP': {
      'UP_A': {
        'BERAS': { 'M_1': 5000, 'W_1-5': 1000, 'REAL_YTD': 6000 }
      }
    }
  },
  pastMonths: [1],
  weeks: ['W_1-5', 'W_6-12', 'W_13-19', 'W_20-26', 'W_27-31']
};

const TARGET_2026_DATA = {};
const komoditiList = ["GABAH", "BERAS", "JAGUNG"];

let grandTotals = {
  "GABAH": { months: {}, weeks: [0,0,0,0,0], ytd: 0, target: 0 },
  "BERAS": { months: {}, weeks: [0,0,0,0,0], ytd: 0, target: 0 },
  "JAGUNG": { months: {}, weeks: [0,0,0,0,0], ytd: 0, target: 0 },
};

Object.keys(finalReportRealisasiPengadaan.finalData).forEach(group => {
  Object.keys(finalReportRealisasiPengadaan.finalData[group]).forEach(gudang => {
    komoditiList.forEach(kom => {
      const kData = finalReportRealisasiPengadaan.finalData[group][gudang][kom] || {};
      
      finalReportRealisasiPengadaan.pastMonths.forEach(m => {
        grandTotals[kom].months[\M_\\] = (grandTotals[kom].months[\M_\\] || 0) + (kData[\M_\\] || 0);
      });
      
      finalReportRealisasiPengadaan.weeks.forEach((w, wIdx) => {
        grandTotals[kom].weeks[wIdx] += (kData[w] || 0);
      });
      
      grandTotals[kom].ytd += (kData["REAL_YTD"] || 0);
      grandTotals[kom].target += (TARGET_2026_DATA[gudang]?.[kom] || 0);
    });
  });
});

console.log(JSON.stringify(grandTotals, null, 2));
