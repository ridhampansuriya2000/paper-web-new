export const mapOrder = (order, key) => (a, b) => order.indexOf(a[key]) > order.indexOf(b[key]) ? 1 : -1;
export const getDateFormatted = (date) => {
  if (date)
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  else
    return null;
};

export const cutStringTo = (string, count) => {
  return string.length > count ? string.substring(0, count-3) + '...' : string
}

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
}
