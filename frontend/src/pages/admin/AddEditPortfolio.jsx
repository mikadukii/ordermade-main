import React, { useState } from 'react';
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import axios from 'axios';
import uploadImage from '../../utils/uploadImage';
import ImageSelector from '../ImagesSelector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEditPortfolio = ({ portfolioInfo, type, onClose, getPortfolio }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.role || user.role !== 'admin') {
    return <p className="text-red-500">You do not have permission to access this section.</p>;
  }

  const [title, setTitle] = useState(portfolioInfo?.title || "");
  const [portfolioImg, setPortfolioImg] = useState(portfolioInfo?.imageURL || "");
  const [description, setDescription] = useState(portfolioInfo?.description || "");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const addNewPortfolio = async () => {
    try {
      let imageURL = "";

      if (portfolioImg && typeof portfolioImg === "object") {
        const imgUploadRes = await uploadImage(portfolioImg);
        imageURL = imgUploadRes.imageURL || "";
      }

      const response = await axios.post("http://localhost:3000/add-portfolio", {
        title,
        imageURL,
        description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Portfolio added successfully");
      setTimeout(() => {
      getPortfolio();
      onClose();
    }, 100);  // small delay allows toast to trigger
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to add portfolio";
      toast.error(msg);
    }
  };

  const updatePortfolio = async () => {
    try {
      let imageURL = portfolioImg;
      const postData = { title, description, imageURL };

      if (typeof portfolioImg === "object") {
        const imgUploadRes = await uploadImage(portfolioImg);
        imageURL = imgUploadRes.imageURL || "";
        postData.imageURL = imageURL;
      }

      const response = await axios.put(
        `http://localhost:3000/edit-portfolio/${portfolioInfo._id}`,
        postData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Portfolio updated successfully");
      getPortfolio();
      onClose();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to update portfolio";
      toast.error(msg);
    }
  };

  const deletePortfolio = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/delete-portfolio/${portfolioInfo._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Portfolio deleted successfully");
      getPortfolio();
      onClose();
    } catch (error) {
      console.error("Failed to delete portfolio", error);
      toast.error("Failed to delete portfolio");
    }
  };

  const handleAddOrUpdateClick = () => {
    if (!title) return setError("Please enter a title");
    if (!description) return setError("Please enter a description");
    setError("");
    type === "edit" ? updatePortfolio() : addNewPortfolio();
  };

  const handleDeletePortfolioImg = async () => {
    try {
      const deleteImgRes = await axios.delete("http://localhost:3000/delete-image", {
        data: { imageURL: portfolioInfo.imageURL },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (deleteImgRes.data) {
        const postData = { title, description, imageURL: "" };
        await axios.put(`http://localhost:3000/edit-portfolio/${portfolioInfo._id}`, postData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPortfolioImg(null);
        toast.success("Image removed successfully");
      }
    } catch (error) {
      console.error("Failed to delete image", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="relative p-4">
      {/* Top-right controls */}
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {type === "edit" && (
          <button onClick={deletePortfolio} className="btn-small btn-delete">
            <MdDeleteOutline className="text-lg" /> DELETE
          </button>
        )}
        <button onClick={onClose}>
          <MdClose className="text-xl text-slate-400" />
        </button>
      </div>

      <h5 className="text-2xl font-bold text-slate-700 mb-4">
        {type === "add" ? "Add Portfolio" : "Update Portfolio"}
      </h5>

      <div className="flex-1 flex flex-col gap-4 pt-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="input-label text-xl font-semibold">Portfolio Title</label>
          <input
            type="text"
            className="text-l text-slate-950 outline-none w-full border border-slate-300 rounded p-2"
            placeholder="Portfolio Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
      <div>
        <label className="input-label text-xl font-semibold">Portfolio Image</label>
      </div>
        <ImageSelector
          image={portfolioImg}
          setImage={setPortfolioImg}
          handleDeleteImg={handleDeletePortfolioImg}
        />

        <div>
          <label className="input-label text-xl font-semibold">Portfolio Description</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-50 border border-slate-300 p-2 rounded w-full"
            placeholder="Enter Description"
            rows={10}
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </div>
      </div>

      {/* Bottom center Add/Update */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleAddOrUpdateClick}
          className={`px-6 py-2 rounded-lg shadow text-white ${
            type === "add" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {type === "add" ? <> Add Portfolio</> : <>Update Portfolio</>}
        </button>
      </div>
    </div>
  );
};

export default AddEditPortfolio;
