import type { Address, AddressType } from "@/lib/contacts/types";

const ADDRESS_TYPES: AddressType[] = ["Home", "Work", "Other"];

/** Single-line rendering of one address, skipping the parts that are not filled in. */
function addressLine(address: Address): string {
  const parts = [
    address.street,
    address.city,
    [address.state, address.postal_code].filter(Boolean).join(" "),
    address.country,
  ].filter((part): part is string => Boolean(part && part.trim()));

  return parts.length ? parts.join(", ") : "—";
}

/**
 * A contact's addresses, grouped and labeled by type (FR-005). Renders an
 * explicit empty state instead of blank space when there are none (FR-006,
 * SC-004) — a contact with no addresses should never look broken.
 */
export default function ContactAddresses({
  addresses,
}: {
  addresses: Address[];
}) {
  if (addresses.length === 0) {
    return (
      <p className="px-4 py-3 text-[13px] text-muted-foreground">
        No addresses on file.
      </p>
    );
  }

  return (
    <div className="divide-y divide-hairline">
      {ADDRESS_TYPES.map((type) => {
        const group = addresses.filter((address) => address.type === type);
        if (group.length === 0) return null;

        return (
          <div key={type} className="px-4 py-3">
            <h3 className="text-[13px] font-medium text-muted-foreground">
              {type}
            </h3>
            <ul className="mt-1 space-y-1">
              {group.map((address) => (
                <li key={address.id} className="text-sm text-foreground">
                  {addressLine(address)}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
