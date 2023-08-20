import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../contextApi/contextApi";
import { Spinner } from "flowbite-react";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

const Categories = () => {
  const { setIsProductsUpdated } = useContext(Context);

  const [categoryName, setCategoryName] = useState("");
  const [oldCategories, setOldCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [parentCategory, setParentCategory] = useState(0);
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

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
        setIsCategoriesLoading(false);
        setOldCategories(result.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveCategory = useCallback(
    async (event) => {
      const categoryId = uuidv4();

      event.preventDefault();
      try {
        if (editedCategory != null) {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
              import.meta.env.VITE_BACKEND_ADMIN_PORT
            }/categories/edit-category/${editedCategory.category_id}`,
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
            if (properties.length > 0) {
              //TODO: fetch to update properties pros => GET => DELETE => POST again  to DB
              const response = await fetch(
                `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
                  import.meta.env.VITE_BACKEND_ADMIN_PORT
                }/categories/update-category-property/${
                  editedCategory.category_id
                }`,
                {
                  method: "PUT",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    properties: properties,
                  }),
                }
              );
              if (response.ok) {
                await response.json();
              }
            }
            setIsProductsUpdated({
              status: true,
              message: result.message,
            });
            getAllCategories();
            setCategoryName("");
            setEditedCategory(null);
            setProperties([]);
          }
        } else {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
              import.meta.env.VITE_BACKEND_ADMIN_PORT
            }/categories/new-category/${categoryId}`,
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
            response.json().then(async (result) => {
              setIsProductsUpdated({
                status: true,
                message: result.message,
              });
              setCategoryName("");
              getAllCategories();

              if (properties.length > 0) {
                setProperties([]);
                const response = await fetch(
                  `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
                    import.meta.env.VITE_BACKEND_ADMIN_PORT
                  }/properties/new-properties-name`,
                  {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      properties: properties,
                      categoryId: categoryId,
                    }),
                  }
                );
                if (response.ok) {
                  await response.json();
                }
              }
            });
          }
        }
        setProperties([]);
      } catch (error) {
        console.log(error);
      }
    },
    [
      editedCategory,
      categoryName,
      parentCategory,
      setIsProductsUpdated,
      properties,
    ]
  );

  const deleteCategory = useCallback(
    (category_id, category_name) => {
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
              }/categories/delete-category/${category_id}`,
              {
                method: "DELETE",
              }
            );
            const result = await response.json();
            if (response.ok) {
              getAllCategories();
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
    [setIsProductsUpdated]
  );

  const editCategory = async (category_id, category_name, parent_category) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
        import.meta.env.VITE_BACKEND_ADMIN_PORT
      }/properties/get-specific-properties/${category_id}`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const result = await response.json();
      setProperties(result.result);
    }
    setEditedCategory({ category_id, category_name, parent_category });
    setCategoryName(category_name);
    setParentCategory(parent_category);
  };

  const handelAddNewProperty = () => {
    setProperties((prev) => {
      return [
        ...prev,
        {
          name: "",
          values: "",
        },
      ];
    });
  };

  const handelPropertyNameChange = (index, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };

  const handelPropertyValuesChange = (index, newValues) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };

  const handelRemoveProperty = (inputsIndex) => {
    const newProperties = properties.filter(
      (value, index) => index != inputsIndex
    );
    setProperties(newProperties);
  };

  const handelCancelEditing = () => {
    setEditedCategory(null);
    setCategoryName("");
    setParentCategory(0);
    setProperties([]);
  };

  // const handelEditExistingPropertiesSubmit = async (category_id) => {
  //   const response = await fetch(
  //     `/properties/edit-exiting-properties/${category_id}`,
  //     {
  //       method: "PUT",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({}),
  //     }
  //   );
  //   if (response.ok) {
  //     const result = await response.json();
  //     console.log(result);
  //   }
  // };

  useEffect(() => {
    getAllCategories();
    setTimeout(() => setIsCategoriesLoading(false), 2000);
  }, []);

  return (
    <div className={"h-full relative"}>
      <h1 className={"hOneHeader"}>Categories</h1>
      <label>
        {editedCategory != null
          ? `Edit Category ${categoryName}`
          : "Create new category"}
      </label>
      <form method="POST" onSubmit={saveCategory}>
        <div className={"flex gap-2 flex-wrap md:flex-nowrap mt-2"}>
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
            {oldCategories.map(
              ({ category_id, category_name, parent_category }) => {
                if (parent_category == 0) {
                  return (
                    <option value={category_id} key={category_id}>
                      {category_name}
                    </option>
                  );
                }
              }
            )}
          </select>
        </div>
        <div className={"mt-3"}>
          <label>Properties</label>
          <button
            type={"button"}
            onClick={() => handelAddNewProperty()}
            className={"btn-primary block"}
            style={{
              padding: "0.5rem 0.5rem",
            }}
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties?.map((property, index) => {
              return (
                <div className="flex gap-2 mb-2" key={index}>
                  <input
                    type="text"
                    placeholder={"Property name (example color)"}
                    value={property.name || property.property_name || ""}
                    className={"rounded-lg w-full text-black"}
                    onChange={(event) =>
                      handelPropertyNameChange(
                        index,
                        event.target.value,
                        property
                      )
                    }
                  />
                  <input
                    type="text"
                    placeholder={"Property values , Comma separated"}
                    value={property.values}
                    className={"rounded-lg w-full text-black"}
                    onChange={(event) => {
                      handelPropertyValuesChange(
                        index,
                        event.target.value,
                        property
                      );
                    }}
                  />
                  <button
                    type={"button"}
                    className={
                      "dark:bg-white bg-[#1f1f1f] text-white dark:text-[#1f1f1f] rounded-lg outline-none font-semibold p-2"
                    }
                    onClick={() => handelRemoveProperty(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
        </div>
        <button
          type="submit"
          className={
            "btn-primary disabled:cursor-not-allowed disabled:bg-[#b3b3b355] disabled:text-[#1f1f1f] disabled:dark:text-white"
          }
          style={{
            margin: "8px 0px 0px",
          }}
          disabled={!categoryName}
        >
          Save
        </button>
        {editedCategory && (
          <button
            type={"button"}
            className={
              "btn-primary disabled:cursor-not-allowed disabled:bg-[#b3b3b355] disabled:text-[#1f1f1f] disabled:dark:text-white"
            }
            style={{
              margin: "8px 10px 0px",
            }}
            onClick={() => handelCancelEditing()}
          >
            Cancel editing
          </button>
        )}
      </form>
      {!editedCategory && (
        <div className={"pb-3 pr-3"}>
          {oldCategories.length > 0 ? (
            <table className={"basic mx-3 mt-3"}>
              <thead>
                <tr>
                  <td>Category Name</td>
                  <td>Parent Category</td>
                  <td>Controls</td>
                </tr>
              </thead>
              <tbody className={"basic"}>
                {oldCategories?.map(
                  ({ category_id, category_name, parent_category }) => (
                    <tr key={category_id}>
                      <td>{category_name}</td>
                      <td>
                        {oldCategories.map(({ category_id, category_name }) =>
                          category_id == parent_category ? category_name : ""
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
                              editCategory(
                                category_id,
                                category_name,
                                parent_category
                              )
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
                              deleteCategory(
                                category_id,
                                category_name,
                                parent_category
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div className={"centerClass flex-col gap-3"}>
              {isCategoriesLoading && (
                <div
                  className={"duration-150 flex flex-col items-center gap-3"}
                >
                  <Spinner aria-label="Default status example" color={"gray"} />
                  <p>Loading...</p>
                </div>
              )}
              {!isCategoriesLoading && <b>There is no category to show</b>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
