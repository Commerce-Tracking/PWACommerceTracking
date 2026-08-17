import {
  DONT_KNOW,
  formatProductCountry,
  NOT_SPECIFIED,
} from "../../utils/collectionLabels";

type CountryLike = {
  name?: string | null;
  flag?: string | null;
} | null;

type Props = {
  /** Mode produit : null id → « Je ne sais pas » */
  mode?: "product" | "standard";
  country?: CountryLike;
  countryId?: number | null;
  className?: string;
};

export default function CountryValue({
  mode = "standard",
  country,
  countryId,
  className = "",
}: Props) {
  if (mode === "product") {
    const label = formatProductCountry(country?.name, countryId);
    const prefix = country?.flag ? `${country.flag} ` : "";
    return (
      <span className={className}>
        {label === DONT_KNOW ? DONT_KNOW : `${prefix}${label}`}
      </span>
    );
  }

  if (country?.name) {
    return (
      <span className={className}>
        {country.flag ? `${country.flag} ` : ""}
        {country.name}
      </span>
    );
  }

  if (countryId != null) {
    return <span className={className}>Pays #{countryId}</span>;
  }

  return <span className={className}>{NOT_SPECIFIED}</span>;
}
