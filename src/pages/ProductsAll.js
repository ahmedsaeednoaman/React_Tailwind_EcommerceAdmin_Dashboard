import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Link, NavLink } from "react-router-dom";
import {
  EditIcon,
  EyeIcon,
  GridViewIcon,
  HomeIcon,
  ListViewIcon,
  TrashIcon,
} from "../icons";
import {
  Card,
  CardBody,
  Label,
  Select,
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import response from "../utils/demo/productData";
import Icon from "../components/Icon";
import { genRating } from "../utils/genarateRating";
import { collection, getDocs, getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";




const ProductsAll = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState(products);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const [view, setView] = useState("grid");

  // Table and grid data handlling
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  // pagination setup
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const totalResults = products.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  useEffect(() => {
    const getAllProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const allProducts = querySnapshot.docs.flatMap(doc => {
          const data = doc.data();
          return data.products ? data.products : [];
        });

        const sortedProducts = allProducts.sort((a, b) => b.id - a.id);

        setProducts(sortedProducts);
        setFilter(sortedProducts);
      } catch (error) {
        console.error("Error fetching all category products:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllProducts();
  }, [refetch]);

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(products.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page, resultsPerPage, totalResults]);

  // Delete action model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);
  function openModal(productId) {
    let product = data.filter((product) => product.id === productId)[0];
    setSelectedDeleteProduct(product);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function deleteProduct() {
    const productId = selectedDeleteProduct.id;
    const categoryName = selectedDeleteProduct.category;

    const categoryRef = doc(db, "categories", categoryName);

    const categorySnap = await getDoc(categoryRef);
    if (!categorySnap.exists()) {
      console.log("Category does not exist!");
      return;
    }

    const data = categorySnap.data();
    const currentProducts = data.products || [];

    const updatedProducts = currentProducts.filter(product => product.id !== productId);

    await updateDoc(categoryRef, { products: updatedProducts });

    setRefetch(prev => !prev);
    setIsModalOpen(false);
  }

  // Handle list view
  const handleChangeView = () => {
    if (view === "list") {
      setView("grid");
    }
    if (view === "grid") {
      setView("list");
    }
  };

  return (
    <div>
      <PageTitle>All Products</PageTitle>

      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">All Products</p>
      </div>

      {/* Sort */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All Products
              </p>

              <Label className="mx-3">
                <Select className="py-3">
                  <option>Sort by</option>
                  <option>Asc</option>
                  <option>Desc</option>
                </Select>
              </Label>

              <Label className="mx-3">
                <Select className="py-3">
                  <option>Filter by Category</option>
                  <option>Electronics</option>
                  <option>Cloths</option>
                  <option>Mobile Accerssories</option>
                </Select>
              </Label>

              <Label className="mr-8">
                {/* <!-- focus-within sets the color for the icon when input is focused --> */}
                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                  <input
                    className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    placeholder="Number of Results"
                    value={resultsPerPage}
                    onChange={(e) => setResultsPerPage(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                    {/* <SearchIcon className="w-5 h-5" aria-hidden="true" /> */}
                    Results on {`${view}`}
                  </div>
                </div>
              </Label>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Delete product model */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="flex items-center">
          {/* <div className="flex items-center"> */}
          <Icon icon={TrashIcon} className="w-6 h-6 mr-3" />
          Delete Product
          {/* </div> */}
        </ModalHeader>
        <ModalBody>
          Are you sure that you want to delete product: {" "}
          {selectedDeleteProduct && `"${selectedDeleteProduct.title}"`} ?
        </ModalBody>
        <ModalFooter>
          {/* I don't like this approach. Consider passing a prop to ModalFooter
           * that if present, would duplicate the buttons in a way similar to this.
           * Or, maybe find some way to pass something like size="large md:regular"
           * to Button
           */}
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={deleteProduct} >Delete</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={deleteProduct}>
              Delete
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Product Views */}
      {view === "list" ? (
        <>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Name</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>QTY</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Action</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {data.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="hidden mr-4 md:block"
                          src={product.photo}
                          alt="Product image"
                        />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge type={product.qty > 0 ? "success" : "danger"}>
                        {product.qty > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {genRating(product.rating, product.reviews.length, 5)}
                    </TableCell>
                    <TableCell className="text-sm">{product.qty}</TableCell>
                    <TableCell className="text-sm">{product.price}</TableCell>
                    <TableCell>
                      <div className="flex">
                        <Link to={`/app/product/${product.id}`}>
                          <Button
                            icon={EyeIcon}
                            className="mr-3"
                            aria-label="Preview"
                          />
                        </Link>
                        <Button
                          icon={TrashIcon}
                          layout="outline"
                          onClick={() => openModal(product.id)}
                          aria-label="Delete"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                label="Table navigation"
                onChange={onPageChange}
              />
            </TableFooter>
          </TableContainer>
        </>
      ) : (
        <>
          {/* Product list */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {data.map((product) => (
              <div className="" key={product.id}>
                <Card>
                  <img
                    className="object-cover w-full"
                    src={product.image}
                    alt="product"
                    style={{ height: "250px", maxWidth: "250px" }}
                  />
                  <CardBody>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-semibold truncate  text-gray-600 dark:text-gray-300">
                        {product.title}
                      </p>
                    </div>

                    <p className="mb-2 text-purple-500 font-bold text-lg">
                      {product.price}
                    </p>

                    <p className="mb-8 text-gray-600 dark:text-gray-400">
                      {product.shortDescription}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <Link to={`/app/product/${product.id}`}>
                          <Button
                            icon={EyeIcon}
                            className="mr-3"
                            aria-label="Preview"
                            size="small"
                          />
                        </Link>
                      </div>
                      <div>
                        <Button
                          icon={TrashIcon}
                          layout="outline"
                          aria-label="Delete"
                          onClick={() => openModal(product.id)}
                          size="small"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>

          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};

export default ProductsAll;
