import { RevoPlugin } from '../interfaces';
export default abstract class BasePlugin implements RevoPlugin.Plugin {
  protected revogrid: HTMLRevoGridElement;
  private readonly subscriptions;
  constructor(revogrid: HTMLRevoGridElement);
  protected addEventListener(name: string, func: (e: CustomEvent) => void): void;
  protected removeEventListener(type: string): void;
  protected emit(eventName: string, detail?: any): CustomEvent<any>;
  protected clearSubscriptions(): void;
  destroy(): void;
}
