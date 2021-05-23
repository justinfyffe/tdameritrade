import { format } from 'date-fns';
import { apiDelete, apiGet, apiPost, apiPut } from './client';
import { Instrument } from './positions';
import { TDAmeritrade } from './tdameritrade';

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
  accountId: number;
  cancelable: boolean;
  closeTime: string;
  complexOrderStrategyType: ComplexOrderStrategyType;
  destinationLinkName: string;
  duration: OrderDuration;
  editable: boolean;
  enteredTime: string;
  filledQuantity: number;
  orderActivityCollection?: OrderExecution[];
  orderId: number;
  orderLegCollection: OrderLegCollection[];
  orderStrategyType: OrderStrategyType;
  orderType: OrderType;
  price: number;
  quantity: number;
  remainingQuantity: number;
  requestedDestination: OrderDestination;
  session: OrderSession;
  status: OrderStatus;
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
  mismarkedQuantity: number;
  price: number;
  quantity: number;
  time: string;
}

export interface OrderLegCollection {
  instruction: OrderLegInstruction;
  instrument: Instrument;
  legId: number;
  orderLegType: OrderLegType;
  positionEffect: OrderLegPositionEffect;
  quantity: number;
}

export interface GetOrdersOptions {
  accountId?: string;
  maxResults?: number;
  fromEnteredTime?: Date;
  toEnteredTime?: Date;
  status?: OrderStatus;
}

export async function cancelOrder(
  td: TDAmeritrade,
  accountId: string,
  orderId: number
) {
  await apiDelete(td, `accounts/${accountId}/orders/${orderId}`, {
    throttle: false,
  });
}

export async function getOrder(
  td: TDAmeritrade,
  accountId: string,
  orderId: number
) {
  const response = await apiGet<Order>(
    td,
    `accounts/${accountId}/orders/${orderId}`,
    null,
    { throttle: false }
  );
  return response?.data;
}

export async function getOrders(td: TDAmeritrade, options: GetOrdersOptions) {
  const path = options.accountId
    ? `accounts/${options.accountId}/orders`
    : 'orders';

  const response = await apiGet<Order[]>(
    td,
    path,
    {
      maxResults: options.maxResults || '',
      fromEnteredTime: options.fromEnteredTime
        ? format(options.fromEnteredTime, 'yyyy-MM-dd')
        : undefined,
      toEnteredTime: options.toEnteredTime
        ? format(options.toEnteredTime, 'yyyy-MM-dd')
        : undefined,
      status: options.status || '',
    },
    { throttle: false }
  );

  return response?.data;
}

export async function placeOrder(
  td: TDAmeritrade,
  accountId: string,
  order: Partial<Order>
) {
  const response = await apiPost<Order>(
    td,
    `accounts/${accountId}/orders`,
    order,
    { throttle: false }
  );

  return response?.data;
}

export async function replaceOrder(
  td: TDAmeritrade,
  accountId: string,
  orderId: number,
  order: Partial<Order>
) {
  const response = await apiPut<Order>(
    td,
    `accounts/${accountId}/orders/${orderId}`,
    order,
    { throttle: false }
  );

  return response?.data;
}
