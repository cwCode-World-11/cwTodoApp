import {useState} from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FaAngleDown } from "react-icons/fa";

export default function BasicPopover({label,children}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    // NOTE: dei ithu vanthu true or false thaan. why official documentation la ivalovu complicate irukku nu therla.
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button 
        aria-describedby={id} 
        variant="outlined" 
        onClick={handleClick} 
        style={{
          fontWeight:"bold"
        }}>
        {label} <FaAngleDown/>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {children}
      </Popover>
    </div>
  );
}
