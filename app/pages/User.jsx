"use client";

import Cards from "../components/users/Cards";
import { useState, useEffect } from "react";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";

import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { Divider } from "@mui/material";

export const User = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [category, setCategory] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    key: false,
    openTill: false,
    closeTill: false,
    openBar: false,
    closeBar: false,
    note: "",
    timeOff: [],
  });
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUsers(data);
      handleData("All", data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setFetchingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register user");
      }

      toast.success("User Registered!", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setUsers([...users, data.newUser]); // 新しいユーザーをリストに追加

      setFormData({
        name: "",
        email: "",
        key: false,
        openTill: false,
        closeTill: false,
        openBar: false,
        closeBar: false,
        note: "",
        timeOff: [],
      });

      // ユーザーを再度フェッチして表示内容を更新
      await fetchUsers();
    } catch (err) {
      toast.error(err.message, {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setLoading(false);
  };

  const handleSearch = (text) => {
    setCategory(text);
    handleData(text, users);
  };
  useEffect(() => {
    setCategory("All");
    handleData("All");
  }, []);

  const [data, setData] = useState(users);

  // filter
  const handleData = (text, userList) => {
    if (text === "All") {
      setData(userList);
    } else if (text === "key") {
      setData(userList.filter((user) => user.key));
    } else if (text === "openTill") {
      setData(userList.filter((user) => user.openTill));
    } else if (text === "closeTill") {
      setData(userList.filter((user) => user.closeTill));
    } else if (text === "openBar") {
      setData(userList.filter((user) => user.openBar));
    } else if (text === "closeBar") {
      setData(userList.filter((user) => user.closeBar));
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     const response = await fetch("/api/user", {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ id }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Failed to delete user");
  //     }

  //     toast.success("User Deleted!", {
  //       position: "bottom-right",
  //       autoClose: 1500,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });

  //     // ユーザーを再度フェッチして表示内容を更新
  //     await fetchUsers();
  //   } catch (err) {
  //     toast.error(err.message, {
  //       position: "bottom-right",
  //       autoClose: 1500,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  // };

  return (
    <div className="flex flex-col w-full mx-5 md:w-[680px] max-w-[680px] items-end">
      <Accordion className="w-[320px] bg-[#f7f7f7] ">
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography className=" font-mono text-[14px]">
            Add New Staff
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <FormGroup className="flex flex-col gap-2">
            <TextField
              label="Display Name"
              name="name"
              className="bg-[#ffffff] rounded-sm"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              className="bg-[#ffffff] rounded-sm"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <FormControlLabel
              control={<Checkbox />}
              label="Key"
              name="key"
              checked={formData.key}
              onChange={handleChange}
            />
            <div className="flex w-full flex-wrap items-center">
              <FormControlLabel
                control={<Checkbox />}
                label="Open Till"
                name="openTill"
                checked={formData.openTill}
                onChange={handleChange}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Close Till"
                name="closeTill"
                checked={formData.closeTill}
                onChange={handleChange}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Open Bar"
                name="openBar"
                checked={formData.openBar}
                onChange={handleChange}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Close Bar"
                name="closeBar"
                checked={formData.closeBar}
                onChange={handleChange}
              />
            </div>
            <div></div>
            <textarea
              placeholder="Note"
              label="Note"
              name="note"
              className="bg-[#ffffff] rounded-sm min-h-16 max-h-32 leading-5"
              value={formData.note}
              onChange={handleChange}
            />

            <LoadingButton
              className="bg-[#ce7a8b] hover:bg-[#d35d77] "
              onClick={handleSubmit}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              <span>Register</span>
            </LoadingButton>
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <div className="mt-5 w-full mb-10">
        <Divider />
        <h2 className="text-[20px] text-[#3d3d3d] mb-2 text-center font-mono font-semibold">
          Registered Users
        </h2>

        {fetchingUsers ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="inline-flex rounded-md shadow-sm mb-4" role="group">
              <button
                className={`userBtn rounded-s-lg border border-gray-900 ${
                  category === "All"
                    ? "text-[#fff] bg-[#d54b87]"
                    : "bg-[#f6e4eb]"
                } `}
                onClick={() => handleSearch("All")}
              >
                All
              </button>
              <button
                className={`userBtn ${
                  category === "key"
                    ? "text-[#fff] bg-[#d54b87]"
                    : "bg-[#f6e4eb]"
                } `}
                onClick={() => handleSearch("key")}
              >
                Key
              </button>
              <button
                className={`userBtn ${
                  category === "openTill"
                    ? "text-[#fff] bg-[#d54b87]"
                    : "bg-[#f6e4eb]"
                } `}
                onClick={() => handleSearch("openTill")}
              >
                Open Till
              </button>
              <button
                className={`userBtn ${
                  category === "closeTill"
                    ? "text-[#fff] bg-[#d54b87]"
                    : "bg-[#f6e4eb]"
                } `}
                onClick={() => handleSearch("closeTill")}
              >
                Close Till
              </button>
              <button
                className={`userBtn ${
                  category === "openBar"
                    ? "text-[#fff] bg-[#d54b87]"
                    : "bg-[#f6e4eb]"
                } `}
                onClick={() => handleSearch("openBar")}
              >
                Open Bar
              </button>
              <button
                type="button"
                className={`userBtn rounded-e-lg ${
                  category === "closeBar"
                    ? "text-[#fff] bg-[#d54b87]"
                    : "bg-[#f6e4eb]"
                } `}
                onClick={() => handleSearch("closeBar")}
              >
                Close Bar
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {data?.map((user) => (
                <Cards key={user.id} user={user} fetchUsers={fetchUsers} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
