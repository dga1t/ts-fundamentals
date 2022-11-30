import { IStreamLogger } from '../../core/handlers/streamLogger.interface';

export class ConsoleLogger implements IStreamLogger {
  private static instanse: ConsoleLogger;

  private constructor() {}

  public static getInstance(): ConsoleLogger {
    if (!ConsoleLogger.instanse) ConsoleLogger.instanse = new ConsoleLogger();
    return ConsoleLogger.instanse;
  }

  log(...args: any[]): void {
    console.log(...args);
  }
  error(...args: any[]): void {
    console.log(...args);
  }
  end(): void {
    console.log('done');
  }
}
