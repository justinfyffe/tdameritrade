import { apiDelete, apiGet, apiPost, apiPut } from './client';
import { AssetType } from './instruments';
import { TDAmeritrade } from './tdameritrade';

export enum WatchlistStatus {
  Unchanged = 'UNCHANGED',
  Created = 'CREATED',
  Updated = 'UPDATED',
  Deleted = 'DELETED',
}

export interface Watchlist {
  name: string;
  watchlistId: number;
  accountId: string;
  status: WatchlistStatus;
  watchlistItems: WatchlistItem[];
}

export interface WatchlistItem {
  quantity: number;
  averagePrice: number;
  commission: number;
  purchasedDate: string;
  instrument: WatchlistInstrument;
  status: WatchlistStatus;
}

export interface WatchlistInstrument {
  symbol: string;
  description: string;
  assetType: AssetType;
}

export interface CreateWatchlistRequest {
  name: string;
  watchlistItems: CreateWatchlistItem[];
}

interface CreateWatchlistItem
  extends Omit<WatchlistItem, 'instrument' | 'status'> {
  instrument: Omit<WatchlistInstrument, 'description'>;
}

export interface UpdateWatchlistRequest {
  name: string;
  watchlistId: string;
  watchlistItems: UpdateWatchlistItem[];
}

interface UpdateWatchlistItem
  extends Omit<WatchlistItem, 'instrument' | 'status'> {
  instrument: Omit<WatchlistInstrument, 'description'>;
  sequenceId: number;
}

export async function createWatchlist(
  td: TDAmeritrade,
  accountId: string,
  watchlist: CreateWatchlistRequest
) {
  await apiPost(td, `accounts/${accountId}/watchlists`, watchlist);
}

export async function deleteWatchlist(
  td: TDAmeritrade,
  accountId: string,
  watchlistId: number
) {
  await apiDelete(td, `accounts/${accountId}/watchlists/${watchlistId}`);
}

export async function getWatchlist(
  td: TDAmeritrade,
  accountId: string,
  watchlistId: number
) {
  const response = await apiGet<Watchlist>(
    td,
    `accounts/${accountId}/watchlists/${watchlistId}`
  );
  return response?.data;
}

export async function getWatchlists(td: TDAmeritrade, accountId?: string) {
  const path =
    accountId != null
      ? `accounts/${accountId}/watchlists`
      : 'accounts/watchlists';

  const response = await apiGet<Watchlist[]>(td, path);
  return response?.data;
}

export async function replaceWatchlist(
  td: TDAmeritrade,
  accountId: string,
  watchlistId: number,
  watchlist: UpdateWatchlistRequest
) {
  await apiPut(
    td,
    `accounts/${accountId}/watchlists/${watchlistId}`,
    watchlist
  );
}
