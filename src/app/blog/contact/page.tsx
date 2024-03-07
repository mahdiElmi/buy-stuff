import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: {
    absolute: "Contact BlogSphere",
  },
  description:
    "Get in touch with our team through our contact form. Reach out to us for inquiries, questions, or any assistance you may need. We are here to help and will respond promptly.",
};

function ContactPage() {
  return <ContactForm />;
}

export default ContactPage;
