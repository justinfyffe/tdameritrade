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

export enum OrderLegQuantityType {
  AllShares = 'ALL_SHARES',
  Dollars = 'DOLLARS',
  Shares = 'SHARES',
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

export enum OrderSession {
  Normal = 'NORMAL',
  AM = 'AM',
  PM = 'PM',
  Seamless = 'SEAMLESS',
}

export enum OrderSpecialInstruction {
  AllOrNone = 'ALL_OR_NONE',
  DoNotReduce = 'DO_NOT_REDUCE',
  AllOrNoneDoNotReduce = 'ALL_OR_NONE_DO_NOT_REDUCE',
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

export enum OrderStopType {
  Standard = 'STANDARD',
  Bid = 'BID',
  Ask = 'ASK',
  Last = 'LAST',
  Mark = 'MARK',
}

export enum OrderStrategyType {
  Single = 'SINGLE',
  OCO = 'OCO',
  Trigger = 'TRIGGER',
}

export enum OrderTaxLotMethod {
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  HighCost = 'HIGH_COST',
  LowCost = 'LOW_COST',
  AverageCost = 'AVERAGE_COST',
  SpecificLot = 'SPECIFIC_LOT',
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
  accountId: string;
  orderActivityCollection: OrderExecution[];
  replacingOrderCollection: OrderExecution[];
  childOrderStrategies: Order[];
  statusDescription: string;
}

export interface OrderCancelTime {
  date: string;
  shortFormat: boolean;
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

export interface OrderLegCollection {
  orderLegType: OrderLegType;
  legId: number;
  instrument: Instrument;
  instruction: OrderLegInstruction;
  positionEffect: OrderLegPositionEffect;
  quantity: number;
  quantityType: OrderLegQuantityType;
}

export interface GetOrdersOptions {
  accountId?: number;
  maxResults?: number;
  fromEnteredTime: Date;
  toEnteredTime: Date;
  status?: OrderStatus;
}

export async function cancelOrder(
  td: TDAmeritrade,
  accountId: string,
  orderId: number
) {
  await apiDelete(td, `accounts/${accountId}/orders/${orderId}`);
}

export async function getOrder(
  td: TDAmeritrade,
  accountId: string,
  orderId: number
) {
  const response = await apiGet<Order>(
    td,
    `accounts/${accountId}/orders/${orderId}`
  );
  return response.data;
}

export async function getOrders(td: TDAmeritrade, options: GetOrdersOptions) {
  const path = options.accountId
    ? `accounts/${options.accountId}/orders`
    : 'orders';

  const response = await apiGet<Order[]>(td, path, {
    maxResults: options.maxResults || '',
    fromEnteredTime: format(options.fromEnteredTime, 'yyyy-MM-dd'),
    toEnteredTime: format(options.toEnteredTime, 'yyyy-MM-dd'),
    status: options.status || '',
  });

  return response.data;
}

export async function placeOrder(
  td: TDAmeritrade,
  accountId: string,
  order: Partial<Order>
) {
  const response = await apiPost<Order>(
    td,
    `accounts/${accountId}/orders`,
    order
  );

  return response.data;
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
    order
  );

  return response.data;
}
