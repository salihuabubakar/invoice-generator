import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { account, AppwriteException } from '../../app/appwrite';

interface ProfileState {
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  loading: false,
  error: null,
};

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (
    {
      currentName,
      currentEmail,
      currentPhone,
      name,
      email,
      phone,
      oldPassword,
    }: {
      currentName: string; currentEmail: string; currentPhone: string;
      name?: string; email?: string; phone?: string; oldPassword?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const responses = [];
      
      if (name && name !== currentName) {
        const nameResponse = await account.updateName(name);
        responses.push(nameResponse);
      }
      
      if (email && email !== currentEmail) {
        const emailResponse = await account.updateEmail(email, oldPassword!);
        responses.push(emailResponse);
      }

      if (phone && phone !== currentPhone) {
        const phoneResponse = await account.updatePhone(phone, oldPassword!);
        responses.push(phoneResponse);
      }

      return responses;
    } catch (error) {
      if (error instanceof AppwriteException) {
        return rejectWithValue(error.message);
      }
      throw error;
    }
  }
);

export const updatePassword = createAsyncThunk(
  'profile/updatePassword',
  async (
    { password, oldPassword }: { password: string; oldPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const passwordResponse = await account.updatePassword(password, oldPassword);
      return passwordResponse;
    } catch (error) {
      if (error instanceof AppwriteException) {
        return rejectWithValue(error.message);
      }
      throw error;
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
