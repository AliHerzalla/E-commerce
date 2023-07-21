import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState();
  const [isProductsUpdated, setIsProductsUpdated] = useState({
    status: false,
    message: "",
  });
  return (
    <Context.Provider
      value={{
        userInformation,
        setUserInformation,
        isProductsUpdated,
        setIsProductsUpdated,
      }}
    >
      {children}
    </Context.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextProvider;
