import { apiDelete, apiGet, apiPost } from './client';
import { Order } from './orders';
import { TDAmeritrade } from './tdameritrade';

export interface SavedOrder extends Omit<Order, 'tag'> {
  savedOrderId: number;
  savedTime: string;
}

export async function createSavedOrder(
  td: TDAmeritrade,
  accountId: string,
  order: Partial<SavedOrder>
) {
  const response = await apiPost<SavedOrder>(
    td,
    `accounts/${accountId}/savedorders`,
    order,
    { throttle: false }
  );

  return response.data;
}

export async function deleteSavedOrder(
  td: TDAmeritrade,
  accountId: string,
  savedOrderId: number
) {
  await apiDelete(td, `accounts/${accountId}/savedorders/${savedOrderId}`, {
    throttle: false,
  });
}

export async function getSavedOrder(
  td: TDAmeritrade,
  accountId: string,
  savedOrderId: number
) {
  const response = await apiGet<SavedOrder>(
    td,
    `accounts/${accountId}/savedorders/${savedOrderId}`,
    { throttle: false }
  );

  return response.data;
}

export async function getSavedOrders(td: TDAmeritrade, accountId: string) {
  const response = await apiGet<SavedOrder[]>(
    td,
    `accounts/${accountId}/savedorders`,
    { throttle: false }
  );

  return response.data;
}

export async function replaceSavedOrder(
  td: TDAmeritrade,
  accountId: string,
  savedOrderId: number,
  order: Partial<SavedOrder>
) {
  const response = await apiPost<SavedOrder>(
    td,
    `accounts/${accountId}/savedorders/${savedOrderId}`,
    order,
    { throttle: false }
  );

  return response.data;
}
