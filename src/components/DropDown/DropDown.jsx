import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { NavLink } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";


function DropdownMenu({ navLabel, navItems, handleNavLinkClick, islarge }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="dropdown-button"
        aria-controls={open ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<IoIosArrowDown />}
        sx={{
          fontWeight: `${!islarge ? "bold" : "normal"}`,
          color: "black",
          padding: "0",
          fontSize: `${islarge ? "14px" : "20px"}`,
          textTransform: "none",
          fontFamily: "Arial, sans-serif",
          outline: "none", // Remove outline on focus
          boxShadow: "none", // Remove shadow on focus
          "&:focus": {
            outline: "none", // Ensure outline is removed
            boxShadow: "none", // Ensure shadow is removed
          },
        }}
      >
        {navLabel}
      </Button>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "dropdown-button",
        }}
      >
        {navItems.map((item, index) => (
          <NavLink to={item.link} key={index} onClick={handleNavLinkClick}>
            <MenuItem
              onClick={handleClose}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {item.icon && (
                <item.icon style={{ fontSize: 18, marginRight: 8 }} />
              )}{" "}
              {/* Render icon */}
              {item.name}
            </MenuItem>
          </NavLink>
        ))}
      </Menu>
    </div>
  );
}

export default DropdownMenu;
