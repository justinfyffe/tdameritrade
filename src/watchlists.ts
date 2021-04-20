import { Client } from './client';

export enum WatchlistAssetType {
  Equity = 'EQUITY',
  Option = 'OPTION',
  MutualFund = 'MUTUAL_FUND',
  FixedIncome = 'FIXED_INCOME',
  Index = 'INDEX',
}

export enum WatchlistStatus {
  Unchanged = 'UNCHANGED',
  Created = 'CREATED',
  Updated = 'UPDATED',
  Deleted = 'DELETED',
}

export interface WatchlistData {
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
  assetType: WatchlistAssetType;
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

export class WatchlistClient {
  constructor(private client: Client) {}

  async createWatchlist(accountId: number, watchlist: CreateWatchlistRequest) {
    await this.client.post(`accounts/${accountId}/watchlists`, watchlist);
  }

  async deleteWatchlist(accountId: number, watchlistId: number) {
    await this.client.delete(`accounts/${accountId}/watchlists/${watchlistId}`);
  }

  async getWatchlist(accountId: number, watchlistId: number) {
    const response = await this.client.get<WatchlistData>(
      `accounts/${accountId}/watchlists/${watchlistId}`
    );
    return response.data;
  }

  async getWatchlists(accountId?: number) {
    const path =
      accountId != null
        ? `accounts/${accountId}/watchlists`
        : 'accounts/watchlists';

    const response = await this.client.get<WatchlistData[]>(path);
    return response.data;
  }

  async replaceWatchlist(
    accountId: number,
    watchlistId: number,
    watchlist: UpdateWatchlistRequest
  ) {
    await this.client.put(
      `accounts/${accountId}/watchlists/${watchlistId}`,
      watchlist
    );
  }
}

export class Watchlist {
  constructor(
    protected data: WatchlistData,
    private watchlistClient: WatchlistClient
  ) {}

  get name() {
    return this.data.name;
  }

  get watchlistId() {
    return this.data.watchlistId;
  }

  get accountId() {
    return this.data.accountId;
  }

  get status() {
    return this.data.status;
  }

  get watchlistItems() {
    return this.data.watchlistItems;
  }

  toJson() {
    return { ...this.data } as WatchlistData;
  }

  async delete() {
    await this.watchlistClient.deleteWatchlist(
      this.accountId,
      this.watchlistId
    );
  }

  async replace(watchlist: UpdateWatchlistRequest) {
    await this.watchlistClient.replaceWatchlist(
      this.accountId,
      this.watchlistId,
      watchlist
    );
    await this.refresh();
  }

  async refresh() {
    this.data = await this.watchlistClient.getWatchlist(
      this.accountId,
      this.watchlistId
    );
  }
}

export function createWatchlistInstance(
  data: WatchlistData,
  watchlistClient: WatchlistClient
) {
  return new Watchlist(data, watchlistClient);
}

export function createWatchlistInstances(
  data: WatchlistData[],
  watchlistClient: WatchlistClient
) {
  return data.map((data) => new Watchlist(data, watchlistClient));
}
