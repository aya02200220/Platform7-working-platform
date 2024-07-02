"use client";

import { useState } from "react";
import Notify from "../notification/Notification";

import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Note from "./Note";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Cards = ({ user, fetchUsers }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(user);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(" name, value, type, checked", name, value, type, checked);
    setEditData({
      ...editData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFormSubmit = async () => {
    if (!editData.name) {
      console.log("update error-------");
      Notify("Fill all required form", "error");
      return;
    }

    console.log("editData,--------", editData);
    try {
      const response = await fetch(`/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        Notify("User updated successfully", "success");
        handleModalClose();
        fetchUsers();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          Notify(`Failed to update user: ${data.message}`, "error");
        } else {
          Notify("Failed to update user", "error");
        }
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Notify("Error deleting user", "error");
    }
  };

  const handleDeleteClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user._id }),
      });

      if (response.ok) {
        Notify("User deleted successfully", "success");
        handleModalClose();
        fetchUsers();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          Notify(`Failed to delete user: ${data.message}`, "error");
        } else {
          Notify("Failed to delete user", "error");
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Notify("Error deleting user", "error");
    }
    handleDialogClose(); // ダイアログを閉じる
  };

  return (
    <>
      <div
        key={user._id}
        className="relative w-[280px] h-[150px] max-w-sm bg-white border border-gray-200 rounded-lg shadow p-3 flex flex-col justify-center "
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col justify-center items-center w-1/4">
            <h5 className="mb-2 text-xl font-medium text-[#333] text-center ">
              {user.name}
            </h5>
            {user.key ? (
              <Image
                className="w-15 h-15 rounded-full shadow-lg border "
                src="/cat-key.png"
                width={100}
                height={100}
                alt="cat-key"
              />
            ) : (
              <Image
                className="w-15 h-15 rounded-full shadow-lg border "
                src="/cat-no-key.png"
                width={100}
                height={100}
                alt="cat-key"
              />
            )}
          </div>
          <div className="flex flex-col justify-center items-center w-3/4">
            <div className="flex flex-row justify-around w-full text-center px-8">
              <div>
                <p className="text-sm text-gray-500 ">Till</p>
                <p
                  className={`text-sm p-1 rounded-sm w-[50px] text-center mb-1 ${
                    user.openTill
                      ? "text-[#fff] bg-[#89cb90]"
                      : "text-[#333] bg-[#fff] line-through"
                  }`}
                >
                  Open
                </p>
                <p
                  className={`text-sm p-1 rounded-sm w-[50px] text-center ${
                    user.closeTill
                      ? "text-[#fff] bg-[#89cb90]"
                      : "text-[#333] bg-[#fff] line-through"
                  }`}
                >
                  Close
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 ">Bar</p>
                <p
                  className={`text-sm p-1 rounded-sm w-[50px] text-center mb-1 ${
                    user.openBar
                      ? "text-[#fff] bg-[#89cb90]"
                      : "text-[#333] bg-[#fff] line-through"
                  }`}
                >
                  Open
                </p>
                <p
                  className={`text-sm p-1 rounded-sm w-[50px] text-center ${
                    user.closeBar
                      ? "text-[#fff] bg-[#89cb90]"
                      : "text-[#333] bg-[#fff] line-through"
                  }`}
                >
                  Close
                </p>
              </div>

              <Tooltip title="Edit">
                <IconButton
                  onClick={handleEditClick}
                  className="text-[17px] absolute top-2 right-3 rounded-full transition text-[#a3a4b1] p-1 hover:text-[#fff] hover:bg-[#e9afc5]"
                >
                  <BsThreeDots />
                </IconButton>
              </Tooltip>
            </div>
            {(user.note || user.timeOff.length > 0) && (
              <>
                <Note user={user} />
              </>
            )}
          </div>
        </div>
      </div>

      <Modal open={isEditModalOpen} onClose={handleModalClose}>
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg"
          sx={{ width: 400 }}
        >
          <h2>Edit User</h2>
          <div className="flex flex-col m-3">
            <TextField
              fullWidth
              required
              margin="normal"
              label="Name"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
            />
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              className="bg-[#ffffff] rounded-sm"
              value={editData.email}
              onChange={handleInputChange}
              required
            />
            <div className="flex flex-col justify-center items-center pt-2">
              <FormControlLabel
                control={<Checkbox />}
                label="Key"
                name="key"
                checked={editData.key}
                onChange={handleInputChange}
              />
              <div className="flex flex-row">
                <FormControlLabel
                  control={<Checkbox />}
                  label="Open Till"
                  name="openTill"
                  checked={editData.openTill}
                  onChange={handleInputChange}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Close Till"
                  name="closeTill"
                  checked={editData.closeTill}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-row">
                <FormControlLabel
                  control={<Checkbox />}
                  label="Open Bar"
                  name="openBar"
                  checked={editData.openBar}
                  onChange={handleInputChange}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Close Bar"
                  name="closeBar"
                  checked={editData.closeBar}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mt-3 w-full">
                <p>Note:</p>{" "}
                <textarea
                  placeholder="Note"
                  label="Note"
                  name="note"
                  className="bg-[#ffffff] rounded-sm min-h-16 max-h-32 leading-5 border p-1  w-full"
                  value={editData.note}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          {/* Add other fields as needed */}
          <div className="flex justify-end mt-4">
            <Button onClick={handleModalClose} color="secondary">
              Cancel
            </Button>
            <Button
              // onClick={handleDelete}
              onClick={handleDeleteClick}
              color="error"
              variant="contained"
              sx={{ ml: 2 }}
            >
              Delete
            </Button>
            <Button
              onClick={handleFormSubmit}
              color="primary"
              variant="contained"
              sx={{ ml: 2 }}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete User?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Cards;
