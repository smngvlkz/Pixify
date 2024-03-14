"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import "../styles/globals.css";
interface CloudinaryResult {
  event: string;
  info: {
    secure_url: string;
  };
}

export default function Home() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [ageRange, setAgeRange] = useState("");

  useEffect(() => {
    // Load the Cloudinary script
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    script.onload = () => {
      console.log("Cloudinary script loaded");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Function to open the Cloudinary upload widget
  const openWidget = () => {
    // @ts-ignore
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        multiple: false,
      },
      (error: Error | null, result: CloudinaryResult | null) => {
        if (!error && result && result.event === "success") {
          setImageUrl(result.info.secure_url);
        }
      }
    );
  };

  // Function to handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      // FormData instance for the form data
      const formData = new FormData();
      formData.append("imageUrl", imageUrl);
      formData.append("description", description);
      formData.append("ageRange", ageRange);

      // Send a POST request to your API endpoint
      const response = await fetch("/api/user", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("POST request to /api/user failed");
      }

      // Handle the response
      const data = await response.json();
      // If the upload was successful, clear the form
      setImageUrl("");
      setDescription("");
      setAgeRange("");
      alert("Image uploaded successfully!");

      // Navigate to the view page for the uploaded image
      router.push(`/view/${data.id}`);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <button
                type="button"
                onClick={openWidget}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upload Image
              </button>
              {imageUrl && <img src={imageUrl} alt="Uploaded Image Preview" />}
            </div>
            <div>
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label htmlFor="age-range" className="sr-only">
                Age Range
              </label>
              <select
                id="age-range"
                name="age-range"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                onChange={(e) => setAgeRange(e.target.value)}
              >
                <option value="">Select Age Range</option>
                <option value="0-20">0-20</option>
                <option value="21-40">21-40</option>
                <option value="41-60">41-60</option>
                <option value="61+">61+</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
