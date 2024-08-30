import React, { useState, useEffect, FC, FormEvent } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../lib/hooks';
import { closeProfile } from '@/lib/slices/profileModalSlice';
import getCurrentUser from "../../hook/getCurrentUser";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #0b5688',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
  '& .MuiTextField-root': { m: 1, width: '27ch' }
};

interface Props {
  dispatch: any;
}

const ProfileModal: FC<Props> = ({ dispatch }) => {

  const isProfileModalOpen = useAppSelector((state) => state.profileModal.open);
  const { currentUser } = getCurrentUser();

  const [open, setOpen] = useState(isProfileModalOpen);
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhoneNumber(currentUser.phone || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleClose = () => {
    setOpen(dispatch(closeProfile()));
    setName('');
    setPhoneNumber('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !phoneNumber || !email || !password) {
      alert('Please fill out all required fields.');
      return;
    }

    // Dispatch your updateDocument action here

    toast.success("Profile updated");
    handleClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={style}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div className='flex justify-between items-center'>
              <Typography className='text-center' id="transition-modal-title" variant="h6" component="h1">
                My Profile
              </Typography>
              <button
                onClick={handleClose}
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-[#FE4066] shadow-md hover:bg-[#f75878] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
              >
                X
              </button>
            </div>
            <div className='flex flex-col w-full'>
              <div className='mb-2'>
                <TextField
                  required
                  label="Name"
                  size='small'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  required
                  label="Email"
                  size='small'
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <TextField
                  required
                  label="Phone Number"
                  size='small'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <TextField
                  required
                  label="New Password"
                  size='small'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className='flex justify-center'>
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
              >
                Save
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ProfileModal;
