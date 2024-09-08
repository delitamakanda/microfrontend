export function separateAmount(amount, separator) {
    amount = ' ' + amount;
    separator = separator || ' ';
    let c = '',
        d = 0;
    while (amount.match(/^0[0-9]/)) {
        amount = amount.substring(1);
    }
    for (let i = amount.length - 1; i >= 0; i--) {
        c = (d != 0 && d % 3 == 0) ? amount[i] + separator + c : amount[i] + c;
        d++;
    }
    return c;
}

export function formatDate(date) {
    const dateFormat = new Date(date);
    const year = dateFormat.getFullYear();
    let month = String(dateFormat.getMonth() + 1).padStart(2, "0");
    let day = String(dateFormat.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}