/**
 * Plaid Bank Integration Service
 * Connects to Plaid API for bank account linking and transaction syncing
 */

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

interface LinkTokenConfig {
  userId: string;
  clientName: string;
  products: Array<'transactions' | 'auth' | 'identity' | 'balance' | 'liabilities' | 'investments'>;
  countryCodes: string[];
  language: string;
  webhook?: string;
}

interface PublicTokenExchangeResponse {
  accessToken: string;
  itemId: string;
}

interface AccountData {
  accountId: string;
  balance: number;
  name: string;
  type: string;
  subtype: string;
}

interface TransactionData {
  transactionId: string;
  amount: number;
  date: string;
  description: string;
  category: string[];
  merchantName: string;
}

/**
 * Create a Plaid Link token for bank account linking
 */
export async function createLinkToken(config: LinkTokenConfig): Promise<string> {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: config.userId,
      },
      client_name: config.clientName,
      products: config.products,
      country_codes: config.countryCodes,
      language: config.language,
      webhook: config.webhook,
    });

    return response.data.link_token;
  } catch (error: any) {
    console.error('Error creating link token:', error);
    throw new Error('Failed to create link token');
  }
}

/**
 * Exchange public token for access token
 */
export async function exchangePublicToken(publicToken: string): Promise<PublicTokenExchangeResponse> {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    return {
      accessToken: response.data.access_token,
      itemId: response.data.item_id,
    };
  } catch (error: any) {
    console.error('Error exchanging public token:', error);
    throw new Error('Failed to exchange public token');
  }
}

/**
 * Get bank accounts for an access token
 */
export async function getBankAccounts(accessToken: string): Promise<AccountData[]> {
  try {
    const response = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    return response.data.accounts.map(account => ({
      accountId: account.account_id,
      balance: account.balances?.current || 0,
      name: account.name,
      type: account.type,
      subtype: account.subtype || '',
    }));
  } catch (error: any) {
    console.error('Error fetching bank accounts:', error);
    throw new Error('Failed to fetch bank accounts');
  }
}

/**
 * Get transactions for an access token
 */
export async function getTransactions(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<TransactionData[]> {
  try {
    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    });

    return response.data.transactions.map(transaction => ({
      transactionId: transaction.transaction_id,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.name,
      category: transaction.category || [],
      merchantName: transaction.merchant_name || '',
    }));
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
}

/**
 * Sync transactions (real-time updates via webhook)
 */
export async function syncTransactions(accessToken: string): Promise<TransactionData[]> {
  try {
    const response = await plaidClient.transactionsSync({
      access_token: accessToken,
    });

    return response.data.added.map(transaction => ({
      transactionId: transaction.transaction_id,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.name,
      category: transaction.category || [],
      merchantName: transaction.merchant_name || '',
    }));
  } catch (error: any) {
    console.error('Error syncing transactions:', error);
    throw new Error('Failed to sync transactions');
  }
}

/**
 * Get account balances
 */
export async function getAccountBalances(accessToken: string): Promise<AccountData[]> {
  try {
    const response = await plaidClient.accountsBalanceGet({
      access_token: accessToken,
    });

    return response.data.accounts.map(account => ({
      accountId: account.account_id,
      balance: account.balances?.current || 0,
      name: account.name,
      type: account.type,
      subtype: account.subtype || '',
    }));
  } catch (error: any) {
    console.error('Error fetching account balances:', error);
    throw new Error('Failed to fetch account balances');
  }
}

/**
 * Remove bank account (delete item)
 */
export async function removeBankAccount(accessToken: string): Promise<boolean> {
  try {
    await plaidClient.itemRemove({
      access_token: accessToken,
    });
    return true;
  } catch (error: any) {
    console.error('Error removing bank account:', error);
    throw new Error('Failed to remove bank account');
  }
}
