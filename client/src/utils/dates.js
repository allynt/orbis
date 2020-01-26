import format from 'date-fns/format';

export const FORMAT = 'yyyy-MM-dd';

export default date => (date ? format(date, 'MMMM do yyyy') : 'N/A');
