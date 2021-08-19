import { Client } from './client';
import { AssetType } from './instruments';

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

export class Watchlists {
  constructor(private client: Client) {}

  async create(accountId: string, watchlist: CreateWatchlistRequest) {
    await this.client.post(`accounts/${accountId}/watchlists`, watchlist);
  }

  async delete(accountId: string, watchlistId: number) {
    await this.client.delete(`accounts/${accountId}/watchlists/${watchlistId}`);
  }

  async get(accountId: string, watchlistId: number) {
    const response = await this.client.get<Watchlist>(
      `accounts/${accountId}/watchlists/${watchlistId}`
    );
    return response?.data;
  }

  async getAll(accountId?: string) {
    const path =
      accountId != null
        ? `accounts/${accountId}/watchlists`
        : 'accounts/watchlists';

    const response = await this.client.get<Watchlist[]>(path);
    return response?.data;
  }

  async replace(
    accountId: string,
    watchlistId: number,
    watchlist: UpdateWatchlistRequest
  ) {
    await this.client.put(
      `accounts/${accountId}/watchlists/${watchlistId}`,
      watchlist
    );
  }
}
