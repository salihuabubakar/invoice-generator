// slices/profileSlice.ts
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
      name,
      email,
      phone,
      password,
      oldPassword,
    }: { name?: string; email?: string; phone?: string; password?: string; oldPassword?: string },
    { rejectWithValue }
  ) => {
    try {
      const responses = [];
      
      if (name) {
        const nameResponse = await account.updateName(name);
        responses.push(nameResponse);
      }
      
      if (email) {
        const emailResponse = await account.updateEmail(email, oldPassword!);
        responses.push(emailResponse);
      }

      if (phone) {
        const phoneResponse = await account.updatePhone(phone, oldPassword!);
        responses.push(phoneResponse);
      }
      
      if (password && oldPassword) {
        const passwordResponse = await account.updatePassword(password, oldPassword);
        responses.push(passwordResponse);
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
      });
  },
});

export default profileSlice.reducer;
