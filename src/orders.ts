import { Client } from './client';
import { Instrument } from './instruments';

export enum OrderSession {
  Normal = 'NORMAL',
  AM = 'AM',
  PM = 'PM',
  Seamless = 'SEAMLESS',
}

export enum OrderDuration {
  Day = 'DAY',
  GoodTillCancel = 'GOOD_TILL_CANCEL',
  FillOrKill = 'FILL_OR_KILL',
}

export enum OrderType {
  Market = 'MARKET',
  Limit = 'LIMIT',
  Stop = 'STOP',
  StopLimit = 'STOP_LIMIT',
  TrailingStop = 'TRAILING_STOP',
  MarketOnClose = 'MARKET_ON_CLOSE',
  Exercise = 'EXERCISE',
}

export enum ComplexOrderStrategyType {
  None = 'NONE',
  Covered = 'COVERED',
  Vertical = 'VERTICAL',
  BackRatio = 'BACK_RATIO',
  Calendar = 'CALENDAR',
  Diagonal = 'DIAGONAL',
  Straddle = 'STRADDLE',
  Strangle = 'STRANGLE',
  CollarSynthetic = 'COLLAR_SYNTHETIC',
  Butterfly = 'BUTTERFLY',
  Condor = 'CONDOR',
  IronCondor = 'IRON_CONDOR',
  VerticalRoll = 'VERTICAL_ROLL',
  CollarWithStock = 'COLLAR_WITH_STOCK',
  DoubleDiagonal = 'DOUBLE_DIAGONAL',
  UnbalancedButterfly = 'UNBALANCED_BUTTERFLY',
  UnbalancedCondor = 'UNBALANCED_CONDOR',
  UnbalancedIronCondor = 'UNBALANCED_IRON_CONDOR',
  UnbalancedVerticalRoll = 'UNBALANCED_VERTICAL_ROLL',
  Custom = 'CUSTOM',
}

export enum OrderDestination {
  INET = 'INET',
  ECN_ARCA = 'ECN_ARCA',
  CBOE = 'CBOE',
  AMEX = 'AMEX',
  PHLX = 'PHLX',
  ISE = 'ISE',
  BOX = 'BOX',
  NYSE = 'NYSE',
  NASDAQ = 'NASDAQ',
  BATS = 'BATS',
  C2 = 'C2',
  Auto = 'AUTO',
}

export enum OrderPriceLinkBasis {
  Manual = 'MANUAL',
  Base = 'BASE',
  Trigger = 'TRIGGER',
  Last = 'LAST',
  Bid = 'BID',
  Ask = 'ASK',
  AskBid = 'ASK_BID',
  Mark = 'MARK',
  Average = 'AVERAGE',
}

export enum OrderPriceLinkType {
  Value = 'VALUE',
  Percent = 'PERCENT',
  Tick = 'TICK',
}

export enum OrderStopType {
  Standard = 'STANDARD',
  Bid = 'BID',
  Ask = 'ASK',
  Last = 'LAST',
  Mark = 'MARK',
}

export enum OrderTaxLotMethod {
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  HighCost = 'HIGH_COST',
  LowCost = 'LOW_COST',
  AverageCost = 'AVERAGE_COST',
  SpecificLot = 'SPECIFIC_LOT',
}

export enum OrderSpecialInstruction {
  AllOrNone = 'ALL_OR_NONE',
  DoNotReduce = 'DO_NOT_REDUCE',
  AllOrNoneDoNotReduce = 'ALL_OR_NONE_DO_NOT_REDUCE',
}

export enum OrderStrategyType {
  Single = 'SINGLE',
  OCO = 'OCO',
  Trigger = 'TRIGGER',
}

export enum OrderStatus {
  AwaitingParentOrder = 'AWAITING_PARENT_ORDER',
  AwaitingCondition = 'AWAITING_CONDITION',
  AwaitingManualReview = 'AWAITING_MANUAL_REVIEW',
  Accepted = 'ACCEPTED',
  AwaitingUrOut = 'AWAITING_UR_OUT',
  PendingActivation = 'PENDING_ACTIVATION',
  Queued = 'QUEUED',
  Working = 'WORKING',
  Rejected = 'REJECTED',
  PendingCancel = 'PENDING_CANCEL',
  Canceled = 'CANCELED',
  PendingReplace = 'PENDING_REPLACE',
  Replaced = 'REPLACED',
  Filled = 'FILLED',
  Expired = 'EXPIRED',
}

export enum OrderLegType {
  Equity = 'EQUITY',
  Option = 'OPTION',
  Index = 'INDEX',
  MutualFund = 'MUTUAL_FUND',
  CashEquivalent = 'CASH_EQUIVALENT',
  FixedIncome = 'FIXED_INCOME',
  Currency = 'CURRENCY',
}

export enum OrderLegInstruction {
  Buy = 'BUY',
  Sell = 'SELL',
  BuyToCover = 'BUY_TO_COVER',
  SellShort = 'SELL_SHORT',
  BuyToOpen = 'BUY_TO_OPEN',
  BuyToClose = 'BUY_TO_CLOSE',
  SellToOpen = 'SELL_TO_OPEN',
  SellToClose = 'SELL_TO_CLOSE',
  Exchange = 'EXCHANGE',
}

