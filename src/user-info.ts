import { apiGet } from './client';
import { TDAmeritrade } from './tdameritrade';

export enum EquityOrderLegInstruction {
  Buy = 'BUY',
  Sell = 'SELL',
  BuyToCover = 'BUY_TO_COVER',
  SellShort = 'SELL_SHORT',
  None = 'NONE',
}

export enum EquityOrderType {
  Market = 'MARKET',
  Limit = 'LIMIT',
  Stop = 'STOP',
  StopLimit = 'STOP_LIMIT',
  TrailingStop = 'TRAILING_STOP',
  MarketOnClose = 'MARKET_ON_CLOSE',
  None = 'NONE',
}

export enum EquityOrderPriceLinkType {
  Value = 'VALUE',
  Percent = 'PERCENT',
  None = 'NONE',
}

export enum EquityOrderDuration {
  Day = 'DAY',
  GoodTillCancel = 'GOOD_TILL_CANCEL',
  None = 'NONE',
}

export enum EquityOrderMarketSession {
  AM = 'AM',
  PM = 'PM',
  Normal = 'NORMAL',
  Seamless = 'SEAMLESS',
  None = 'NONE',
}

export enum TaxLotMethod {
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  HighCost = 'HIGH_COST',
  LowCost = 'LOW_COST',
  MinimumTax = 'MINIMUM_TAX',
  AverageCost = 'AVERAGE_COST',
  None = 'NONE',
}

export enum AdvancedToolLaunch {
  TA = 'TA',
  N = 'N',
  Y = 'Y',
  TOS = 'TOS',
  None = 'NONE',
  CC2 = 'CC2',
}

export enum AuthTokenTimeout {
  FiftyFiveMinutes = 'FIFTY_FIVE_MINUTES',
  TwoHours = 'TWO_HOURS',
  FourHours = 'FOUR_HOURS',
  EightHours = 'EIGHT_HOURS',
}

export enum ProfessionalStatus {
  Professional = 'PROFESSIONAL',
  NonProfessional = 'NON_PROFESSIONAL',
  UnknownStatus = 'UNKNOWN_STATUS',
}

export enum OptionTradingLevel {
  Covered = 'COVERED',
  Full = 'FULL',
  Long = 'LONG',
  Spread = 'SPREAD',
  None = 'NONE',
}

export enum UserPrincipalField {
  StreamerSubscriptionKeys = 'streamerSubscriptionKeys',
  StreamerConnectionInfo = 'streamerConnectionInfo',
  Preferences = 'preferences',
  SurrogateIds = 'surrogateIds',
}

export interface Preferences {
  expressTrading: boolean;
  directOptionsRouting: boolean;
  directEquityRouting: boolean;
  defaultEquityOrderLegInstruction: EquityOrderLegInstruction;
  defaultEquityOrderType: EquityOrderType;
  defaultEquityOrderPriceLinkType: EquityOrderPriceLinkType;
  defaultEquityOrderDuration: EquityOrderDuration;
  defaultEquityOrderMarketSession: EquityOrderMarketSession;
  defaultEquityQuantity: number;
  mutualFundTaxLotMethod: TaxLotMethod;
  optionTaxLotMethod: TaxLotMethod;
  equityTaxLotMethod: TaxLotMethod;
  defaultAdvancedToolLaunch: AdvancedToolLaunch;
  authTokenTimeout: AuthTokenTimeout;
}

export interface SubscriptionKeys {
  keys: SubscriptionKey[];
}

export interface SubscriptionKey {
  key: string;
}

export interface UserPrincipal {
  authToken: string;
  userId: string;
  userCdDomainId: string;
  primaryAccountId: string;
  lastLoginTime: string;
  tokenExpirationTime: string;
  loginTime: string;
  accessLevel: string;
  stalePassword: boolean;
  streamerInfo: StreamerInfo;
  professionalStatus: ProfessionalStatus;
  quotes: QuoteSettings;
  streamerSubscriptionKeys: SubscriptionKeys;
  accounts: AccountSettings[];
}

export interface StreamerInfo {
  streamerBinaryUrl: string;
  streamerSocketUrl: string;
  token: string;
  tokenTimestamp: string;
  userGroup: string;
  accessLevel: string;
  acl: string;
  appId: string;
}

export interface QuoteSettings {
  isNyseDelayed: boolean;
  isNasdaqDelayed: boolean;
  isOpraDelayed: boolean;
  isAmexDelayed: boolean;
  isCmeDelayed: boolean;
  isIceDelayed: boolean;
  isForexDelayed: boolean;
  streamerSubscriptionKeys: SubscriptionKeys;
  accounts: AccountSettings;
}

export interface AccountSettings {
  accountId: string;
  description: string;
  displayName: string;
  accountCdDomainId: string;
  company: string;
  segment: string;
  surrogateIds: unknown;
  preferences: Preferences;
  acl: string;
  authorizations: AccountAuthorizations;
}

export interface AccountAuthorizations {
  apex: boolean;
  levelTwoQuotes: boolean;
  stockTrading: boolean;
  marginTrading: boolean;
  streamingNews: boolean;
  optionTradingLevel: OptionTradingLevel;
  streamerAccess: boolean;
  advancedMargin: boolean;
  scottradeAccount: boolean;
}

export async function getPreferences(td: TDAmeritrade, accountId: number) {
  const response = await apiGet<Preferences>(
    td,
    `accounts/${accountId}/preferences`
  );

  return response.data;
}

export async function updatePreferences(
  accountId: number,
  preferences: Preferences
) {
  await this.client.put(`accounts/${accountId}/preferences`, preferences);
}

export async function getStreamerSubscriptionKeys(
  td: TDAmeritrade,
  accountIds: number[]
) {
  const response = await apiGet<SubscriptionKeys>(
    td,
    'userprincipals/streamersubscriptionkeys',
    { accountIds: accountIds.join(',') }
  );

  return response.data;
}

export async function getUserPrincipals(
  td: TDAmeritrade,
  fields: UserPrincipalField[] = []
) {
  const response = await apiGet<UserPrincipal>(td, 'userprincipals', {
    fields: fields.join(','),
  });
  return response.data;
}
