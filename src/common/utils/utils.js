const monthsMapping = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
    "All year round": "All year round",
}
export const displayListOfMonths = (items) => {

    items = items.map(item => monthsMapping[item]);
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