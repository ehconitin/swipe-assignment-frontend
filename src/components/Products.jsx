import React, { useState } from "react";
import { useCurrencyExchangeRates, useProductsListData } from "../redux/hooks";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { BiSave, BiSolidPencil, BiTrash } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { deleteProduct, updateProduct } from "../redux/productsSlice";
import EditableField from "./EditableField";
import { addProduct } from "../redux/productsSlice";
import { newCurrencySymbol } from "../utils/newCurrencySymbol";
import { convertPrice } from "../utils/currencyCoverter";

const Products = () => {
  const { productsList } = useProductsListData();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productRate, setProductRate] = useState(1.0);
  const isListEmpty = !productsList || productsList[0] === null;
  const [addProductRow, setAddProductRow] = useState(false);
  const dispatch = useDispatch();
  const addProductRowShow = () => {
    setAddProductRow(true);
  };
  const addProductRowClose = () => {
    setAddProductRow(false);
    setProductName("");
    setProductDescription("");
    setProductRate(1.0);
  };
  const handleAddProduct = () => {
    dispatch(
      addProduct({
        name: productName,
        description: productDescription,
        rate: productRate,
      })
    );
    setProductName("");
    setProductDescription("");
    setProductRate(1.0);
  };
  return (
    <div className="sticky-top pt-md-3 pt-xl-4">
      <Row>
        <Col className="mx-auto" xs={12} md={8} lg={9}>
          <Card className="d-flex p-3 p-md-4 my-3 my-md-4">
            {isListEmpty ? (
              <div className="d-flex flex-column align-items-center">
                <h3 className="fw-bold pb-2 pb-md-4">No Products present</h3>
              </div>
            ) : (
              <div className="d-flex flex-column">
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <h3 className="fw-bold pb-2 pb-md-4">Products List</h3>
                  <div className="pe-4">
                    <Button
                      className="fw-bold"
                      variant="success"
                      onClick={addProductRowShow}
                    >
                      Add Product
                    </Button>
                  </div>
                </div>
                <Table responsive>
                  <thead>
                    <tr>
                      <th
                        className="text-center align-middle"
                        style={{ width: "10%" }}
                      >
                        Product No.
                      </th>
                      <th
                        className="text-center align-middle"
                        style={{ width: "15%" }}
                      >
                        Product ID
                      </th>
                      <th
                        className="text-center align-middle"
                        style={{ width: "20%" }}
                      >
                        Name
                      </th>
                      <th
                        className="text-center align-middle"
                        style={{ width: "35%" }}
                      >
                        Description
                      </th>
                      <th
                        className="text-center align-middle"
                        style={{ width: "10%" }}
                      >
                        Rate
                      </th>
                      <th
                        className="text-center align-middle"
                        style={{ width: "10%" }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map((product, index) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        index={index + 1}
                      />
                    ))}

                    {addProductRow ? (
                      <tr>
                        <td className="text-center align-middle">
                          {productsList.length + 1}
                        </td>
                        <td className="text-center align-middle"></td>
                        <td className="text-center align-middle">
                          <Form.Control
                            placeholder="Name"
                            value={productName}
                            type="text"
                            name="productName"
                            onChange={(e) => setProductName(e.target.value)}
                            className="text-center"
                            required
                          />
                        </td>
                        <td className="text-center align-middle">
                          <Form.Control
                            placeholder="Description"
                            value={productDescription}
                            type="text"
                            name="productDescription"
                            onChange={(e) =>
                              setProductDescription(e.target.value)
                            }
                            className="text-center"
                            required
                          />
                        </td>
                        <td
                          className=" text-center align-middle"
                          style={{ minWidth: "70px" }}
                        >
                          <div className="d-flex">
                            <InputGroup.Text className="bg-light fw-bold border-0 text-secondary px-2">
                              <span
                                className="border border-2 border-secondary rounded-circle d-flex align-items-center justify-content-center small"
                                style={{ width: "20px", height: "20px" }}
                              >
                                {newCurrencySymbol("USD")}
                              </span>
                            </InputGroup.Text>
                            <Form.Control
                              placeholder="Rate"
                              value={productRate}
                              type="number"
                              name="productRate"
                              onChange={(e) => setProductRate(e.target.value)}
                              className="text-center"
                              step={0.01}
                              precision={2}
                              min={1}
                              style={{
                                width: "80px",
                              }}
                              required
                            />
                          </div>
                        </td>
                        <td className="text-center align-middle d-flex justify-content-evenly">
                          <BiSave
                            onClick={handleAddProduct}
                            style={{
                              height: "33px",
                              width: "33px",
                              padding: "7.5px",
                            }}
                            className="text-white mt-1 btn btn-success"
                          />

                          <IoClose
                            onClick={addProductRowClose}
                            style={{
                              height: "33px",
                              width: "33px",
                              padding: "7.5px",
                            }}
                            className="text-white mt-1 btn btn-secondary"
                          />
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const ProductRow = ({ product, index }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editedRate, setEditedRate] = useState(product.rate);
  const [editedName, setEditedName] = useState(product.name);
  const { rates, current } = useCurrencyExchangeRates();
  const [editedDescription, setEditedDescription] = useState(
    product.description
  );

  const dispatch = useDispatch();

  const handleDeleteClick = () => {
    dispatch(deleteProduct(product.id));
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = () => {
    dispatch(
      updateProduct({
        id: product.id,
        name: editedName,
        description: editedDescription,
        rate: editedRate,
      })
    );

    setIsEditable(false);
  };

  const onAmountChange = (evt) => {
    setEditedRate(evt.target.value);
  };

  const onNameChange = (evt) => {
    setEditedName(evt.target.value);
  };

  const onDescChange = (evt) => {
    setEditedDescription(evt.target.value);
  };

  return (
    <tr>
      <td className="text-center align-middle">{index}</td>
      <td className="text-center align-middle fw-normal">{product.id}</td>
      <td className="text-center align-middle fw-normal">
        {isEditable ? (
          <EditableField
            onProductChange={onNameChange}
            cellData={{
              type: "text",
              name: "productName",
              placeholder: "Product Name",
              value: editedName,
              id: product.id,
              textAlign: "text-center",
            }}
          />
        ) : (
          product.name
        )}
      </td>
      <td className="text-center align-middle fw-normal">
        {isEditable ? (
          <EditableField
            onProductChange={onDescChange}
            cellData={{
              type: "text",
              name: "productDescription",
              placeholder: "Product Description",
              value: editedDescription,
              id: product.id,
              textAlign: "text-center",
            }}
          />
        ) : (
          product.description
        )}
      </td>
      <td className="text-center align-middle fw-normal">
        {isEditable ? (
          <EditableField
            onProductChange={onAmountChange}
            cellData={{
              leading: newCurrencySymbol("USD"),
              type: "number",
              name: "productRate",
              placeholder: "Product Rate",
              value: editedRate,
              id: product.id,
              textAlign: "text-center",
            }}
          />
        ) : (
          <div>
            {current === "USD" ? (
              <>
                {newCurrencySymbol(current)}
                {product.rate || 0}
              </>
            ) : (
              <>
                {newCurrencySymbol(current)}
                {convertPrice(product.rate || 0, current, rates)}
              </>
            )}
          </div>
        )}
      </td>
      <td className="text-center align-middle d-flex justify-content-evenly">
        {isEditable ? (
          <BiSave
            onClick={handleSaveClick}
            style={{ height: "33px", width: "33px", padding: "7.5px" }}
            className="text-white mt-1 btn btn-success"
          />
        ) : (
          <BiSolidPencil
            onClick={handleEditClick}
            style={{ height: "33px", width: "33px", padding: "7.5px" }}
            className="text-white mt-1 btn btn-primary"
          />
        )}
        <BiTrash
          onClick={handleDeleteClick}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger"
        />
      </td>
    </tr>
  );
};

export default Products;
