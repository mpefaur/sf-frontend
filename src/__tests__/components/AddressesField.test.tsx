import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressesField from "@/components/contacts/AddressesField";
import { makeAddress } from "../mocks/handlers";

function hiddenValue(container: HTMLElement): unknown {
  const input = container.querySelector(
    'input[name="addresses"]',
  ) as HTMLInputElement;
  return JSON.parse(input.value);
}

describe("AddressesField", () => {
  it("clicking Add address appends a new row with a type selector and text inputs", async () => {
    const { container } = render(<AddressesField />);

    expect(screen.queryByLabelText(/address type/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /add address/i }));

    expect(screen.getByLabelText(/address type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(hiddenValue(container)).toEqual([
      {
        type: "Other",
        street: null,
        city: null,
        state: null,
        postal_code: null,
        country: null,
      },
    ]);
  });

  it("editing one row's city updates only that row", async () => {
    const home = makeAddress({ id: 1, type: "Home", city: "London" });
    const work = makeAddress({ id: 2, type: "Work", city: "San Francisco" });
    const { container } = render(<AddressesField defaultValue={[home, work]} />);

    const cityInputs = screen.getAllByDisplayValue(/London|San Francisco/);
    const londonInput = cityInputs.find(
      (el) => (el as HTMLInputElement).value === "London",
    )!;
    await userEvent.clear(londonInput);
    await userEvent.type(londonInput, "Manchester");

    const values = hiddenValue(container) as Array<{ city: string }>;
    expect(values.map((v) => v.city).sort()).toEqual(["Manchester", "San Francisco"]);
  });

  it("clicking a row's remove button removes only that row", async () => {
    const home = makeAddress({ id: 1, type: "Home", city: "London" });
    const work = makeAddress({ id: 2, type: "Work", city: "San Francisco" });
    const { container } = render(<AddressesField defaultValue={[home, work]} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await userEvent.click(removeButtons[0]);

    const values = hiddenValue(container) as Array<{ city: string }>;
    expect(values).toHaveLength(1);
    expect(values[0].city).toBe("San Francisco");
  });
});
