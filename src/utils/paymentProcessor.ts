import CryptoJS from "crypto-js";

export interface PaymentData {
  amount: number;
  method: string;
  customerName: string;
  customerEmail: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
}

export interface EncryptedCardData {
  encryptedData: string;
  iv: string;
  salt: string;
}

export interface SavedCardData {
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
  encryptedData: EncryptedCardData;
}

export class PaymentProcessor {
  private paymentData: PaymentData;
  private _savedCardData: SavedCardData | null = null;

  constructor(paymentData: PaymentData) {
    this.paymentData = paymentData;
  }

  processPayment() {
    // Implement payment processing logic here, such as calling an API or library
    console.log(
      `Processing payment of $${this.paymentData.amount} via ${this.paymentData.method} for customer ${this.paymentData.customerName} (${this.paymentData.customerEmail})`
    );
  }

  validatePayment() {
    if (this.paymentData.amount === undefined || this.paymentData.amount < 0) {
      throw new Error("Invalid payment amount");
    }

    if (!this.paymentData.method || this.paymentData.method.trim() === "") {
      throw new Error("Invalid payment method");
    }

    if (
      !this.paymentData.customerName ||
      this.paymentData.customerName.trim() === ""
    ) {
      throw new Error("Invalid customer name");
    }

    if (
      !this.paymentData.customerEmail ||
      this.paymentData.customerEmail.trim() === ""
    ) {
      throw new Error("Invalid customer email");
    }
  }

  saveCard(
    cardNumber: string,
    cardExpiry: string,
    cardCVV: string,
    password: string
  ) {
    const encryptedData = this.encryptCardData(
      cardNumber,
      cardExpiry,
      cardCVV,
      password
    );
    this._savedCardData = { cardNumber, cardExpiry, cardCVV, encryptedData };
  }

  get savedCardData(): SavedCardData | null {
    return this._savedCardData;
  }

  getSavedCardData(password: string): SavedCardData | null {
    if (!this.savedCardData) {
      return null;
    }

    const { cardNumber, cardExpiry, cardCVV, encryptedData } =
      this.savedCardData;
    const decryptedData = this.decryptCardData(encryptedData, password);

    if (
      decryptedData.cardNumber !== cardNumber ||
      decryptedData.cardExpiry !== cardExpiry ||
      decryptedData.cardCVV !== cardCVV
    ) {
      throw new Error("Incorrect password or tampered data");
    }

    return decryptedData;
  }

  private encryptCardData(
    cardNumber: string,
    cardExpiry: string,
    cardCVV: string,
    password: string
  ): EncryptedCardData {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const data = JSON.stringify({ cardNumber, cardExpiry, cardCVV });
    const encryptedData = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
    }).ciphertext;

    return {
      iv: CryptoJS.enc.Hex.stringify(iv),
      encryptedData: encryptedData.toString(),
      salt: CryptoJS.enc.Hex.stringify(salt),
    };
  }

  private decryptCardData(
    encryptedData: EncryptedCardData,
    password: string
  ): SavedCardData {
    const key = CryptoJS.PBKDF2(password, encryptedData.salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(encryptedData.encryptedData),
      key: key,
      iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
    });

    const decryptedData = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
    });

    const decryptedJson = decryptedData.toString(CryptoJS.enc.Utf8);
    const decryptedObj = JSON.parse(decryptedJson);

    return {
      cardNumber: decryptedObj.cardNumber,
      cardExpiry: decryptedObj.cardExpiry,
      cardCVV: decryptedObj.cardCVV,
      encryptedData,
    };
  }
}
