// Converts date from backend format to xx.xx.xxxx
export function formatDatePipe(value) {
    return value.split("-").reverse().join(".");
}
