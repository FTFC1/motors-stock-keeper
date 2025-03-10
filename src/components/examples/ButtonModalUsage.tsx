import React from "react";
import { ButtonModal } from "@/components/ui/button-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ButtonModalUsage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <ButtonModal
      trigger={
        <Button variant="default" data-oid="pnfunzf">
          Open Form
        </Button>
      }
      title="User Information"
      description="Please fill out your information below."
      footerContent={
        <>
          <Button variant="outline" onClick={() => {}} data-oid="83mm56m">
            Cancel
          </Button>
          <Button variant="default" onClick={handleSubmit} data-oid="3c4kv:w">
            Submit
          </Button>
        </>
      }
      data-oid="tm7fv.."
    >
      <div className="space-y-4" data-oid="tubj0p7">
        <div className="space-y-2" data-oid="fuxh52v">
          <Label htmlFor="name" data-oid="k97mpfw">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            data-oid="h_krq.i"
          />
        </div>
        <div className="space-y-2" data-oid="_hl.0n4">
          <Label htmlFor="email" data-oid="h_g37me">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            data-oid="9o5:nn2"
          />
        </div>
      </div>
    </ButtonModal>
  );
}
