function generateBuckets(year, month) { // month 0-indexed
  const buckets = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  let currentStart = 1;
  while (currentStart <= lastDay) {
    let currentEnd = currentStart;
    
    // Find the next Sunday
    // Date.getDay(): 0=Sun, 1=Mon, ..., 6=Sat
    let d = new Date(year, month, currentStart);
    while (d.getDay() !== 0 && currentEnd < lastDay) {
      currentEnd++;
      d = new Date(year, month, currentEnd);
    }
    
    // If it's the very first bucket and it's too short (1 or 2 days, meaning started on Sat or Sun)
    if (currentStart === 1 && currentEnd <= 2 && currentEnd < lastDay) {
      // Find the NEXT Sunday
      currentEnd++;
      d = new Date(year, month, currentEnd);
      while (d.getDay() !== 0 && currentEnd < lastDay) {
        currentEnd++;
        d = new Date(year, month, currentEnd);
      }
    }
    
    buckets.push(\\-\\);
    currentStart = currentEnd + 1;
  }
  return buckets;
}

console.log('JULY 2026:', generateBuckets(2026, 6));
console.log('AUGUST 2026:', generateBuckets(2026, 7));
console.log('SEPTEMBER 2026:', generateBuckets(2026, 8));
