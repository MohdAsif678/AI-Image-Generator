import React, { useRef, useState } from "react";
import "./imageGenerator.css";
import Image from "../assets/AI_Image.jpg";

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState("/");
  const [loading, setLoading] = useState(false);
  let inputRef = useRef(null);
  const imageGenerator = async () => {
    if (inputRef.current.value === "") {
      return;
    }

    setLoading(true);
    setImageUrl("/"); // Optionally reset image while loading

    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            model: "dall-e-3",
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${process.env.key}`,
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            prompt: inputRef.current.value,
            n: 1,
            size: "512x512",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data?.data?.[0]?.url) {
        throw new Error("No image URL returned from API.");
      }

      setImageUrl(data.data[0].url);
    } catch (error) {
      console.error("Image generation failed:", error);
      alert(
        `Oops! Something went wrong because the openAI API used in this project it's free for only some time that't why this error will be accured : ${error.message}`
      );
      setImageUrl("/"); // Optional: fallback image
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai_image_generator">
      <div className="header">
        AI Image <span className="span_text">Generator</span>
      </div>
      <div className="img_loading">
        <div className="image">
          <img src={imageUrl === "/" ? Image : imageUrl} alt="Image" />
        </div>
        <div className="loading">
          <div className={loading ? "loading_bar_full" : "loading_bar"}>
            <div className={loading ? "loading_text" : "display_none"}>
              Loading....
            </div>
          </div>
        </div>
      </div>
      <div className="search_box">
        <input
          type="text"
          ref={inputRef}
          className="search_input"
          placeholder="Describe what you want to see"
        />
        <div
          className="generate_btn"
          onClick={() => {
            imageGenerator();
          }}
        >
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
