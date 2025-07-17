// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import ReverseGeocode from "./components/ReverseGeocode";
import FCMTokenComponent from "./components/FCMTokenComponent";

import ProductList from "./components/stripe/ProductList";
// Replace with your publishable key
const stripePromise = loadStripe(
  "pk_test_51RGpZ62KDeWV62owfMrtqMSMj1HATiK0cSAqMGvmuBIrXc8lUOpjdVM7QEN67TfUmDmu7eAjheQCeLDiZraduaAX00XjM5SYOB"
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <Elements stripe={stripePromise}>
                  <CheckoutPage />
                </Elements>
              }

           
            />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />,
            <Route path="/map_location" element={<ReverseGeocode />} />
            <Route path="/fcm" element={<FCMTokenComponent />} />
            <Route path="/payment_from" element={< ProductList/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
