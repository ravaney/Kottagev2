import { Stack } from "@fluentui/react";
import CommandMenu from "./CommandMenu";
import Menu from "./Menu";
import { useMediaQuery, useTheme } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks";
import { AnimatedBadge } from '../common/AnimatedBadge';

const NavBar = () => {
  const { firebaseUser,loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const gap = { childrenGap: 10 };
  return (
    <Stack
      horizontal
      verticalAlign="center"
      horizontalAlign="space-between"
      style={{
        top: 0,
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        zIndex: 1000,
        height: "60px",
        padding: "0 20px",
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        boxSizing: "border-box",
        alignItems: 'center',
        borderBottom: "2px solid rgba(102, 126, 234, 0.1)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        position: "sticky"
      }}
    >
      <div style={{ 
        flex: "0 0 auto",
        maxWidth: isMobile ? "100px" : isTablet ? "140px" : "180px", 
        flexShrink: 0,
        height: "100%",
        display: "flex",
        alignItems: "center"
      }}>
        <Link to="/">
          <img 
            src="/blue logo.png" 
            alt="Kottage Logo" 
            style={{ maxWidth: '100%', maxHeight: '40px', height: 'auto' }}
          />
        </Link>
      </div>
      <CommandMenu />
      <div style={{ 
        flex: "0 0 auto",
        maxWidth: isMobile ? "120px" : isTablet ? "180px" : "200px", 
        padding: isMobile ? "4px 12px" : "6px 16px",
        flexShrink: 0,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center"

      }}>
        {loading ? null : (firebaseUser) ? (
          <Stack
            horizontal
            tokens={gap}
            horizontalAlign="end"
            verticalAlign="center"
          >
            <AnimatedBadge badgeContent={1} color="primary" animate>
              <MailIcon color="action" />
            </AnimatedBadge>
            <AnimatedBadge badgeContent={6} color="secondary" animate>
              <AnnouncementIcon color="action" />
            </AnimatedBadge>
            
          </Stack>
        ) : (
          <Stack
            horizontal
            tokens={gap}
            horizontalAlign="end"
            verticalAlign="center"
          >
            <Link to="/Login">Login</Link>
          </Stack>
        )}
         <Stack
            horizontal
            tokens={gap}
            horizontalAlign="end"
            verticalAlign="center"
          >
           <Menu />
          </Stack>
      </div>
    </Stack>
  );
};
export default NavBar;
