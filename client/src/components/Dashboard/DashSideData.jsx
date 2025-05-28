import { MdBedroomParent, MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import { FaSchool, FaUserGraduate, FaGear } from "react-icons/fa6";
import { FaUserCog, FaUsers } from "react-icons/fa";


const dashsidedata = [
    {
        id: 1,
        name: 'Dashboard',
        link: '/Dashboard/Home',
        icon: MdDashboard
    },
    {
        id: 2,
        name: 'Hostel',
        link: '/Dashboard/Hostels',
        icon: FaSchool
    },
    {
        id: 4,
        name: 'Rooms',
        link: '/Dashboard/Rooms',
        icon: MdBedroomParent
    },
    {
        id: 5,
        name: 'Students',
        link: '/Dashboard/Students',
        icon: FaUserGraduate
    },
    {
        id: 6,
        name: 'Profile',
        link: '/Dashboard/Profile',
        icon: FaUserCog,
    },
    {
        id: 7,
        name: 'Users',
        link: '/Dashboard/Users',
        icon: FaUsers
    },
]

export { dashsidedata }