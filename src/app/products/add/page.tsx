import { auth, currentUser } from "@clerk/nextjs";

export default function Add() {
  async function addProduct(formData: FormData) {
    "use server";
    const { userId } = auth();
    if (!userId) {
      throw new Error("You must be signed in to add a product ");
    }
    console.log("add item server action", formData);
  }
  return (
    <form className="flex flex-col gap-5 bg-black p-2  " action="addProduct">
      <input
        className="rounded-sm border border-indigo-400 bg-neutral-800 p-1 font-medium"
        type="text"
        name="title"
        placeholder="Product Name"
      />
      <input
        className="rounded-sm border border-indigo-400 bg-neutral-800 p-1 font-medium"
        type="text"
        name="description"
        placeholder="Product description"
      />
      <input
        className="rounded-sm border border-indigo-400 bg-neutral-800 p-1 font-medium"
        type="text"
        name="quantity"
        placeholder="Quantity"
      />
      <input
        className="rounded-sm border border-indigo-400 bg-neutral-800 p-1 font-medium"
        type="text"
        name="categories"
        placeholder="Choose Categories"
      />
      <input
        className="rounded-sm border border-indigo-400 bg-neutral-800 p-1 font-medium"
        type="text"
        placeholder="Product Name"
      />
      <div className=" space-x-3">
        <input
          className=" rounded-sm border border-indigo-400 bg-neutral-800 p-1 font-medium"
          type="number"
          placeholder="Price"
        />
        <span className="cursor-default select-none font-medium">$</span>
      </div>
      <button className="border-2 border-white bg-indigo-800 p-1" type="submit">
        Create new Product
      </button>
    </form>
  );
}
