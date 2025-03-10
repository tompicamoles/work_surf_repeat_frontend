export const commaSeparator = (items) => {
    console.log("items length", items, items.length);
    if (items.length === 0) {
        return '';
    } else if (items.length === 1) {
        return items[0];
    } else if (items.length === 2) {
        return items.join(' and ');
    } else {
        console.log("items to slice", items);
        return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
    }
}