import Badge from "../ui/badge/Badge";
import {
  getCollectionTypeLabel,
  type CollectionType,
} from "../../utils/collectionLabels";

const TYPE_COLORS: Record<
  CollectionType | "default",
  "primary" | "success" | "warning" | "info" | "light"
> = {
  livestock: "warning",
  agricultural: "success",
  fishery: "info",
  mixed: "primary",
  default: "light",
};

type Props = {
  type: string | null | undefined;
  size?: "sm" | "md";
};

export default function CollectionTypeBadge({ type, size = "sm" }: Props) {
  const color =
    TYPE_COLORS[(type as CollectionType) || "default"] || TYPE_COLORS.default;

  return (
    <Badge variant="light" color={color} size={size}>
      <span className="whitespace-nowrap">{getCollectionTypeLabel(type)}</span>
    </Badge>
  );
}
