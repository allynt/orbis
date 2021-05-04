import { ApiClient } from './ApiClient';
export { ResponseError } from './ResponseError';

const instance = new ApiClient();
Object.freeze(instance);
export default instance;
