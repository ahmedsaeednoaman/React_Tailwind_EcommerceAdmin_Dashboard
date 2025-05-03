import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon } from "../icons";
import { Card, CardBody, Badge, Button } from "@windmill/react-ui";
import { genRating } from "../utils/genarateRating";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [tabView, setTabView] = useState("reviews");

  const handleTabView = (viewName) => setTabView(viewName);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, "categories"));
        let foundProduct = null;

        categorySnapshot.forEach((doc) => {
          const data = doc.data();
          const products = data.products || [];

          const match = products.find((p) => String(p.id) === String(id));
          if (match) {
            foundProduct = match;
          }
        });

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          console.log("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Loading or Product Not Found...</p>;
  }

  return (
      <div>
        <PageTitle>Product Details</PageTitle>

        {/* Breadcum */}
        <div className="flex text-gray-800 dark:text-gray-300">
          <div className="flex items-center text-purple-600">
            <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
            <NavLink exact to="/app/dashboard" className="mx-2">
              Dashboard
            </NavLink>
          </div>
          {">"}
          <NavLink exact to="/app/all-products" className="mx-2 text-purple-600">
            All Products
          </NavLink>
          {">"}
          <p className="mx-2">{product?.title || product?.name}</p>
        </div>

        {/* Product overview */}
        <Card className="my-8 shadow-md">
          <CardBody>
            <div className="grid grid-col items-center md:grid-cols-2 lg:grid-cols-2">
              <div>
                <img
                    src={product?.image || product?.photo}
                    alt=""
                    className="w-full rounded-lg"
                />
              </div>

              <div className="mx-8 pt-5 md:pt-0">
                <h1 className="text-3xl mb-4 font-semibold text-gray-700 dark:text-gray-200">
                  {product?.title || product?.name}
                </h1>

                <Badge type="success" className="mb-2">
                  In Stock
                </Badge>

                <p className="mb-2 text-sm text-gray-800 dark:text-gray-300">
                  {product?.description || product?.shortDescription}
                </p>

                <p className="text-sm text-gray-900 dark:text-gray-400">
                  Product Rating
                </p>
                <div>
                  {genRating(
                      product?.rating?.rate || product?.rating || 4,
                      product?.rating?.count || 10,
                      6
                  )}
                </div>

                <h4 className="mt-4 text-purple-600 text-2xl font-semibold">
                  ${product?.price}
                </h4>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tabs for description/reviews/FAQ */}
        <Card className="my-8 shadow-md">
          <CardBody>
            <div className="flex items-center">
              <Button
                  className="mx-5"
                  layout="link"
                  onClick={() => handleTabView("reviews")}
              >
                Reviews
              </Button>
              <Button layout="link" onClick={() => handleTabView("description")}>
                Description
              </Button>
              <Button layout="link" onClick={() => handleTabView("faq")}>
                FAQ
              </Button>
            </div>

            <hr className="mx-3 my-2 customeDivider" />

            <div className="mx-3 mt-4">
              {tabView === "reviews" ? (
                  <>
                    <p className="text-5xl text-gray-700 dark:text-gray-200">
                      {product?.rating?.rate?.toFixed(1) || product?.rating || 4.0}
                    </p>
                    {genRating(
                        product?.rating?.rate || product?.rating || 4,
                        product?.rating?.count || 10,
                        6
                    )}

                    <p className="text-sm mt-4 text-gray-600 dark:text-gray-400">
                      No reviews available in database.
                    </p>
                  </>
              ) : tabView === "description" ? (
                  <p className="text-sm text-gray-800 dark:text-gray-300">
                    {product?.description ||
                        product?.featureDescription ||
                        "No description available."}
                  </p>
              ) : (
                  <>FAQ section coming soon.</>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
  );
};

export default SingleProduct;