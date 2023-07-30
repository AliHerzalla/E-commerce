import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../contextApi/contextApi";
import { Spinner } from "flowbite-react";
import Swal from "sweetalert2";

const Categories = () => {
  const { setIsProductsUpdated } = useContext(Context);

  const [categoryName, setCategoryName] = useState("");
  const [oldCategories, setOldCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [parentCategory, setParentCategory] = useState(0);
  const [editedCategory, setEditedCategory] = useState(null);

  const saveCategory = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        if (editedCategory != null) {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
              import.meta.env.VITE_BACKEND_ADMIN_PORT
            }/categories/edit-category/${editedCategory.id}`,
            {
              method: "PUT",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ categoryName, parentCategory }),
            }
          );

          if (response.ok) {
            const result = await response.json();
            setIsProductsUpdated({
              status: true,
              message: result.message,
            });
            setCategoryName("");
            setEditedCategory(null);
          }
        } else {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
              import.meta.env.VITE_BACKEND_ADMIN_PORT
            }/categories/new-category`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ categoryName, parentCategory }),
            }
          );
          if (response.ok) {
            const result = await response.json();
            setIsProductsUpdated({
              status: true,
              message: result.message,
            });
            setCategoryName("");
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [categoryName, setIsProductsUpdated, parentCategory, editedCategory]
  );

  const deleteCategory = useCallback(
    (id, category_name) => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "py-2 px-4 bg-red-500 text-white rounded-lg",
          cancelButton: "py-2 px-4 bg-green-500 text-white rounded-lg mr-2",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: `Do you want to delete ${category_name} category`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
                import.meta.env.VITE_BACKEND_ADMIN_PORT
              }/categories/delete-category/${id}`,
              {
                method: "DELETE",
              }
            );
            const result = await response.json();
            if (response.ok) {
              setIsProductsUpdated({
                message: result.message,
                status: true,
              });
            } else {
              swalWithBootstrapButtons.fire("Cancelled", "", "error");
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire("Cancelled", "", "error");
          }
        });
    },
    [oldCategories]
  );

  useEffect(() => {
    const getAllCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
            import.meta.env.VITE_BACKEND_ADMIN_PORT
          }/categories/get-all-categories`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const result = await response.json();
          //   setIsCategoriesLoading(false);
          setOldCategories(result.result);
        }
      } catch (error) {
        console.log(error);
      }
    };

    setTimeout(() => setIsCategoriesLoading(false), 2000);

    getAllCategories();
  }, [saveCategory, deleteCategory]);

  const editCategory = (id, category_name, parent_category) => {
    setEditedCategory({ id, category_name, parent_category });
    setCategoryName(category_name);
    setParentCategory(parent_category);
  };

  return (
    <div className={"h-full relative"}>
      <h1 className={"hOneHeader"}>Categories</h1>
      <label>
        {editedCategory != null
          ? `Edit Category ${categoryName}`
          : "Create new category"}
      </label>
      <form
        method="POST"
        onSubmit={saveCategory}
        className={"flex gap-2 flex-wrap md:flex-nowrap mt-2"}
      >
        <input
          type="text"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          className={"input m-0"}
          placeholder={"Category name"}
          style={{
            marginBottom: "0px",
          }}
        />
        <select
          className={"input w-fit"}
          style={{ margin: "0px", width: "fit-content" }}
          value={parentCategory}
          onChange={(event) => {
            setParentCategory(event.target.value);
          }}
        >
          <option value="0">No parent category</option>
          {oldCategories.map(({ id, category_name, parent_category }) => {
            if (!parent_category) {
              return (
                <option value={id} key={id}>
                  {category_name}
                </option>
              );
            }
          })}
        </select>
        <button
          type="submit"
          className={
            "btn-primary  disabled:cursor-not-allowed disabled:bg-[#b3b3b355] disabled:text-[#1f1f1f] disabled:dark:text-white"
          }
          style={{
            margin: "0px 0px 0px",
          }}
          disabled={!categoryName}
        >
          Save
        </button>
      </form>
      <div className={""}>
        {/* {oldCategories.length > 0 ? setIsCategoriesLoading(false)} */}

        {oldCategories.length > 0 ? (
          <table className={"basic mt-5"}>
            <thead>
              <tr>
                <td>Category Name</td>
                <td>Parent Category</td>
                <td>Controls</td>
              </tr>
            </thead>
            <tbody className={"basic"}>
              {oldCategories?.map(({ id, category_name, parent_category }) => (
                <tr key={id}>
                  <td>{category_name}</td>
                  <td>
                    {oldCategories.map(({ id, category_name }) =>
                      id == parent_category ? category_name : ""
                    )}
                  </td>
                  <td className={"w-0"}>
                    <div className={"gap-2 flex"}>
                      <button
                        className={"btn-primary"}
                        style={{
                          padding: "4px 12px",
                        }}
                        onClick={() =>
                          editCategory(id, category_name, parent_category)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className={"btn-primary"}
                        style={{
                          padding: "4px 12px",
                        }}
                        onClick={() =>
                          deleteCategory(id, category_name, parent_category)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={"centerClass flex-col gap-3"}>
            {isCategoriesLoading && (
              <div className={"duration-150 flex flex-col items-center gap-3"}>
                <Spinner aria-label="Default status example" color={"gray"} />
                <p>Loading...</p>
              </div>
            )}
            {!isCategoriesLoading && <b>There is no category to show</b>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
