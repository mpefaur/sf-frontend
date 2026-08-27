"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/Button";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 1_048_576;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * File picker + live circular preview + hidden base64 value, rendered outside
 * `ContactForm`'s generic field-group loop (see plan.md's "Design decision").
 */
export default function PhotoField({
  defaultValue = null,
}: {
  defaultValue?: string | null;
}) {
  const id = useId();
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Photo must be a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Photo must be 1 MB or smaller.");
      return;
    }

    setError(null);
    setValue(await readAsDataUrl(file));
  }

  function handleRemove() {
    setError(null);
    setValue("");
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium text-foreground"
      >
        Photo
        <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
          optional
        </span>
      </label>

      <input type="hidden" name="photo" value={value} />

      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- data URI, not an optimizable remote asset
          <img
            src={value}
            alt="Selected photo preview"
            className="h-14 w-14 shrink-0 rounded-full object-cover aspect-square"
          />
        ) : null}

        <div className="flex flex-col gap-1.5">
          <input
            id={id}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleFileChange}
            className="text-sm text-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-secondary file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-secondary-foreground"
          />
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="self-start"
              onClick={handleRemove}
            >
              Remove photo
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-1.5 text-[13px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
