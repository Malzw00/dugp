// error.d.ts

declare namespace ErrorTypes {
  type ErrorCode = 'UNIQUE_NAME' | 'ID_NOT_EXISTS' | 'UNKNOWN_ERROR';

  interface ErrorDetails {
    layer: string;
    module: string;
    method: string;
    publicMessage: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    code: ErrorCode;
  }

  interface ExtraErrorInfo {
    details?: string;
    meta?: Record<string, any>;
  }
}
