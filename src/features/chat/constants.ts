/** Contract: chat messages are 1 to 1000 characters after trimming. */
export const MAX_MESSAGE_LENGTH = 1000;

/**
 * Contract 6.2: confirmation is an ordinary chat message. These exact phrases
 * are the ones the contract recommends for Confirm / Cancel buttons.
 */
export const CONFIRM_MESSAGE = "Yes, please.";
export const CANCEL_MESSAGE = "No, thanks.";
