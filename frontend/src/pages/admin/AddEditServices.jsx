import React, { useState } from 'react';
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import uploadImage from '../../utils/uploadImage';
import ImageSelector from '../ImagesSelector';

const AddEditServices = ({ serviceInfo, type, onClose, getServices }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.role || user.role !== 'admin') {
    return <p className="text-red-500">You do not have permission to access this section.</p>;
  }

  const [title, setTitle] = useState(serviceInfo?.title || "");
  const [price, setPrice] = useState(serviceInfo?.price || "");
  const [category, setCategory] = useState(serviceInfo?.category || "");
  const [description, setDescription] = useState(serviceInfo?.description || "");
  const [serviceImg, setServiceImg] = useState(serviceInfo?.imageURL || "");
  const [error, setError] = useState("");

  const handleAddOrUpdate = async () => {
    if (!title || !price || !category || !description) {
      setError("Please fill all fields");
      return;
    }

    try {
      let imageURL = serviceImg;
      if (typeof serviceImg === "object") {
        const imgRes = await uploadImage(serviceImg);
        imageURL = imgRes.imageURL;
      }

      const payload = { title, price, category, description, imageURL };

      if (type === "add") {
        await axios.post("http://localhost:3000/api/admin/add-services", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Service added successfully");
        
      } else {
        await axios.put(`http://localhost:3000/api/admin/edit-services/${serviceInfo._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Service updated successfully");
        // success branch
        setTimeout(() => {
          getServices();
          onClose();          // close after a tiny delay so the toast is already visible
        }, 100);

      }

      getServices();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save service");
    }
  };

  const handleDeleteService = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/delete-services/${serviceInfo._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service deleted");
      getServices();
      onClose();
    } catch (err) {
      toast.error("Failed to delete service");
    }
  };

  const handleDeleteImage = async () => {
    try {
      await axios.delete("http://localhost:3000/delete-image", {
        headers: { Authorization: `Bearer ${token}` },
        data: { imageURL: serviceInfo?.imageURL },
      });
      await axios.put(`http://localhost:3000/edit-services/${serviceInfo._id}`, {
        title,
        price,
        category,
        description,
        imageURL: "",
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServiceImg(null);
      toast.success("Image deleted");
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="relative p-4">
      {/* ✅ Top-right controls */}
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {type === "edit" && (
          <button className="btn-small btn-delete" onClick={handleDeleteService}>
            <MdDeleteOutline className="text-lg" /> DELETE
          </button>
        )}
        <button onClick={onClose}>
          <MdClose className="text-xl text-slate-400" />
        </button>
      </div>

      <h5 className="text-2xl font-bold text-slate-900 mb-4">
        {type === "add" ? "Add Service" : "Update Service"}
      </h5>

      <div className="flex flex-col gap-3 pt-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <label className="input-label text-xl font-semibold">Title</label>
        <input
          type="text"
          className="text-l text-slate-950 outline-none border border-slate-300 p-2 rounded"
          placeholder="Enter Title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />

        <label className="input-label text-xl font-semibold">Price</label>
        <input
          type="number"
          className="text-l text-slate-950 outline-none border border-slate-300 p-2 rounded"
          placeholder="Enter Price"
          value={price}
          onChange={({ target }) => setPrice(target.value)}
        />

        <label className="input-label text-xl font-semibold">Category</label>
        <select
          className="text-sm text-slate-950 outline-none bg-slate-50 border border-slate-300 p-2 rounded"
          value={category}
          onChange={({ target }) => setCategory(target.value)}
        >
          <option value="">Select Category</option>
          <option value="formal dress">Formal Dress</option>
          <option value="cosplay">Cosplay</option>
          <option value="wedding">Wedding</option>
        </select>

        <label className="input-label text-xl font-semibold">Service Description</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 border border-slate-300 p-2 rounded"
          rows={8}
          placeholder="Enter Description"
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <div className="input-label text-xl font-semibold">Service Image</div>
        <ImageSelector
          image={serviceImg}
          setImage={setServiceImg}
          handleDeleteImg={handleDeleteImage}
        />
      </div>

      {/* ✅ Bottom center Add/Update button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleAddOrUpdate}
          className={`px-6 py-2 text-white rounded-lg shadow ${
            type === "add" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {type === "add" ? <> Add New Service</> : <> Update Service</>}
        </button>
      </div>
    </div>
  );
};

export default AddEditServices;
