export const commaSeparator = (items) => {
    if (items.length === 0) {
        return '';
    } else if (items.length === 1) {
        return items[0];
    } else if (items.length === 2) {
        return items.join(' and ');
    } else {
        return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
    }
}