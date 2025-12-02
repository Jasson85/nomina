'use server';

/**
 * @fileOverview This file defines a Genkit flow for advising on leave policies based on employee requests.
 *
 * The flow takes an employee's leave request details and returns relevant company policies and legal regulations to aid in decision-making.
 *
 * @exports {leavePolicyAdvisor} - The main function to trigger the leave policy advising flow.
 * @exports {LeavePolicyAdvisorInput} - The input type for the leavePolicyAdvisor function.
 * @exports {LeavePolicyAdvisorOutput} - The output type for the leavePolicyAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the leave policy advisor
const LeavePolicyAdvisorInputSchema = z.object({
  employeeId: z.string().describe('The unique identifier of the employee.'),
  leaveType: z.string().describe('The type of leave requested (e.g., vacation, sick leave).'),
  startDate: z.string().describe('The start date of the leave request (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date of the leave request (YYYY-MM-DD).'),
  reason: z.string().describe('The reason for the leave request.'),
  companyPolicies: z.string().describe('A summary of company policies related to leave.'),
  relevantLaws: z.string().describe('A summary of relevant Colombian labor laws.'),
});

export type LeavePolicyAdvisorInput = z.infer<typeof LeavePolicyAdvisorInputSchema>;

// Define the output schema for the leave policy advisor
const LeavePolicyAdvisorOutputSchema = z.object({
  policyRecommendation: z.string().describe('A recommendation on whether to approve or deny the leave request based on policies and laws.'),
  relevantPolicyDetails: z.string().describe('Specific details from company policies relevant to the request.'),
  relevantLawDetails: z.string().describe('Specific details from Colombian labor laws relevant to the request.'),
  additionalNotes: z.string().describe('Any additional notes or considerations for the payroll administrator.'),
});

export type LeavePolicyAdvisorOutput = z.infer<typeof LeavePolicyAdvisorOutputSchema>;


// Define the main function that will be exported
export async function leavePolicyAdvisor(input: LeavePolicyAdvisorInput): Promise<LeavePolicyAdvisorOutput> {
  return leavePolicyAdvisorFlow(input);
}

// Define the prompt for the leave policy advisor
const leavePolicyAdvisorPrompt = ai.definePrompt({
  name: 'leavePolicyAdvisorPrompt',
  input: {schema: LeavePolicyAdvisorInputSchema},
  output: {schema: LeavePolicyAdvisorOutputSchema},
  prompt: `You are an AI assistant helping payroll administrators in Colombia make informed decisions about employee leave requests.

  Analyze the following leave request details, company policies, and relevant Colombian labor laws to provide a recommendation on whether to approve or deny the request.

  Leave Request Details:
  - Employee ID: {{{employeeId}}}
  - Leave Type: {{{leaveType}}}
  - Start Date: {{{startDate}}}
  - End Date: {{{endDate}}}
  - Reason: {{{reason}}}

  Company Policies:
  {{{companyPolicies}}}

  Relevant Colombian Labor Laws:
  {{{relevantLaws}}}

  Based on the above information, provide a well-reasoned recommendation, including specific policy and law details, and any additional notes for the administrator.

  Here is the desired output:
  ${LeavePolicyAdvisorOutputSchema.description}
  `,
});

// Define the Genkit flow for the leave policy advisor
const leavePolicyAdvisorFlow = ai.defineFlow(
  {
    name: 'leavePolicyAdvisorFlow',
    inputSchema: LeavePolicyAdvisorInputSchema,
    outputSchema: LeavePolicyAdvisorOutputSchema,
  },
  async input => {
    const {output} = await leavePolicyAdvisorPrompt(input);
    return output!;
  }
);
