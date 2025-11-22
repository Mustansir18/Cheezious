
'use server';
/**
 * @fileOverview A flow for synchronizing order data with an external system.
 *
 * This file defines the Genkit flow responsible for taking processed order data
 * from the Cheezious Connect application and transmitting it to a third-party
 * system, such as a POS or an ERP like Microsoft Dynamics 365.
 *
 * - syncOrderToExternalSystem - An exported function that triggers the synchronization flow.
 * - SyncOrderInput - The Zod schema defining the structure of the order data to be synced.
 * - SyncOrderOutput - The Zod schema for the expected response from the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Defines the schema for a single item within the order.
const OrderItemSchema = z.object({
  menuItemId: z.string().describe('The unique identifier for the menu item.'),
  name: z.string().describe('The name of the menu item.'),
  quantity: z.number().describe('The quantity of this item ordered.'),
  itemPrice: z.number().describe('The price of a single unit of this item.'),
});

// Defines the schema for the entire order that will be sent to the external system.
export const SyncOrderInputSchema = z.object({
  id: z.string().describe('The unique identifier for the order from Firestore.'),
  branchId: z.string().describe('The identifier for the branch where the order was placed.'),
  orderDate: z.string().describe('The ISO 8601 timestamp when the order was placed.'),
  orderType: z.enum(['Dine-In', 'Take-Away']).describe('The type of order.'),
  status: z.string().describe('The current status of the order (e.g., "Pending").'),
  totalAmount: z.number().describe('The total cost of the order.'),
  orderNumber: z.string().describe('The human-readable order number.'),
  items: z.array(OrderItemSchema).describe('An array of items included in the order.'),
});
export type SyncOrderInput = z.infer<typeof SyncOrderInputSchema>;

// Defines the schema for the response after attempting to sync the order.
export const SyncOrderOutputSchema = z.object({
  success: z.boolean().describe('Indicates whether the synchronization was successful.'),
  externalId: z.string().optional().describe('The identifier for the order in the external system, if successful.'),
  message: z.string().describe('A message detailing the result of the operation.'),
});
export type SyncOrderOutput = z.infer<typeof SyncOrderOutputSchema>;


/**
 * Triggers the Genkit flow to synchronize an order with an external system.
 * This is a wrapper function to provide a clean, callable interface from server components.
 * @param input The order data that conforms to the SyncOrderInput schema.
 * @returns A promise that resolves with the output of the synchronization flow.
 */
export async function syncOrderToExternalSystem(input: SyncOrderInput): Promise<SyncOrderOutput> {
  return syncOrderFlow(input);
}


/**
 * The main Genkit flow for synchronizing order data.
 *
 * This flow sends the order data to an external API endpoint, which is expected
 * to be a proxy to a local Dynamics 365 RSSU server.
 */
const syncOrderFlow = ai.defineFlow(
  {
    name: 'syncOrderFlow',
    inputSchema: SyncOrderInputSchema,
    outputSchema: SyncOrderOutputSchema,
  },
  async (input) => {
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
);
