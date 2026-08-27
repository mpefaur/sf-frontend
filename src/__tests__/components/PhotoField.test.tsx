import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PhotoField from "@/components/contacts/PhotoField";

function makeImageFile(name: string, type: string, content = "fake-bytes") {
  return new File([content], name, { type });
}

describe("PhotoField", () => {
  it("shows a circular preview sourced from the encoded data URI after selecting a file", async () => {
    render(<PhotoField />);
    const file = makeImageFile("avatar.png", "image/png");

    const input = screen.getByLabelText(/photo/i) as HTMLInputElement;
    await userEvent.upload(input, file);

    const preview = await screen.findByAltText(/selected photo preview/i);
    await waitFor(() =>
      expect(preview).toHaveAttribute("src", expect.stringMatching(/^data:image\/png;base64,/)),
    );
  });

  it("updates the preview when a different file is selected", async () => {
    render(<PhotoField />);
    const input = screen.getByLabelText(/photo/i) as HTMLInputElement;

    await userEvent.upload(input, makeImageFile("first.png", "image/png", "first-bytes"));
    const firstPreview = await screen.findByAltText(/selected photo preview/i);
    const firstSrc = firstPreview.getAttribute("src");

    await userEvent.upload(input, makeImageFile("second.png", "image/png", "second-bytes"));
    await waitFor(() => {
      const secondSrc = screen.getByAltText(/selected photo preview/i).getAttribute("src");
      expect(secondSrc).not.toBe(firstSrc);
    });
  });
});
