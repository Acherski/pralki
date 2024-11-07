// Removes html "TM" code - used in searching items by name
export function ignoreTMTagPipe(value) {
    return value.split("&")[0];
}
