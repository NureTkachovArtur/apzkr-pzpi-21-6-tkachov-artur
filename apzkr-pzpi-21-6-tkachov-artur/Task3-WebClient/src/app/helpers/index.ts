export function currentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const hours = today.getHours().toString().padStart(2, '0');
  const minutes = today.getMinutes().toString().padStart(2, '0');
  const seconds = today.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function date2minutes(date: string): number {
  const time: any = date.split('T')[1].split(':');
  return (Number(time[0]) * 60) + Number(time[1]);
}

export function compDicts(dict1: any, dict2: any): boolean {
  return JSON.stringify(dict1) == JSON.stringify(dict2);
}

let eventGuid = 0;
export function createEventId() {
  return String(eventGuid++);
}

export function addMinutesToDate(dateString: string, minutes: number): string {
  const date = new Date(dateString);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

export function changeDayInDate(dateString: string, newDay: number): string {
  var dateTime = dateString.split('T');
  var date = dateTime.at(0)!.split('-');
  date[2] = newDay < 10 ? ('0' + newDay.toString()) : newDay.toString();
  var final = date.join('-') + 'T' + dateTime.at(1);
  return final;
}
