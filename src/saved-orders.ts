import { apiDelete, apiGet, apiPost } from './client';
import { Order } from './orders';
import { TDAmeritrade } from './tdameritrade';

export interface SavedOrder extends Omit<Order, 'tag'> {
  savedOrderId: number;
  savedTime: string;
}

export async function createSavedOrder(
  td: TDAmeritrade,
  accountId: number,
  order: Partial<SavedOrder>
) {
  const response = await apiPost<SavedOrder>(
    td,
    `accounts/${accountId}/savedorders`,
    order
  );

  return response.data;
}

export async function deleteSavedOrder(
  td: TDAmeritrade,
  accountId: number,
  savedOrderId: number
) {
  await apiDelete(td, `accounts/${accountId}/savedorders/${savedOrderId}`);
}

export async function getSavedOrder(
  td: TDAmeritrade,
  accountId: number,
  savedOrderId: number
) {
  const response = await apiGet<SavedOrder>(
    td,
    `accounts/${accountId}/savedorders/${savedOrderId}`
  );

  return response.data;
}

export async function getSavedOrders(td: TDAmeritrade, accountId: number) {
  const response = await apiGet<SavedOrder[]>(
    td,
    `accounts/${accountId}/savedorders`
  );

  return response.data;
}

export async function replaceSavedOrder(
  td: TDAmeritrade,
  accountId: number,
  savedOrderId: number,
  order: Partial<SavedOrder>
) {
  const response = await apiPost<SavedOrder>(
    td,
    `accounts/${accountId}/savedorders/${savedOrderId}`,
    order
  );

  return response.data;
}
