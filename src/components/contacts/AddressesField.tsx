"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/Button";
import type { Address, AddressInput, AddressType } from "@/lib/contacts/types";

const ADDRESS_TYPES: AddressType[] = ["Home", "Work", "Other"];

const SELECT_CLASSES =
  "h-9 rounded-md border border-border bg-input px-2 text-sm text-foreground focus:border-primary";
const INPUT_CLASSES =
  "w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-input focus:border-primary";

/** One address row, keyed client-side so React can track it across add/remove. */
type Row = AddressInput & { _key: string };

function emptyRow(): Row {
  return {
    _key: crypto.randomUUID(),
    type: "Other",
    street: null,
    city: null,
    state: null,
    postal_code: null,
    country: null,
  };
}

function toRows(addresses: Address[] | undefined): Row[] {
  // Keyed by the address's own server-assigned id, not a random one: this
  // runs during SSR too, and a random key here would differ between the
  // server-rendered HTML and the client's first render, triggering a
  // hydration mismatch. `emptyRow`'s random key is safe because it only ever
  // runs from the client-side "Add address" click, never during SSR.
  return (addresses ?? []).map((address) => ({
    ...address,
    _key: `saved-${address.id}`,
  }));
}

function toAddressInput(row: Row): AddressInput {
  return {
    type: row.type,
    street: row.street,
    city: row.city,
    state: row.state,
    postal_code: row.postal_code,
    country: row.country,
  };
}

/**
 * A list of address rows (add/edit/remove), serialized to JSON into one
 * hidden input on every change — mirrors `PhotoField`'s hidden-value pattern
 * (see plan.md's "Design decision") so `ContactForm` collects it like every
 * other field, which is what makes FR-007 hold without any special casing.
 */
export default function AddressesField({
  defaultValue,
}: {
  defaultValue?: Address[];
}) {
  const idPrefix = useId();
  const [rows, setRows] = useState<Row[]>(() => toRows(defaultValue));

  const serialized = JSON.stringify(rows.map(toAddressInput));

  function updateRow(key: string, patch: Partial<AddressInput>) {
    setRows((current) =>
      current.map((row) => (row._key === key ? { ...row, ...patch } : row)),
    );
  }

  function addRow() {
    setRows((current) => [...current, emptyRow()]);
  }

  function removeRow(key: string) {
    setRows((current) => current.filter((row) => row._key !== key));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-foreground">
          Addresses
        </h2>
        <Button type="button" variant="secondary" size="sm" onClick={addRow}>
          Add address
        </Button>
      </div>

      <input type="hidden" name="addresses" value={serialized} />

      {rows.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">
          No addresses yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li
              key={row._key}
              className="space-y-3 rounded-md border border-border p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <select
                  aria-label="Address type"
                  value={row.type}
                  onChange={(event) =>
                    updateRow(row._key, {
                      type: event.target.value as AddressType,
                    })
                  }
                  className={SELECT_CLASSES}
                >
                  {ADDRESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRow(row._key)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-[13px] font-medium text-foreground">
                    Street address
                  </span>
                  <input
                    type="text"
                    id={`${idPrefix}-${row._key}-street`}
                    value={row.street ?? ""}
                    maxLength={300}
                    placeholder="1 Market St, Suite 400"
                    onChange={(event) =>
                      updateRow(row._key, { street: event.target.value })
                    }
                    className={INPUT_CLASSES}
                  />
                </label>

                <label>
                  <span className="mb-1.5 block text-[13px] font-medium text-foreground">
                    City
                  </span>
                  <input
                    type="text"
                    value={row.city ?? ""}
                    maxLength={120}
                    placeholder="San Francisco"
                    onChange={(event) =>
                      updateRow(row._key, { city: event.target.value })
                    }
                    className={INPUT_CLASSES}
                  />
                </label>

                <label>
                  <span className="mb-1.5 block text-[13px] font-medium text-foreground">
                    State / region
                  </span>
                  <input
                    type="text"
                    value={row.state ?? ""}
                    maxLength={120}
                    placeholder="CA"
                    onChange={(event) =>
                      updateRow(row._key, { state: event.target.value })
                    }
                    className={INPUT_CLASSES}
                  />
                </label>

                <label>
                  <span className="mb-1.5 block text-[13px] font-medium text-foreground">
                    Postal code
                  </span>
                  <input
                    type="text"
                    value={row.postal_code ?? ""}
                    maxLength={20}
                    placeholder="94105"
                    onChange={(event) =>
                      updateRow(row._key, { postal_code: event.target.value })
                    }
                    className={INPUT_CLASSES}
                  />
                </label>

                <label>
                  <span className="mb-1.5 block text-[13px] font-medium text-foreground">
                    Country
                  </span>
                  <input
                    type="text"
                    value={row.country ?? ""}
                    maxLength={120}
                    placeholder="USA"
                    onChange={(event) =>
                      updateRow(row._key, { country: event.target.value })
                    }
                    className={INPUT_CLASSES}
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
