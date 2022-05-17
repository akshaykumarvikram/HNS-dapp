import {
  alpha,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Popover,
  Tooltip,
  Typography
} from '@mui/material';
import { useRef, useState } from 'react';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import { styled } from '@mui/material/styles';

import { formatDistance, subDays } from 'date-fns';

import { useUserMessages } from 'src/contexts/MessagesContextProvider';

const NotificationsBadge = styled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.error.main, 0.1)};
        color: ${theme.palette.error.main};
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`
);

function HeaderNotifications() {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const { unreadMsgCount } = useUserMessages();
  const badgeVal = unreadMsgCount.reduce((r,x) => r+x)
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip arrow title="Notifications">
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          <NotificationsBadge
            badgeContent={badgeVal}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <NotificationsActiveTwoToneIcon />
          </NotificationsBadge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box sx={{ p: 2 }} display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Notifications</Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          <ListItem sx={{ p: 2, minWidth: 350, display: { xs: 'block', sm: 'flex' } }}>
            <Box flex="1">
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ fontWeight: 'bold' }}>
                  Unread Messages
                </Typography>
                <Typography variant="caption" sx={{ textTransform: 'none' }}>
                  {formatDistance(subDays(new Date(), 3), new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {(badgeVal>0) ? `You have ${badgeVal} new unread messages. ${unreadMsgCount[0]} personal messages,  ${unreadMsgCount[1]} onchain messages and ${unreadMsgCount[2]} broadcast messages` : "No New mesages"}
              </Typography>
            </Box>
          </ListItem>
        </List>
      </Popover>
    </>
  );
}

export default HeaderNotifications;
