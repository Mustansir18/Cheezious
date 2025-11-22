
'use server';
/**
 * @fileOverview A flow for synchronizing order data with an external system.
 *
 * This file defines the Genkit flow responsible for taking processed order data
 * from the Cheezious Connect application and transmitting it to a third-party
 * system, such as a POS or an ERP like Microsoft Dynamics 365.
 *
 * - syncOrderToExternalSystem - An exported function that triggers the synchronization flow.
 */

import { type SyncOrderInput, type SyncOrderOutput } from '@/lib/types';


/**
 * Triggers the Genkit flow to synchronize an order with an external system.
 * This is a wrapper function to provide a clean, callable interface from server components.
 * @param input The order data that conforms to the SyncOrderInput schema.
 * @returns A promise that resolves with the output of the synchronization flow.
 */
export async function syncOrderToExternalSystem(input: SyncOrderInput): Promise<SyncOrderOutput> {
  console.log('SYNCING ORDER TO EXTERNAL SYSTEM:', input.orderNumber);

  const apiEndpoint = process.env.DYNAMICS_RSSU_API_ENDPOINT;

  if (!apiEndpoint) {
    console.error('DYNAMICS_RSSU_API_ENDPOINT is not set. Skipping synchronization.');
    return {
      success: false,
      message: 'API endpoint is not configured. Please set DYNAMICS_RSSU_API_ENDPOINT in your .env file.',
    };
  }

  try {
    // In a real-world scenario, you would handle authentication here,
    // e.g., by fetching an OAuth token and adding it to the headers.
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_AUTH_TOKEN', // Add your auth token here
      },
      body: JSON.stringify(input),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(`Successfully synced order ${input.orderNumber} to external system.`);
      return {
        success: true,
        // Assuming the external API returns an ID in a field like 'externalId' or 'salesId'
        externalId: responseData.externalId || `EXT-${input.id}`,
        message: 'Order synchronized successfully with external system.',
      };
    } else {
      const errorBody = await response.text();
      console.error(`Failed to sync order ${input.orderNumber}. Status: ${response.status}. Body: ${errorBody}`);
      return {
        success: false,
        message: `Failed to sync with external system. Status: ${response.status}.`,
      };
    }
  } catch (error: any) {
    console.error(`An error occurred during synchronization: ${error.message}`);
    return {
      success: false,
      message: 'An unexpected network error occurred while trying to connect to the external system.',
    };
  }
}
