import { format } from 'date-fns';
import { Client } from './client';
import { Instrument } from './positions';

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

export enum OrderActivityType {
  Execution = 'EXECUTION',
  OrderAction = 'ORDER_ACTION',
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

export enum OrderDuration {
  Day = 'DAY',
  GoodTillCancel = 'GOOD_TILL_CANCEL',
  FillOrKill = 'FILL_OR_KILL',
}

export enum OrderExecutionType {
  Fill = 'FILL',
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

export enum OrderLegType {
  Equity = 'EQUITY',
  Option = 'OPTION',
  Index = 'INDEX',
  MutualFund = 'MUTUAL_FUND',
  CashEquivalent = 'CASH_EQUIVALENT',
  FixedIncome = 'FIXED_INCOME',
  Currency = 'CURRENCY',
}

export enum OrderSession {
  Normal = 'NORMAL',
  AM = 'AM',
  PM = 'PM',
  Seamless = 'SEAMLESS',
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

export enum OrderStrategyType {
  Single = 'SINGLE',
  OCO = 'OCO',
  Trigger = 'TRIGGER',
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

export interface Order {
  session: OrderSession;
  duration: OrderDuration;
  orderType: OrderType;
  complexOrderStrategyType: ComplexOrderStrategyType;
  quantity: number;
  filledQuantity: number;
  remainingQuantity: number;
  requestedDestination: OrderDestination;
  destinationLinkName: string;
  price: number;
  orderLegCollection: OrderLeg[];
  orderStrategyType: OrderStrategyType;
  orderId: number;
  cancelable: boolean;
  editable: boolean;
  status: OrderStatus;
  enteredTime: string;
  closeTime: string;
  accountId: number;
  orderActivityCollection?: OrderActivity[];
}

export interface OrderActivity {
  activityType: OrderActivityType;
  executionType: OrderExecutionType;
  quantity: number;
  orderRemainingQuantity: number;
  executionLegs: OrderExecutionLeg[];
}

export interface OrderExecutionLeg {
  legId: number;
  quantity: number;
  mismarkedQuantity: number;
  price: number;
  time: string;
}

export interface OrderLeg {
  orderLegType: OrderLegType;
  legId: number;
  instrument: Instrument;
  positionEffect: OrderLegPositionEffect;
  quantity: number;
}

export interface ListOrdersOptions {
  accountId?: string;
  maxResults?: number;
  fromEnteredTime?: Date;
  toEnteredTime?: Date;
  status?: OrderStatus;
}

export class OrderService {
  constructor(private client: Client) {}

  async cancel(accountId: string, orderId: number) {
    await this.client.delete(`accounts/${accountId}/orders/${orderId}`);
  }

  async get(accountId: string, orderId: number) {
    const response = await this.client.get<Order>(
      `accounts/${accountId}/orders/${orderId}`,
      null
    );
    return response?.data;
  }

  async getMultiple(options: ListOrdersOptions) {
    const path = options.accountId
      ? `accounts/${options.accountId}/orders`
      : 'orders';

    const response = await this.client.get<Order[]>(path, {
      maxResults: options.maxResults || '',
      fromEnteredTime: options.fromEnteredTime
        ? format(options.fromEnteredTime, 'yyyy-MM-dd')
        : undefined,
      toEnteredTime: options.toEnteredTime
        ? format(options.toEnteredTime, 'yyyy-MM-dd')
        : undefined,
      status: options.status || '',
    });

    return response?.data;
  }

  async place(accountId: string, order: Partial<Order>) {
    const response = await this.client.post<Order>(
      `accounts/${accountId}/orders`,
      order
    );

    return response?.data;
  }

  async replace(accountId: string, orderId: number, order: Partial<Order>) {
    const response = await this.client.put<Order>(
      `accounts/${accountId}/orders/${orderId}`,
      order
    );

    return response?.data;
  }
}
