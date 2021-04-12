import { Client } from './client';
import { OrderClient, OrderData } from './orders';

export interface SavedOrderData extends Omit<OrderData, 'tag'> {
  savedOrderId: number;
  savedTime: string;
}

export class SavedOrderClient {
  constructor(private client: Client) {}

  async createSavedOrder(accountId: number, order: Partial<SavedOrderData>) {
    const response = await this.client.post<SavedOrderData>(
      `accounts/${accountId}/savedorders`,
      order
    );

    return response.data;
  }

  async deleteSavedOrder(accountId: number, savedOrderId: number) {
    await this.client.delete(
      `accounts/${accountId}/savedorders/${savedOrderId}`
    );
  }

  async getSavedOrder(accountId: number, savedOrderId: number) {
    const response = await this.client.get<SavedOrderData>(
      `accounts/${accountId}/savedorders/${savedOrderId}`
    );

    return response.data;
  }

  async getSavedOrders(accountId: number) {
    const response = await this.client.get<SavedOrderData[]>(
      `accounts/${accountId}/savedorders`
    );

    return response.data;
  }

  async replaceSavedOrder(
    accountId: number,
    savedOrderId: number,
    order: Partial<SavedOrderData>
  ) {
    const response = await this.client.post<SavedOrderData>(
      `accounts/${accountId}/savedorders/${savedOrderId}`,
      order
    );

    return response.data;
  }
}

export class SavedOrder {
  constructor(
    protected data: SavedOrderData,
    private orderClient: OrderClient,
    private savedOrderClient: SavedOrderClient
  ) {}

  get session() {
    return this.data.session;
  }

  get duration() {
    return this.data.duration;
  }

  get orderType() {
    return this.data.orderType;
  }

  get cancelTime() {
    return this.data.cancelTime;
  }

  get complexOrderStrategyType() {
    return this.data.complexOrderStrategyType;
  }

  get quantity() {
    return this.data.quantity;
  }

  get filledQuantity() {
    return this.data.filledQuantity;
  }

  get remainingQuantity() {
    return this.data.remainingQuantity;
  }

  get requestedDestination() {
    return this.data.requestedDestination;
  }

  get destinationLinkName() {
    return this.data.destinationLinkName;
  }

  get releaseTime() {
    return this.data.releaseTime;
  }

  get stopPrice() {
    return this.data.stopPrice;
  }

  get stopPriceLinkBasis() {
    return this.data.stopPriceLinkBasis;
  }

  get stopPriceLinkType() {
    return this.data.stopPriceLinkType;
  }

  get stopPriceOffset() {
    return this.data.stopPriceOffset;
  }

  get stopType() {
    return this.data.stopType;
  }

  get priceLinkBasis() {
    return this.data.priceLinkBasis;
  }

  get priceLinkType() {
    return this.data.priceLinkType;
  }

  get price() {
    return this.data.price;
  }

  get taxLotMethod() {
    return this.data.taxLotMethod;
  }

  get orderLegCollection() {
    return this.data.orderLegCollection;
  }

  get activationPrice() {
    return this.data.activationPrice;
  }

  get specialInstruction() {
    return this.data.specialInstruction;
  }

  get orderStrategyType() {
    return this.data.orderStrategyType;
  }

  get orderId() {
    return this.data.orderId;
  }

  get cancelable() {
    return this.data.cancelable;
  }

  get editable() {
    return this.data.editable;
  }

  get status() {
    return this.data.status;
  }

  get enteredTime() {
    return this.data.enteredTime;
  }

  get closeTime() {
    return this.data.closeTime;
  }

  get accountId() {
    return this.data.accountId;
  }

  get orderActivityCollection() {
    return this.data.orderActivityCollection;
  }

  get replacingOrderCollection() {
    return this.data.replacingOrderCollection;
  }

  get childOrderStrategies() {
    return this.data.childOrderStrategies;
  }

  get statusDescription() {
    return this.data.statusDescription;
  }

  get savedOrderId() {
    return this.data.savedOrderId;
  }

  get savedTime() {
    return this.data.savedTime;
  }

  toJson() {
    return { ...this.data };
  }

  async delete() {
    await this.savedOrderClient.deleteSavedOrder(
      this.accountId,
      this.savedOrderId
    );
  }

  async replace(order: Partial<SavedOrderData>) {
    const data = await this.savedOrderClient.replaceSavedOrder(
      this.accountId,
      this.savedOrderId,
      order
    );

    return createSavedOrderInstance(
      data,
      this.orderClient,
      this.savedOrderClient
    );
  }

  async refresh() {
    this.data = await this.savedOrderClient.getSavedOrder(
      this.accountId,
      this.savedOrderId
    );
  }
}

export function createSavedOrderInstance(
  data: SavedOrderData,
  orderClient: OrderClient,
  savedOrderClient: SavedOrderClient
) {
  return new SavedOrder(data, orderClient, savedOrderClient);
}

export function createSavedOrderInstances(
  data: SavedOrderData[],
  orderClient: OrderClient,
  savedOrderClient: SavedOrderClient
) {
  return data.map(
    (data) => new SavedOrder(data, orderClient, savedOrderClient)
  );
}
