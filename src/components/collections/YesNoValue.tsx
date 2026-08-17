import { formatYesNo } from "../../utils/collectionLabels";

type Props = {
  value: boolean | number | string | null | undefined;
  className?: string;
};

export default function YesNoValue({ value, className = "" }: Props) {
  return <span className={className}>{formatYesNo(value)}</span>;
}
