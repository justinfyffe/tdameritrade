import { apiGet, apiPost, apiPut } from './client';
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
  accountId: number;
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
  accountId: number,
  watchlist: CreateWatchlistRequest
) {
  await apiPost(td, `accounts/${accountId}/watchlists`, watchlist);
}

export async function deleteWatchlist(
  td: TDAmeritrade,
  accountId: number,
  watchlistId: number
) {
  await this.client.delete(`accounts/${accountId}/watchlists/${watchlistId}`);
}

export async function getWatchlist(
  td: TDAmeritrade,
  accountId: number,
  watchlistId: number
) {
  const response = await apiGet<Watchlist>(
    td,
    `accounts/${accountId}/watchlists/${watchlistId}`
  );
  return response.data;
}

export async function getWatchlists(td: TDAmeritrade, accountId?: number) {
  const path =
    accountId != null
      ? `accounts/${accountId}/watchlists`
      : 'accounts/watchlists';

  const response = await apiGet<Watchlist[]>(td, path);
  return response.data;
}

export async function replaceWatchlist(
  td: TDAmeritrade,
  accountId: number,
  watchlistId: number,
  watchlist: UpdateWatchlistRequest
) {
  await apiPut(
    td,
    `accounts/${accountId}/watchlists/${watchlistId}`,
    watchlist
  );
}