export enum OrderLegPositionEffect {
  Opening = 'OPENING',
  Closing = 'CLOSING',
  Automatic = 'AUTOMATIC',
}

export enum OrderLegQuantityType {
  AllShares = 'ALL_SHARES',
  Dollars = 'DOLLARS',
  Shares = 'SHARES',
}

export enum OrderActivityType {
  Execution = 'EXECUTION',
  OrderAction = 'ORDER_ACTION',
}

export enum OrderExecutionType {
  Fill = 'FILL',
}

export interface OrderData {
  session: OrderSession;
  duration: OrderDuration;
  orderType: OrderType;
  cancelTime: OrderCancelTime;
  complexOrderStrategyType: ComplexOrderStrategyType;
  quantity: number;
  filledQuantity: number;
  remainingQuantity: number;
  requestedDestination: OrderDestination;
  destinationLinkName: string;
  releaseTime: string;
  stopPrice: number;
  stopPriceLinkBasis: OrderPriceLinkBasis;
  stopPriceLinkType: OrderPriceLinkType;
  stopPriceOffset: number;
  stopType: OrderStopType;
  priceLinkBasis: OrderPriceLinkBasis;
  priceLinkType: OrderPriceLinkType;
  price: number;
  taxLotMethod: OrderTaxLotMethod;
  orderLegCollection: OrderLegCollection[];
  activationPrice: number;
  specialInstruction: OrderSpecialInstruction;
  orderStrategyType: OrderStrategyType;
  orderId: number;
  cancelable: boolean;
  editable: boolean;
  status: OrderStatus;
  enteredTime: string;
  closeTime: string;
  tag: string;
  accountId: number;
  orderActivityCollection: OrderExecution[];
  replacingOrderCollection: OrderExecution[];
  childOrderStrategies: OrderData[];
  statusDescription: string;
}

export interface OrderCancelTime {
  date: string;
  shortFormat: boolean;
}

export interface OrderLegCollection {
  orderLegType: OrderLegType;
  legId: number;
  instrument: Instrument;
  instruction: OrderLegInstruction;
  positionEffect: OrderLegPositionEffect;
  quantity: number;
  quantityType: OrderLegQuantityType;
}

export interface OrderExecution {
  activityType: OrderActivityType;
  executionLegs: OrderExecutionLeg[];
  executionType: OrderExecutionType;
  orderRemainingQuantity: number;
  quantity: number;
}

export interface OrderExecutionLeg {
  legId: number;
  quantity: number;
  mismarkedQuantity: number;
  price: number;
  time: string;
}

export interface GetOrdersOptions {
  accountId?: number;
  maxResults?: number;
  fromEnteredTime: string;
  toEnteredTime: string;
  status?: OrderStatus;
}

export class OrderClient {
  constructor(private client: Client) {}

  async cancelOrder(accountId: number, orderId: number) {
    await this.client.delete(`accounts/${accountId}/orders/${orderId}`);
  }

  async getOrder(accountId: number, orderId: number) {
    const response = await this.client.get<OrderData>(
      `accounts/${accountId}/orders/${orderId}`
    );

    return response.data;
  }

  async getOrders(options: GetOrdersOptions) {
    const path = options.accountId
      ? `accounts/${options.accountId}/orders`
      : 'orders';

    const response = await this.client.get<OrderData[]>(path, {
      maxResults: options.maxResults || '',
      fromEnteredTime: options.fromEnteredTime,
      toEnteredTime: options.toEnteredTime,
      status: options.status || '',
    });

    return response.data;
  }

  async placeOrder(accountId: number, order: Partial<OrderData>) {
    const response = await this.client.post<OrderData>(
      `accounts/${accountId}/orders`,
      order
    );

    return response.data;
  }

  async replaceOrder(
    accountId: number,
    orderId: number,
    order: Partial<OrderData>
  ) {
    const response = await this.client.post<OrderData>(
      `accounts/${accountId}/orders/${orderId}`,
      order
    );

    return response.data;
  }
}

export class Order {
  constructor(protected data: OrderData, private orderClient: OrderClient) {}

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

  get tag() {
    return this.data.tag;
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

  toJson() {
    return { ...this.data };
  }

  async cancel() {
    await this.orderClient.cancelOrder(this.accountId, this.orderId);
  }

  async replace(order: Partial<OrderData>) {
    const data = await this.orderClient.replaceOrder(
      this.accountId,
      this.orderId,
      order
    );

    return createOrderInstance(data, this.orderClient);
  }

  async refresh() {
    this.data = await this.orderClient.getOrder(this.accountId, this.orderId);
  }
}

export function createOrderInstance(data: OrderData, orderClient: OrderClient) {
  return new Order(data, orderClient);
}

export function createOrderInstances(
  data: OrderData[],
  orderClient: OrderClient
) {
  return data.map((data) => new Order(data, orderClient));
}
