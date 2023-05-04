export type HasIdWithInterface<T> = HasIdInterface & T;

export interface HasIdInterface {
  id: string;
}
