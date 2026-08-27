import React from "react";
import { render, screen } from "@testing-library/react";
import ContactAvatar from "@/components/contacts/ContactAvatar";
import { makeContact } from "../mocks/handlers";

describe("ContactAvatar", () => {
  it("renders an img sourced from contact.photo when set", () => {
    const contact = makeContact({
      photo: "data:image/png;base64,iVBORw0KGgo=",
    });
    const { container } = render(<ContactAvatar contact={contact} />);

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", contact.photo!);
  });

  it("renders the unchanged initials bubble when contact.photo is null", () => {
    const contact = makeContact({ photo: null, first_name: "Ada", last_name: "Lovelace" });
    const { container } = render(<ContactAvatar contact={contact} />);

    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });
});
