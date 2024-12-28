"use client";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <ProtectedRoute>
      <div></div>
    </ProtectedRoute>
  );
};

export default App;