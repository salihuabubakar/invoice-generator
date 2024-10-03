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
import { updateProfile, updatePassword } from '@/lib/slices/profileSlice';
import { FormStyle } from './AddInvoice';

interface Props {
  dispatch: any;
}

type Tab = 'profile' | 'password';

const paddingEffect = {
  '& .MuiInputBase-input': {
    paddingRight: '50px', // Customize padding here
  },
}

const ProfileModal: FC<Props> = ({ dispatch }) => {
  const isProfileModalOpen = useAppSelector((state) => state.profileModal.open);
  const { currentUser } = getCurrentUser();
  const { loading, error } = useAppSelector((state) => state.profile);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [tab, setTab] = useState<Tab>('profile');
  const [open, setOpen] = useState(isProfileModalOpen);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleClose = () => {
    setName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setOldPassword('');
    setOpen(dispatch(closeProfile()));
  };

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!oldPassword) {
      alert('Current password is required to update any field.');
      return;
    }
    try {
      await dispatch(updateProfile({ 
        currentName: currentUser.name,
        currentEmail: currentUser.email,
        currentPhone: currentUser.phone,
        name,
        email,
        phone,
        oldPassword
      })).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(`Failed to update profile: ${error}`);
    }
    handleClose();
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!oldPassword || !password) {
      alert('Current password and new password are required.');
      return;
    }
    try {
      await dispatch(updatePassword({ 
        password,
        oldPassword
      })).unwrap();
      toast.success('Password updated successfully!');
    } catch (err) {
      toast.error(`Failed to update password: ${error}`);
    }
    handleClose();
  };

  const getTabStyles = (currentTab: Tab) => ({
    borderBottom: tab === currentTab ? "4px solid #e5ab80" : "none",
    borderRadius: "4px",
    transition: "border-bottom 0.1s ease-in",
  });

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
            sx={FormStyle}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={tab === 'profile' ? handleProfileSubmit : handlePasswordSubmit}
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
            <div className="flex mt-2">
              <button
                style={getTabStyles("profile")}
                onClick={() => setTab("profile")}
                type='button'
                className="mr-4"
              >
                Profile
              </button>
              <button
                style={getTabStyles("password")}
                onClick={() => setTab("password")}
                type='button'
              >
                Change Password
              </button>
            </div>
            <div className='flex flex-col w-full'>
              {tab === 'profile' && (
                <>
                  <div className='mb-2 row'>
                    <TextField
                      required
                      placeholder="Name"
                      size='small'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-sm-6"
                    />
                    <TextField
                      required
                      placeholder="Email"
                      size='small'
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="col-sm-6"
                    />
                  </div>
                  <div className='mb-2 row password'>
                    <TextField
                      required
                      placeholder="Phone"
                      size='small'
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="col-sm-6"
                    />
                      <TextField
                        required
                        placeholder="Current Password"
                        size='small'
                        type={showPassword ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="col-sm-6"
                        sx={paddingEffect}
                      />
                      <span onClick={() => setShowPassword(prev => !prev)} className='text-sm'>{showPassword ? 'Hide' : 'Show'}</span>
                  </div>
                </>
              )}
              {tab === 'password' && (
                <div className='row password'>
                  <TextField
                    required
                    placeholder="Current Password"
                    size='small'
                    type={showPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="col-sm-6"
                    sx={paddingEffect}
                  />
                  <TextField
                    required
                    placeholder="New Password"
                    size='small'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="col-sm-6"
                    sx={paddingEffect}
                  />
                  <span onClick={() => setShowPassword(prev => !prev)} className='text-sm'>{showPassword ? 'Hide' : 'Show'}</span>
                </div>
              )}
            </div>
            <div className="flex justify-center items-center mt-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
              >
                {loading ? 'Updating...' : tab === 'profile' ? 'Update Profile' : 'Update Password'}
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ProfileModal;
