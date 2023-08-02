"use client";
import ImageUpload from "@/components/ImageUpload";
import { ChangeEvent, useState } from "react";
import DummyProductItem from "./DummyProductItem";
import { addProduct } from "@/actions/addProductAction";

export interface ProductData {
  name: string;
  description: string;
  categories: string;
  price: string;
  quantity: string;
  imgUrls: string[];
}

export default function Add() {
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    categories: "",
    price: "",
    quantity: "",
    imgUrls: [],
  });
  // console.log(productData);

  function handleChange(
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) {
    const { name, value } = e.currentTarget;
    console.log("bruh", name, value, typeof value);
    setProductData((oldData) => ({ ...oldData, [name]: value }));
  }
  return (
    <form
      className="grid grid-cols-2 gap-5 bg-yellow-200 p-2"
      action={addProduct}
    >
      <div className="flex flex-col gap-5">
        <input
          className="rounded-lg border-0 bg-zinc-100 p-2 font-medium shadow-inner dark:bg-zinc-800"
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          maxLength={100}
          required
        />
        <textarea
          className="rounded-lg border-0 bg-zinc-100 p-2 font-medium shadow-inner dark:bg-zinc-800"
          rows={4}
          name="description"
          placeholder="Product description"
          value={productData.description}
          onChange={handleChange}
          maxLength={2000}
          required
        />
        <input
          className="rounded-lg border-0 bg-zinc-100 p-2 font-medium shadow-inner dark:bg-zinc-800"
          type="text"
          name="categories"
          placeholder="Choose Categories"
          value={productData.categories}
          onChange={handleChange}
        />
        {/* <input
          className="rounded-lg border-0 shadow-inner bg-zinc-100 dark:bg-zinc-800 p-2 font-medium"
          type="text"
          placeholder="Product Name"
        /> */}
        <div className="flex items-center space-x-3">
          <input
            className="min-w-[4rem] max-w-full rounded-lg border-0 bg-zinc-100 p-2 font-medium shadow-inner dark:bg-zinc-800"
            type="number"
            name="quantity"
            min={1}
            placeholder="Qty"
            title="Quantity"
            value={productData.quantity}
            onChange={handleChange}
            required
          />
          <input
            className="min-w-[4rem] max-w-full rounded-lg border-0 bg-zinc-100 p-2 font-medium shadow-inner dark:bg-zinc-800"
            type="number"
            min={0}
            step={0.01}
            name="price"
            placeholder="Price"
            value={productData.price}
            onChange={handleChange}
            required
          />
          <span className="cursor-default select-none text-lg font-medium">
            $
          </span>
        </div>
        <div className="">
          <ImageUpload
            setProductData={setProductData}
            imgUrls={productData.imgUrls}
          />
        </div>
      </div>
      <div>
        <DummyProductItem product={productData} />
      </div>
      <button
        className="col-span-full m-auto w-44 rounded-lg bg-indigo-400 p-2 text-white dark:bg-indigo-800"
        type="submit"
      >
        Create new Product
      </button>
    </form>
  );
}
