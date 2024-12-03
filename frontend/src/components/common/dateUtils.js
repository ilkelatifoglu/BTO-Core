export const formatDate = (date) => {
    const utcDate = new Date(date); 
    const offsetMinutes = new Date().getTimezoneOffset(); 
    utcDate.setMinutes(utcDate.getMinutes() - offsetMinutes); 
    return utcDate.toISOString().split("T")[0]; 
  };
  