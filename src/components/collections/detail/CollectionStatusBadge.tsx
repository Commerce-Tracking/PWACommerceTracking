import Badge from "../../ui/badge/Badge";

type Props = {
  status: string | null | undefined;
  size?: "sm" | "md";
};

const STATUS_COLORS: Record<
  string,
  "success" | "warning" | "error" | "info" | "light"
> = {
  validated: "success",
  approved: "success",
  submitted: "warning",
  pending: "warning",
  rejected: "error",
  draft: "light",
};

/** Badge statut collecte — purement présentationnel. */
export default function CollectionStatusBadge({
  status,
  size = "sm",
}: Props) {
  const key = (status || "").toLowerCase();
  const color = STATUS_COLORS[key] || "light";

  return (
    <Badge variant="light" color={color} size={size}>
      {status || "—"}
    </Badge>
  );
}
