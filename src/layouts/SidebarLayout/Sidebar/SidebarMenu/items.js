import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import SubscriptionsTwoToneIcon from '@mui/icons-material/SubscriptionsTwoTone';
import PodcastsTwoToneIcon from '@mui/icons-material/PodcastsTwoTone';
import CellTowerIcon from '@mui/icons-material/CellTower';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import AddBoxTwoToneIcon from '@mui/icons-material/AddBoxTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import { useUserMessages } from "src/contexts/MessagesContextProvider";

export const loggedInMenuItems = [
  {
    heading: "My Inbox",
    items: [
      {
        name: "Personalized Inbox",
        link: "/inbox/personalized",
        icon: AccountBoxTwoToneIcon
      },
      {
        name: "Broadcast Inbox",
        link: "/inbox/broadcast",
        icon: CellTowerIcon
      },
      {
        name: "Onchain Inbox",
        link: "/inbox/onchain",
        icon: AccountTreeTwoToneIcon
      }
    ]
  },
  {
    heading: "My Subscriptions",
    items: [
      {
        name: "My Subscriptions",
        link: "/subscriptions/mysubscriptions",
        icon: SubscriptionsTwoToneIcon
      },
      {
        name: "Available Subscriptions",
        link: "/subscriptions/availablesubscriptions",
        icon: SubscriptionsTwoToneIcon
      }
    ]
  },
  {
    heading: "My Channels",
    items: [
      {
        name: "Create New Channel",
        link: "/channels/create",
        icon: AddBoxTwoToneIcon
      },
      {
        name: "Manage Channels",
        link: "/channels/manage",
        icon: PodcastsTwoToneIcon
      }
    ]
  },
  {
    heading: "My Accounts",
    items: [
      {
        name: "Manage Account",
        link: "/login",
        icon: ManageAccountsTwoToneIcon
      }
    ]
  },
];

 const loginMenuItems = [
  {
    heading: "My Accounts",
    items: [
      {
        name: "Manage Account",
        link: "/login",
        icon: ManageAccountsTwoToneIcon
      }
    ]
  }
];

export default loginMenuItems
