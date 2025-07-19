declare module 'qr-scanner' {
  export interface QrScannerOptions {
    onDecodeError?: (error: string | Error) => void
    preferredCamera?: 'environment' | 'user'
    highlightScanRegion?: boolean
    highlightCodeOutline?: boolean
    returnDetailedScanResult?: boolean
  }

  export interface QrScanResult {
    data: string
  }

  export default class QrScanner {
    constructor(
      video: HTMLVideoElement,
      onDecode: (result: QrScanResult) => void,
      options?: QrScannerOptions
    )
    
    start(): Promise<void>
    stop(): void
    destroy(): void
    static hasCamera(): Promise<boolean>
  }
}