import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon, PublishIcon, StoreIcon } from "../icons";
import {
  Card,
  CardBody,
  Label,
  Input,
  Textarea,
  Button,
  Select,
} from "@windmill/react-ui";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const FormTitle = ({ children }) => {
  return (
      <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
        {children}
      </h2>
  );
};

const AddProduct = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("electronics");

  const handlePublish = async () => {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        image,
        title,
        price: parseFloat(price),
        description,
        stock: parseInt(stock),
        category,
        rating: {
          rate: 0,
          count: 0
        }
      });
      alert("Product added with ID: " + docRef.id);
      setImage("");
      setTitle("");
      setPrice("");
      setDescription("");
      setStock("");
      setCategory("electronics");
    } catch (e) {
      console.error("Error adding product: ", e);
      alert("Error adding product.");
    }
  };

  return (
      <div>
        <PageTitle>Add New Product</PageTitle>

        {/* Breadcum */}
        <div className="flex text-gray-800 dark:text-gray-300">
          <div className="flex items-center text-purple-600">
            <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
            <NavLink exact to="/app/dashboard" className="mx-2">
              Dashboard
            </NavLink>
          </div>
          {">"}
          <p className="mx-2">Add new Product</p>
        </div>

        <div className="w-full mt-8 grid gap-4 grid-col md:grid-cols-3 ">
          <Card className="row-span-2 md:col-span-2">
            <CardBody>
              <FormTitle>Product Image Url</FormTitle>
              <Label>
                <Input
                    className="mb-4"
                    placeholder="Add product image url here"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />
              </Label>

              <FormTitle>Product Name</FormTitle>
              <Label>
                <Input
                    className="mb-4"
                    placeholder="Type product name here"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
              </Label>

              <FormTitle>Product Price</FormTitle>
              <Label>
                <Input
                    className="mb-4"
                    placeholder="Enter product price here"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
              </Label>

              <FormTitle>Description</FormTitle>
              <Label>
                <Textarea
                    className="mb-4"
                    rows="3"
                    placeholder="Enter product description here"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
              </Label>

              <FormTitle>Stock Quantity</FormTitle>
              <Label>
                <Input
                    className="mb-4"
                    placeholder="Enter product stock quantity"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                />
              </Label>
            </CardBody>
          </Card>

          <Card className="h-48">
            <CardBody>
              <div className="flex mb-8">
                <Button
                    layout="primary"
                    className="mr-3"
                    iconLeft={PublishIcon}
                    onClick={handlePublish}
                >
                  Publish
                </Button>
                <Button layout="link" iconLeft={StoreIcon}>
                  Save as Draft
                </Button>
              </div>
              <Label className="mt-4">
                <FormTitle>Select Product Category</FormTitle>
                <Select
                    className="mt-1"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                  <option>electronics</option>
                  <option>jewelery</option>
                  <option>men's clothing</option>
                  <option>women's clothing</option>
                </Select>
              </Label>
            </CardBody>
          </Card>
        </div>
      </div>
  );
};

export default AddProduct;
