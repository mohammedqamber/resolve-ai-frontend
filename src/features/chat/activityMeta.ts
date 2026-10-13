import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  CreditCardIcon,
  HourglassIcon,
  type LucideIcon,
  PackageSearchIcon,
  ReceiptTextIcon,
  TicketIcon,
  WrenchIcon,
} from "lucide-react";

import type { ActivityStatus } from "./types";

type ToolMeta = { label: string; description: string; icon: LucideIcon };

// Known agent tools (contract 6.3). New tools (e.g. a RAG knowledge-base
// search) only need an entry here; unknown tools still render by name.
const TOOLS: Record<string, ToolMeta> = {
  getOrderDetails: {
    label: "Order lookup",
    description: "Finds the customer's order by ID or product word",
    icon: PackageSearchIcon,
  },
  getRefundStatus: {
    label: "Refund status",
    description: "Reads the refund record for an order",
    icon: ReceiptTextIcon,
  },
  getPaymentDetails: {
    label: "Payment details",
    description: "Reads charges and refund transfers",
    icon: CreditCardIcon,
  },
  createSupportTicket: {
    label: "Support ticket",
    description: "Proposes a ticket, or creates it after confirmation",
    icon: TicketIcon,
  },
};

export function getToolMeta(tool: string): ToolMeta {
  return TOOLS[tool] ?? { label: tool, description: "Agent tool", icon: WrenchIcon };
}

type StatusMeta = { label: string; icon: LucideIcon; className: string; spin?: boolean };

const STATUSES: Record<ActivityStatus, StatusMeta> = {
  success: { label: "Completed", icon: CircleCheckIcon, className: "text-success" },
  awaiting_confirmation: {
    label: "Waiting for your confirmation",
    icon: HourglassIcon,
    className: "text-warning",
  },
  error: { label: "Failed", icon: CircleXIcon, className: "text-destructive/80" },
  started: { label: "In progress", icon: CircleDashedIcon, className: "text-muted-foreground", spin: true },
};

export function getStatusMeta(status: string): StatusMeta {
  return (
    STATUSES[status as ActivityStatus] ?? {
      label: status,
      icon: CircleDashedIcon,
      className: "text-muted-foreground",
    }
  );
}
