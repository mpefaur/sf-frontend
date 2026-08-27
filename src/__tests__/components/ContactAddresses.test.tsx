import React from "react";
import { render, screen } from "@testing-library/react";
import ContactAddresses from "@/components/contacts/ContactAddresses";
import { makeAddress } from "../mocks/handlers";

describe("ContactAddresses", () => {
  it("renders addresses grouped and labeled by type, including two of the same type (SC-003)", () => {
    render(
      <ContactAddresses
        addresses={[
          makeAddress({ id: 1, type: "Home", city: "London" }),
          makeAddress({ id: 2, type: "Work", city: "San Francisco" }),
          makeAddress({ id: 3, type: "Work", city: "Manchester" }),
        ]}
      />,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.queryByText("Other")).not.toBeInTheDocument();

    expect(screen.getByText(/London/)).toBeInTheDocument();
    expect(screen.getByText(/San Francisco/)).toBeInTheDocument();
    expect(screen.getByText(/Manchester/)).toBeInTheDocument();
  });

  it("renders a clear empty state for a contact with zero addresses (SC-004)", () => {
    render(<ContactAddresses addresses={[]} />);

    expect(screen.getByText(/no addresses/i)).toBeInTheDocument();
  });
});
