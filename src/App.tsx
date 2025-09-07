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
import NashaInfo from "./components/NashaInfo/NashaInfo";
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
            <Route path="/payment_from" element={<ProductList />} />,
            <Route path="/nasha" element={<NashaInfo />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

// https://walkie-drivetime.postman.co/workspace/Main-Workspace~d91bf17a-a176-4a8e-80d1-6e57a007adb4/folder/41730236-f2029e00-167a-48fb-b944-eae9bb9aac2c

export default App;
