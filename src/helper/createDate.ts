
export function currentDateISOString() {
    return new Date().toISOString()
}

export function nextDayDateISOString() {
    let nextDayDate = new Date()
    nextDayDate.setDate(nextDayDate.getDate() + 1);
    return nextDayDate.toISOString();
}

//проверка формата даты
export const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;