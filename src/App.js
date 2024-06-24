import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import Invoice from "./pages/Invoice";
import InvoiceList from "./pages/InvoiceList";
import { useDispatch } from "react-redux";
import { updateExchangeRates } from "./redux/currencyExchangeSlice";
import { convertCurrency } from "./utils/currencyCoverter";

const App = () => {
  const dispatch = useDispatch();
  //Fetching currency exchange rates at the time of application reload and storing them into redux state
  //Because freecurrencyAPI is rate limited for 10requests/min with only 5k requests
  //This way the exchange rates will be set at the time of application load and will save some requests
  //Its kind of like memoization of the currency rates which then reduce api calls. haha!
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const data = await convertCurrency(); // Wait for the promise to resolve

        dispatch(updateExchangeRates(data.data));
        console.log("exchange rates", data.data);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, [dispatch]);
  return (
    <div className="App">
      <Container>
        <Routes>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/create" element={<Invoice />} />
          <Route path="/create/:id" element={<Invoice />} />
          <Route path="/edit/:id" element={<Invoice />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
