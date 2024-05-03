import React from 'react';
import Functions from '../helpers/functions';
import AdminSidebar from "../admin/sidebar_menus";
import UserSidebarMenus from '../user/sidebar_menus';
import PublisherSidebarMenus from '../publisher/sidebar_menus';
import LibrarianSidebarMenus from '../librarian/sidebar_menus';
import FinanceSidebarMenus from '../finance/sidebar_menus';
import StaffSidebarMenus from '../staff/sidebar_menus';
const funcObj = new Functions();
class Sidebar {

    html() {
        const browser_url = window.location.href;
        const AUTH_USER = funcObj.getAuthUser();
        return (
            <React.Fragment>
            {
                AUTH_USER.account_type == 'admin' ?
                    <AdminSidebar />
                :null
            }
            {
                AUTH_USER.account_type == 'reader' || AUTH_USER.account_type == 'junior_reader' ?
                    <UserSidebarMenus />
                :null
            }

            {
                AUTH_USER.account_type == 'attendant' ?
                  <StaffSidebarMenus /> 
                :null
            }

            {
                AUTH_USER.account_type == 'publisher' ?
                    <PublisherSidebarMenus />
                :null
            }

            {
                AUTH_USER.account_type == 'librarian' ?
                    <LibrarianSidebarMenus />
                :null
            }

            {
                AUTH_USER.account_type == 'senior_librarian' ?
                    <LibrarianSidebarMenus />
                :null
            }

            {
                AUTH_USER.account_type == 'finance' ?
                    <FinanceSidebarMenus />
                :null
            }

            {
                AUTH_USER.account_type == 'analytic_user' ?
                    <FinanceSidebarMenus />
                :null
            }

         
            </React.Fragment>
        );
    }
}
export default Sidebar;
