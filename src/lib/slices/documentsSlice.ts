// slices/documentsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, ID, AppwriteException } from '../../app/appwrite'; // Adjust the path as necessary

interface DocumentState {
  documents: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  loading: false,
  error: null,
};

// Async thunk for creating a document
export const createDocument = createAsyncThunk(
  'documents/createDocument',
  async (documentData: any, { rejectWithValue }) => {
    try {
      const response = await databases.createDocument(
        '66b8157100055f93735c',
        '66b8158c001b36a48c99',
        ID.unique(),
        documentData
      );
      return response;
    } catch (error) {
      if (error instanceof AppwriteException) {
        return rejectWithValue(error.message);
      }
      throw error;
    }
  }
);

// Async thunk for updating a document
export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async (
    { documentId, documentData }: { documentId: string; documentData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await databases.updateDocument(
        '66b8157100055f93735c',
        '66b8158c001b36a48c99',
        documentId,
        documentData
      );
      return response;
    } catch (error) {
      if (error instanceof AppwriteException) {
        return rejectWithValue(error.message);
      }
      throw error;
    }
  }
);

// Async thunk for deleting a document
export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId: string, { rejectWithValue }) => {
    try {
      await databases.deleteDocument('66b8157100055f93735c', '66b8158c001b36a48c99', documentId);
      return documentId;
    } catch (error) {
      if (error instanceof AppwriteException) {
        return rejectWithValue(error.message);
      }
      throw error;
    }
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle createDocument
      .addCase(createDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDocument.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.documents.push(action.payload);
      })
      .addCase(createDocument.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle updateDocument
      .addCase(updateDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const index = state.documents.findIndex(
          (doc) => doc.$id === action.payload.$id
        );
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      })
      .addCase(updateDocument.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle deleteDocument
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.documents = state.documents.filter((doc) => doc.$id !== action.payload);
      })
      .addCase(deleteDocument.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default documentsSlice.reducer;
