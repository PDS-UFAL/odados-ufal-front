/** Set stores data */
import { Observable } from '../interfaces';
declare function setStore<T extends {
  [key: string]: any;
}>(store: Observable<T>, data: Partial<T>): void;
export { setStore };
