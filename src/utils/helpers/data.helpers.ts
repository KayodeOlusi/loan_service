class DataHelpers {
  noOfWeeks(startDate: string | Date = "", endDate: string | Date = "") {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date provided');
    }
    
    if (end < start) return 0;
    
    const normalizedStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const normalizedEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
    const oneDay = 1000 * 60 * 60 * 24;
    const differenceInDays = Math.round((normalizedEnd.getTime() - normalizedStart.getTime()) / oneDay);
    
    return Math.ceil(differenceInDays / 7);
  }

  noOfMonthsFromWeeks(weeks: number) {
    if (weeks < 0)
      throw new Error('Number of weeks cannot be negative');

    const months = weeks / 4.345;
    return Math.ceil(months);
  }
}

export default DataHelpers;