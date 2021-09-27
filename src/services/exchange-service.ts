import fetch from "cross-fetch";

import { CurrencyEnum } from "../types";

type KnownExchanges = `USD${CurrencyEnum}`;

type ExchangeRates = {
  [key in KnownExchanges]: number
}

export class ExchangeService {
  static isValidCurrency(currency: string): currency is CurrencyEnum {
    return Object.keys(CurrencyEnum).includes(currency);
  }

  constructor(private serviceUrl: string) { }

  async convertPrice(
    price: number,
    toCurrency: CurrencyEnum
  ): Promise<number> {
    const exchangeRate = await this.getExchangeRate(toCurrency);
    return price * exchangeRate;
  }

  private getExchangeRateKey(toCurrency: CurrencyEnum): KnownExchanges {
    return `${CurrencyEnum.USD}${toCurrency}`;
  }

  private async getExchangeRate(toCurrency: CurrencyEnum): Promise<number> {
    if (toCurrency === CurrencyEnum.USD) {
      return Promise.resolve(1);
    }

    const rates = await this.getExchangeRates();
    const exchangeRateKey = this.getExchangeRateKey(toCurrency);
    const rate = rates[exchangeRateKey];

    if (!rate) {
      throw new Error('Unable to get exchange rate.')
    }

    return rate;
  }

  private async getExchangeRates(): Promise<ExchangeRates> {
    const response = await fetch(this.serviceUrl);
    const data = await response.json();
    const rates = data.quotes;

    return rates;
  }
}