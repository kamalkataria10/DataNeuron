import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import RegistrationForm from "./components/RegistrationForm";
import UserTable from "./components/UserTable";
import { fetchUsers, fetchApiCounts } from "./userSlice";

function App() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.list);
  const apiCounts = useSelector((state) => state.users.apiCounts);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchApiCounts());
  }, [dispatch]);

  return (
    <>
      <div className="maindiv">
        <div className="onediv" style={{ marginRight: "2%" }}>
          <RegistrationForm />
        </div>
        <div className="onediv">
          <UserTable users={users} />
        </div>
      </div>
      <div className="onediv" style={{ marginTop: "2%" }}>
        <p>Api Counts for Add : {apiCounts.addApiCount}</p>
        <p>Api Counts for Update : {apiCounts.updateApiCount}</p>
      </div>
    </>
  );
}

export default App;
