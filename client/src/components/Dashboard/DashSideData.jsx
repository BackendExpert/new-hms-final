import { MdBedroomParent, MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import { FaSchool, FaUserGraduate, FaGear } from "react-icons/fa6";
import { FaUserCog, FaUsers, FaUserLock } from "react-icons/fa";
import { MdContactEmergency } from "react-icons/md";
import { FaHouseUser } from "react-icons/fa";


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
        name: 'Rooms',
        link: '/Dashboard/WardenRooms',
        icon: MdBedroomParent
    },
    {
        id: 6,
        name: 'Students',
        link: '/Dashboard/Students',
        icon: FaUserGraduate
    },
    {
        id: 7,
        name: 'Students',
        link: '/Dashboard/WardenStudents',
        icon: FaUserGraduate
    },
    {
        id: 8,
        name: 'Profile',
        link: '/Dashboard/Profile',
        icon: FaUserCog,
    },
    {
        id: 9,
        name: 'Permission',
        link: '/Dashboard/Permissions',
        icon: FaUserLock
    },
    {
        id: 10,
        name: 'Users',
        link: '/Dashboard/Users',
        icon: FaUsers
    },
    {
        id: 11,
        name: 'EmergencyContact',
        link: '/Dashboard/EmergencyContact',
        icon: MdContactEmergency
    },
    {
        id: 12,
        name: 'Extra Needs',
        link: '/Dashboard/ExtraNeeds',
        icon: FaHouseUser
    },
    {
        id: 13,
        name: 'Student Extra Needs',
        link: '/Dashboard/StdExtraNeeds',
        icon: FaHouseUser
    },
]

export { dashsidedata }