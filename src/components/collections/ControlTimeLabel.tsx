import { getControlTimeLabel } from "../../utils/collectionLabels";

type Props = {
  value: string | null | undefined;
  className?: string;
};

export default function ControlTimeLabel({ value, className = "" }: Props) {
  return <span className={className}>{getControlTimeLabel(value)}</span>;
}
