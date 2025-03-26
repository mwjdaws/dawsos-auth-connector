// filepath: /dawsos-web-app/dawsos-web-app/src/utils/index.ts
export const formatDate = (date: Date, locale: string = 'en-US'): string => {
    return new Intl.DateTimeFormat(locale).format(date);
};

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export const isEmpty = (value: any): boolean => {
    return value === null || value === undefined || (typeof value === 'object' && Object.keys(value).length === 0);
};