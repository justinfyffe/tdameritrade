import { Client } from './client';
import { Order } from './orders';

export interface SavedOrder extends Omit<Order, 'tag'> {
  savedOrderId: number;
  savedTime: string;
}

export class SavedOrders {
  constructor(private client: Client) {}

  async create(accountId: string, order: Partial<SavedOrder>) {
    const response = await this.client.post<SavedOrder>(
      `accounts/${accountId}/savedorders`,
      order
    );

    return response?.data;
  }

  async delete(accountId: string, savedOrderId: number) {
    await this.client.delete(
      `accounts/${accountId}/savedorders/${savedOrderId}`
    );
  }

  async get(accountId: string, savedOrderId: number) {
    const response = await this.client.get<SavedOrder>(
      `accounts/${accountId}/savedorders/${savedOrderId}`
    );

    return response?.data;
  }

  async getAll(accountId: string) {
    const response = await this.client.get<SavedOrder[]>(
      `accounts/${accountId}/savedorders`
    );

    return response?.data;
  }

  async replace(
    accountId: string,
    savedOrderId: number,
    order: Partial<SavedOrder>
  ) {
    const response = await this.client.post<SavedOrder>(
      `accounts/${accountId}/savedorders/${savedOrderId}`,
      order
    );

    return response?.data;
  }
}
