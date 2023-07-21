import { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

const ProductImagesSection = ({
  images,
  addNewProductImage,
  removeImageButton,
}) => {


  return (
    <div className={"my-3"}>
      <Toaster />
      <div>
        <label>Product Images</label>
        <br />
        <small>Note: The image takes 2 seconds to load</small>
        <br />
        <small>Note: You can add {20 - images?.length} images</small>
      </div>
      <div
        className={`grid lg:grid-cols-8 md:grid-cols-6 sm:grid-cols-3 grid-cols-2 w-full h-fit gap-y-4 mt-2 lg:gap-x-4 ${
          images?.length > 0 ? `justify-items-center` : `justify-items-start`
        }`}
      >
        {images?.map((image, index) => (
          <div className={"productImages relative"} key={uuidv4()}>
            <div className={"w-full h-full"}>
              <div
                className={
                  "absolute w-4 h-4 rounded-full bg-white top-1 right-1 cursor-pointer"
                }
                onClick={(event) => removeImageButton(event, index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-full h-full text-black flex items-center justify-center"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <img
                src={image}
                className={"selfProductImage"}
                alt={"product image"}
              />
            </div>
          </div>
        ))}
        {images?.length < 20 ? (
          <div
            className={"productImages cursor-pointer"}
            onClick={addNewProductImage}
          >
            <div className={"selfProductImage"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 md:w-6 md:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              Add Images
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ProductImagesSection;

ProductImagesSection.propTypes = {
  images: PropTypes.array,
  addNewProductImage: PropTypes.func.isRequired,
  removeImageButton: PropTypes.func.isRequired,
};
