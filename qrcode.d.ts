declare module "qrcode" {
  type QRCodeColor = {
    dark?: string;
    light?: string;
  };

  type QRCodeToDataURLOptions = {
    margin?: number;
    width?: number;
    color?: QRCodeColor;
  };

  const QRCode: {
    toDataURL(text: string, options?: QRCodeToDataURLOptions): Promise<string>;
  };

  export default QRCode;
}
