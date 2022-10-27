export interface GaException {
  type: string;
  message: string;
  context: Record<string, any>;
}
