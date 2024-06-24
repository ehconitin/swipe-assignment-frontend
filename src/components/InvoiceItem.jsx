import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import EditableField from "./EditableField";
import { Form } from "react-bootstrap";
import { useCurrencyExchangeRates } from "../redux/hooks";
import { convertPrice, convertToUSD } from "../utils/currencyCoverter";
import { newCurrencySymbol } from "../utils/newCurrencySymbol";

const InvoiceItem = ({
  onItemizedItemEdit,
  onOptionSelect,
  onRowAdd,
  onRowDelete,
  currency,
  items,
  options,
}) => {
  const { current, rates } = useCurrencyExchangeRates();
  const itemTable = items.map((item) => (
    <ItemRow
      key={item.id}
      item={item}
      onDelete={onRowDelete}
      onItemizedItemEdit={onItemizedItemEdit}
      currency={currency}
      products={options}
      onOptionSelect={onOptionSelect}
      currentCurrency={current}
      rates={rates}
    />
  ));

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>ITEM</th>
            <th>QTY</th>
            <th>PRICE/RATE</th>
            <th className="text-center">ACTION</th>
          </tr>
        </thead>
        <tbody>{itemTable}</tbody>
      </Table>
      <Button className="fw-bold" onClick={onRowAdd}>
        Add Item
      </Button>
    </div>
  );
};

const ItemRow = ({
  products,
  onOptionSelect,
  item,
  onDelete,
  onItemizedItemEdit,
  currentCurrency,
  rates,
  ...props
}) => {
  const handleSelect = (selected) => {
    onOptionSelect(item.id, selected);
  };
  /* console.log("products", products); */

  return (
    <tr>
      <td style={{ width: "100%" }}>
        <Form.Select
          aria-label="Default select example"
          className="bg-light fw-bold border-0 text-secondary px-2"
          onChange={(e) => handleSelect(String(e.target.value))}
          value={"Current Item"}
        >
          <option>{item.id ? "Product List with Ids" : item.name}</option>
          {products.map((option) => (
            <option value={option.id} key={option.id}>
              {`${option.name}            -        ${option.id}`}
            </option>
          ))}
        </Form.Select>

        <div className="my-1">
          <EditableField
            onItemizedItemEdit={(evt) => onItemizedItemEdit(evt, item.id)}
            cellData={{
              type: "text",
              name: "name",
              placeholder: "Item name",
              value: item.name,
              id: item.id,
            }}
          />{" "}
        </div>
        <EditableField
          onItemizedItemEdit={(evt) => onItemizedItemEdit(evt, item.id)}
          cellData={{
            type: "text",
            name: "description",
            placeholder: "Item description",
            value: item.description,
            id: item.id,
          }}
        />
      </td>
      <td style={{ minWidth: "70px" }}>
        <EditableField
          onItemizedItemEdit={(evt) => onItemizedItemEdit(evt, item.id)}
          cellData={{
            type: "number",
            name: "quantity",
            min: 1,
            step: "1",
            value: item.quantity,
            id: item.id,
          }}
        />
      </td>
      <td style={{ minWidth: "130px" }}>
        <EditableField
          onItemizedItemEdit={(evt) => {
            onItemizedItemEdit(evt, item.id);
          }}
          cellData={{
            leading: newCurrencySymbol(currentCurrency),
            type: "number",
            name: "rate",
            min: 1,
            step: "0.01",
            presicion: 2,
            textAlign: "text-end",
            value: convertPrice(item.rate, currentCurrency, rates),
            id: item.id,
            disabled: currentCurrency !== "USD",
          }}
        />
      </td>
      <td className="text-center" style={{ minWidth: "50px" }}>
        <BiTrash
          onClick={() => onDelete(item.id)}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger"
        />
      </td>
    </tr>
  );
};

export default InvoiceItem;
