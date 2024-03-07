"use client";

import { Switch } from "@headlessui/react";
import { useState, FormEvent } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  message: string;
  didAgreeToPrivacy: boolean;
}

function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    message: "",
    didAgreeToPrivacy: false,
  });
  const [didSubmit, setDidSubmit] = useState(false);
  const [showError, setShowError] = useState(false);

  function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.didAgreeToPrivacy) {
      setShowError(true);
      return;
    }
    setDidSubmit(true);
    localStorage.setItem("formData", JSON.stringify(formData));
  }

  return didSubmit ? (
    <section className="flex flex-grow items-center justify-center ">
      <div className=" flex max-w-lg rounded-md bg-green-100 p-8">
        <div className="ml-3 text-center">
          <h3 className="text-4xl font-bold text-green-800">Form Submitted!</h3>
          <div className="mt-2 space-y-5 text-lg font-medium text-green-700">
            <p>
              Thank you for contacting us! We have received your message and
              will get back to you shortly.
            </p>
            <button
              onClick={() => {
                setDidSubmit(false);
                setShowError(false);
              }}
              className="mx-auto block w-fit rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Subumit another form
            </button>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <section className="px-6 py-16 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Contact Us
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Fill out the form below to contact our team. We&apos;re here to answer
          any questions you may have and provide assistance. We look forward to
          hearing from you!
        </p>
      </div>
      <form onSubmit={submitForm} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-gray-900 after:text-lg after:text-red-600 after:content-['*']"
            >
              First name
            </label>
            <div className="mt-2.5">
              <input
                required
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                onChange={(e) =>
                  setFormData((oldData) => ({
                    ...oldData,
                    firstName: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold leading-6 text-gray-900 after:text-lg after:text-red-600 after:content-['*']"
            >
              Last name
            </label>
            <div className="mt-2.5">
              <input
                required
                type="text"
                name="last-name"
                id="last-name"
                autoComplete="family-name"
                onChange={(e) =>
                  setFormData((oldData) => ({
                    ...oldData,
                    lastName: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="company"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Company
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="company"
                id="company"
                onChange={(e) =>
                  setFormData((oldData) => ({
                    ...oldData,
                    company: e.target.value,
                  }))
                }
                autoComplete="organization"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-gray-900 after:text-lg after:text-red-600 after:content-['*']"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                required
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                onChange={(e) =>
                  setFormData((oldData) => ({
                    ...oldData,
                    email: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold leading-6 text-gray-900 after:text-lg after:text-red-600 after:content-['*']"
            >
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                required
                name="message"
                id="message"
                rows={4}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={""}
              />
            </div>
          </div>
          <Switch.Group
            as="div"
            className="flex items-center gap-x-4 sm:col-span-2"
          >
            <div className="flex h-6 items-center">
              <Switch
                checked={formData.didAgreeToPrivacy}
                onChange={(e) =>
                  setFormData((oldData) => ({
                    ...oldData,
                    didAgreeToPrivacy: !oldData.didAgreeToPrivacy,
                  }))
                }
                className={`
                  ${
                    formData.didAgreeToPrivacy ? "bg-indigo-600" : "bg-gray-200"
                  }
                  flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                <span className="sr-only">Agree to policies</span>
                <span
                  aria-hidden="true"
                  className={`
                    ${
                      formData.didAgreeToPrivacy
                        ? "translate-x-3.5"
                        : "translate-x-0"
                    }
                    h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>
            <Switch.Label className="text-sm leading-6 text-gray-600 after:text-lg after:text-red-600 after:content-['*']">
              By selecting this, you agree to our{" "}
              <a href="#" className="font-semibold text-indigo-600">
                privacy&nbsp;policy
              </a>
              .
            </Switch.Label>
          </Switch.Group>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Let&apos;s talk
          </button>
        </div>
        {showError && !formData.didAgreeToPrivacy && (
          <div className="mt-10 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-red-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There was an error with your submission
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul role="list" className="list-disc space-y-1 pl-5">
                    <li>You have to agree to our privacy policy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}

export default ContactForm;
