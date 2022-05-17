import ThemeProvider from "./theme/ThemeProvider";
import { CssBaseline } from "@mui/material";
import SidebarLayout from "./layouts/SidebarLayout";
import BaseLayout from "./layouts/BaseLayout";
import { useRoutes, Route, Routes, Navigate } from "react-router-dom";
import routes from "./router";
import { useUserAuth } from "./contexts/UserAuthContextProvider";
import AccountManagement from "./pages/AccountManagement";
import Inbox from "./pages/Inbox";
import InboxMessages from "./components/InboxMessages";
import UserChannels from "./components/UserChannels";
import Subscriptions from "./pages/Subscriptions";
import Channels from "./pages/Channels";
import CreateChannel from "./components/CreateChannel";
import AllSubscriptions from "./components/AllSubscriptions";
import UserSubscriptions from "./components/UserSubscriptions";
import MySubscriptions from "./components/MySubscriptions";

function App() {
  const { user } = useUserAuth();
  const content = useRoutes(routes);
  return (
    <ThemeProvider>
      <CssBaseline />
      {/* <BaseLayout /> */}
      {/* <SidebarLayout /> */}
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<AccountManagement />} />
          <Route path="login" element={<AccountManagement />} />
          {user && (
            <>
              <Route path="inbox" element={<Inbox />}>
                <Route
                  index
                  element={<Navigate to="/inbox/personalized" replace />}
                />
                <Route path="personalized" element={<InboxMessages type="personalized"/>} />
                <Route path="broadcast" element={<InboxMessages type="broadcast"/>} />
                <Route path="onchain" element={<InboxMessages type="onchain"/>} />
              </Route>
              <Route path="subscriptions" element={<Subscriptions />}>
                <Route path="mysubscriptions" element={<MySubscriptions />} />
                <Route path="availablesubscriptions" element={<AllSubscriptions />} />
              </Route>
              <Route path="channels" element={<Channels />}>
                <Route path="create" element={<CreateChannel />} />
                <Route path="manage" element={<UserChannels />} />
              </Route>
            </>
          )}
          <Route
            path="*"
            element={<Navigate to={user ? "/inbox" : "/login"} />}
          />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
