import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Collapse } from "react-collapse";
import Icon from "@/components/ui/Icon";

import { useDispatch, useSelector } from "react-redux";
import useMobileMenu from "@/hooks/useMobileMenu";
import Submenu from "./sub-menu";
import MenuItem from "./menu-item";
import SingleMenu from "./single-menu";

const Navmenu = ({ menus }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  
  // Get current user role from redux
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const toggleSubmenu = (i) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  const location = useLocation();
  const locationName = location.pathname.replace("/", "");
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const dispatch = useDispatch();

  useEffect(() => {
    let submenuIndex = null;
    menus.map((item, i) => {
      if (!item.child) return;
      if (item.link === locationName) {
        submenuIndex = null;
      } else {
        const ciIndex = item.child.findIndex(
          (ci) => ci.childlink === locationName
        );
        if (ciIndex !== -1) {
          submenuIndex = i;
        }
      }
    });
    document.title = `DashSpace  | ${locationName}`;

    setActiveSubmenu(submenuIndex);
    if (mobileMenu) {
      setMobileMenu(false);
    }
  }, [location]);

  return (
    <>
      <ul>
        {menus.map((item, i) => {
          // Filter children links to avoid ordinary users seeing admin routes
          let filteredChild = item.child;
          if (item.child && !isAdmin) {
             filteredChild = item.child.filter((c) => !c.childlink.includes("admin/"));
          }
          
          // If no children left and it's not a header, don't show parent
          if (item.child && (!filteredChild || filteredChild.length === 0)) return null;

          const renderItem = { ...item, child: filteredChild };

          return (
          <li
            key={i}
            className={` single-menu-item 
              ${renderItem.child ? "item-has-children" : ""}
              ${activeSubmenu === i ? "open" : ""}
              ${locationName === renderItem.link ? "menu-item-active" : ""}`}
          >
            {/* single menu with no childred*/}
            {!renderItem.child && !renderItem.isHeadr && <SingleMenu item={renderItem} />}
            {/* only for menu-label */}
            {renderItem.isHeadr && !renderItem.child && (
              <div className="menu-label">{renderItem.title}</div>
            )}
            {/*    !!sub menu parent   */}
            {renderItem.child && (
              <MenuItem
                activeSubmenu={activeSubmenu}
                item={renderItem}
                i={i}
                toggleSubmenu={toggleSubmenu}
              />
            )}
            <Submenu activeSubmenu={activeSubmenu} item={renderItem} i={i} />
          </li>
        )})}
      </ul>
    </>
  );
};

export default Navmenu;
