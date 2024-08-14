import React, { useState, useEffect, FC, FormEvent, Dispatch, SetStateAction } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { createDocument, updateDocument } from '@/lib/slices/documentsSlice';
import { closeModal } from '@/lib/slices/modalSlice';
import { toast } from 'react-toastify';
import { dateFormatter } from '@/utils/data_types';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #0b5688',
  boxShadow: 24,
  p: 4,
  '& .MuiTextField-root': { m: 1, width: '27ch' }
};

// Define a type for form data
interface FormData {
  customer_id: string;
  name: string;
  phone_number: string;
  email: string;
  address: string;
  date: string;
  valid_until: string;
  quote: string;
  description_of_work: string;
  items_description: string[];
  items_quantity: number[];
  items_unit: string[];
  items_price: number[];
}

interface AddInvoiceProps {
  existingData?: any;
  docId: string;
  dispatch: any;
  docIndex: number | string
}

const AddInvoice: FC<AddInvoiceProps> = ({ existingData, docId, docIndex, dispatch }) => {

  const isModalOpen = useAppSelector((state) => state.modal.open); 

  console.log("docId", docId, "docIndex", docIndex, "existingData", existingData);

  const [open, setOpen] = useState(isModalOpen);
  const [customerId, setCustomerId] = useState(existingData?.[docIndex]?.customer_id || '');
  const [name, setName] = useState(existingData?.[docIndex]?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(existingData?.[docIndex]?.phone_number || '');
  const [email, setEmail] = useState(existingData?.[docIndex]?.email || '');
  const [address, setAddress] = useState(existingData?.[docIndex]?.address || '');
  const [date, setDate] = useState(existingData?.[docIndex]?.date || '');
  const [validUntil, setValidUntil] = useState(existingData?.[docIndex]?.valid_until || '');
  const [quote, setQuote] = useState(existingData?.[docIndex]?.quote || '');
  const [descOfWork, setDescOfWork] = useState(existingData?.[docIndex]?.description_of_work || '');
  const [itemsDesc, setItemsDesc] = useState(existingData?.[docIndex]?.items_description || ['']);
  const [itemsQuantity, setItemsQuantity] = useState(existingData?.[docIndex]?.items_quantity || []);
  const [itemsUnit, setItemsUnit] = useState(existingData?.[docIndex]?.items_unit || ['']);
  const [itemsPrice, setItemsPrice] = useState(existingData?.[docIndex]?.items_price || []);

  const handleClose = () => {
    setOpen(dispatch(closeModal()));
    setCustomerId('');
    setName('hi');
    setPhoneNumber('');
    setEmail('');
    setAddress('');
    setDate('');
    setValidUntil('');
    setQuote('');
    setDescOfWork('');
    setItemsDesc(['']);
    setItemsQuantity([]);
    setItemsUnit(['']);
    setItemsPrice([]);
    console.log("close", "name", name)
  }

  const prevDate = existingData?.[docIndex]?.date;
  const prevValidUntilDate = existingData?.[docIndex]?.valid_until;

  const handleAddField = (setField: Dispatch<SetStateAction<string[]>>, field: string[]) => {
    setField([...field, '']);
  };

  const handleRemoveField = <T extends string | number>(
    index: number, 
    setField: Dispatch<SetStateAction<T[]>>, 
    field: T[]
  ) => {
    const updatedField = [...field];
    updatedField.splice(index, 1);
    setField(updatedField);
  };


  const handleChangeField = <T extends string | number>(
    index: number,
    value: T,
    setField: Dispatch<SetStateAction<T[]>>,
    field: T[]
  ) => {
    const updatedField = [...field];
    updatedField[index] = value;
    setField(updatedField);
  };
  

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check for empty fields
    if (
      !customerId ||
      !name ||
      !phoneNumber ||
      !email ||
      !address ||
      !date ||
      !validUntil ||
      !quote ||
      !descOfWork ||
      itemsDesc.some((item: string) => !item) ||
      itemsQuantity.some((item: number | any) => !item) ||
      itemsUnit.some((item: string) => !item) ||
      itemsPrice.some((item: number) => !item)
    ) {
      alert('Please fill out all required fields.');
      return;
    }
    const formData: FormData = {
      customer_id: customerId,
      name,
      phone_number: phoneNumber,
      email,
      address,
      date,
      valid_until: validUntil,
      quote,
      description_of_work: descOfWork,
      items_description: itemsDesc,
      items_quantity: itemsQuantity,
      items_unit: itemsUnit,
      items_price: itemsPrice
    };
    if(docId) {
      dispatch(updateDocument({documentId: docId, documentData: formData}))
      toast.success("Invoice updated");
    }else {
      dispatch(createDocument(formData));
      toast.success("Invoice Added");
    }

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
            <Typography className='text-center' id="transition-modal-title" variant="h6" component="h2">
              {docId ? 'Edit' : 'Add'} Invoice
            </Typography>
            <div>
              <TextField
                required
                label="Custom ID"
                size='small'
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
              <TextField
                required
                label="Name"
                size='small'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                required
                label="Phone Number"
                size='small'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <TextField
                required
                label="Email"
                size='small'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                required
                label="Address"
                size='small'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <TextField
                required
                label={`${docId ? `Prev-Date: ${dateFormatter(prevDate)}` : 'Date'}`}
                size='small'
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <TextField
                required
                label={`${docId ? `Prev-Valid Until: ${dateFormatter(prevValidUntilDate)}` : 'Valid Until'}`}
                size='small'
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
              <TextField
                required
                label="Quote"
                size='small'
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
              />
              <TextField
                required
                label="Desc of Work"
                size='small'
                multiline
                maxRows={4}
                value={descOfWork}
                onChange={(e) => setDescOfWork(e.target.value)}
              />
              {itemsDesc.map((item: any, index: number) => (
                <div key={index}>
                  <TextField
                    required
                    label="Items Desc"
                    size='small'
                    multiline
                    maxRows={4}
                    value={itemsDesc[index] || ''}
                    onChange={(e) => handleChangeField(index, e.target.value, setItemsDesc, itemsDesc)}
                  />
                  <TextField
                    required
                    label="Items Quantity"
                    type="number"
                    size='small'
                    value={itemsQuantity[index] || ''}
                    onChange={(e) => handleChangeField(index, Number(e.target.value), setItemsQuantity, itemsQuantity)}
                  />
                  <TextField
                    required
                    label="Items Unit"
                    size='small'
                    value={itemsUnit[index] || ''}
                    onChange={(e) => handleChangeField(index, e.target.value, setItemsUnit, itemsUnit)}
                  />
                  <TextField
                    required
                    label="Items Price"
                    type="number"
                    size='small'
                    value={itemsPrice[index] || ''}
                    onChange={(e) => handleChangeField(index, Number(e.target.value), setItemsPrice, itemsPrice)}
                  />
                  <Button onClick={() => handleAddField(setItemsDesc, itemsDesc)}>Add Item</Button>
                  {index > 0 && (
                    <>
                      { docId ? null : <Button onClick={() => handleRemoveField(index, setItemsDesc, itemsDesc)}>Remove Item</Button>}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className='flex justify-center'>
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
              >
                {docId ? 'Update' : 'Save'}
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default AddInvoice;
