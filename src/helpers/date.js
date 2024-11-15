import dayjs from "dayjs";
import "@/locales/es/dayjs";

dayjs.locale('es');

const $date = function(date = null) {
  const $dayjs = date ? dayjs(date) : dayjs();
  
  return {
    $dayjs,
    format(format = 'DD MMM, YYYY h:mm A') {
      return $dayjs.locale("es").format(format);
    }
  }
};

export default $date;

export function timeDiff(date, compDate = null) {
  let dateDiffMS = new Date(date).getTime();
  let now = compDate ? new Date(compDate).getTime() : new Date().getTime();
  
  let distance = null;
  if (now > dateDiffMS) {
    distance = now - dateDiffMS;    
  } else {
    distance = dateDiffMS - now;
  }
    
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);    

  return `
    ${(days > 0) ? days + "d " : ''}
    ${(hours > 0) ? hours + "h " : ''}
    ${minutes + "m "} 
    ${seconds + "s "}
  `; 
}